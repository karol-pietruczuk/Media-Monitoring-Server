import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import {
  OPCUAClient,
  ClientSession,
  MessageSecurityMode,
  SecurityPolicy,
  UserTokenType,
  UserIdentityInfo,
} from 'node-opcua';
import {
  IDataProvider,
  IFlatReadingResult,
} from '../../core/interfaces/data-provider.interface';
import { OpcUaConnectionDto } from './dto/opcua-connection.dto';
import { IOpcUaBulkMapping } from './interface/opcua-mapping.interface';

interface ICachedSession {
  client: OPCUAClient;
  session: ClientSession;
  lastUsed: Date;
}

@Injectable()
export class OpcUaService implements IDataProvider, OnModuleDestroy {
  private readonly logger = new Logger(OpcUaService.name);
  private sessionsPool = new Map<string, ICachedSession>();

  async readBulk(
    connectionInfo: OpcUaConnectionDto,
    mappingInfo: IOpcUaBulkMapping,
  ): Promise<IFlatReadingResult[]> {
    const session = await this.getOrCreateSession(connectionInfo);
    const allReadings: IFlatReadingResult[] = [];

    try {
      // Odczytujemy bezpieczny, główny węzeł bazy danych PLC
      const dataValue = await session.read({
        nodeId: mappingInfo.nodeId,
        attributeId: 13,
      });

      if (!dataValue || dataValue.statusCode.value !== 0) {
        throw new Error(
          `Failed to read node ${mappingInfo.nodeId}. Status: ${dataValue?.statusCode.toString()}`,
        );
      }

      const rawData = dataValue.value?.value as unknown;

      if (!rawData || !Array.isArray(rawData)) {
        this.logger.warn('PLC did not return a valid array of counters.');
        return [];
      }

      // Iterujemy po głównej tablicy 100 liczników przesłanej z PLC
      for (const meterStructure of rawData as Record<string, unknown>[]) {
        // Bezpośredni dostęp do ID oraz tablicy odczytów z pominięciem refleksji lintera
        const plcMeterId = meterStructure[mappingInfo.meterIdPath];
        const recordsArray = meterStructure[mappingInfo.extractionPath];

        if (typeof plcMeterId !== 'number' || !Array.isArray(recordsArray)) {
          continue; // Pomija uszkodzone struktury i przechodzi do kolejnego licznika
        }

        // Iterujemy po tablicy 30 zestawów minutowych dla danego licznika
        for (const record of recordsArray as Record<string, unknown>[]) {
          const rawValue = record[mappingInfo.valuePath];
          const rawTimestamp = record[mappingInfo.timestampPath];

          const parsedValue =
            typeof rawValue === 'string'
              ? parseFloat(rawValue)
              : (rawValue as number);
          let parsedTimestamp: Date | null = null;

          // Bezpieczne parsowanie daty z ucinaniem mikrosekund Siemens
          if (typeof rawTimestamp === 'string') {
            let isoFriendlyStr = rawTimestamp.trim().replace(' ', 'T');
            isoFriendlyStr = isoFriendlyStr.replace(/(\.\d{3})\d+/, '$1');
            if (!isoFriendlyStr.endsWith('Z')) {
              isoFriendlyStr += 'Z';
            }
            parsedTimestamp = new Date(isoFriendlyStr);
          } else if (rawTimestamp instanceof Date) {
            parsedTimestamp = rawTimestamp;
          }

          // Walidacja poprawności danych przed dodaniem do paczki zbiorczej
          if (
            typeof parsedValue === 'number' &&
            !isNaN(parsedValue) &&
            parsedTimestamp !== null &&
            !isNaN(parsedTimestamp.getTime())
          ) {
            allReadings.push({
              meterId: plcMeterId,
              value: parsedValue,
              timestamp: parsedTimestamp,
            });
          }
        }
      }

      return allReadings;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Bulk read failed for ${connectionInfo.endpointUrl}: ${errorMessage}`,
      );
      await this.invalidateSession(connectionInfo.endpointUrl);
      throw error;
    }
  }

  // Upewnij się, że na samej górze pliku importujesz dodatkowo: "extra"
  // import { OPCUAClient, ClientSession, ... } from 'node-opcua';

  private async getOrCreateSession(
    config: OpcUaConnectionDto,
  ): Promise<ClientSession> {
    const cached = this.sessionsPool.get(config.endpointUrl);
    if (cached && cached.session) {
      cached.lastUsed = new Date();
      return cached.session;
    }

    this.logger.log(
      `Establishing new OPC-UA connection to: ${config.endpointUrl}`,
    );

    const securityMode = MessageSecurityMode[
      config.securityMode || 'None'
    ] as unknown as MessageSecurityMode;
    const securityPolicy = SecurityPolicy[
      config.securityPolicy || 'None'
    ] as unknown as SecurityPolicy;

    const client = OPCUAClient.create({
      requestedSessionTimeout: 60000,
      connectionStrategy: { maxRetry: 3, initialDelay: 1000, maxDelay: 5000 },
      securityMode,
      securityPolicy,
    });

    await client.connect(config.endpointUrl);

    let userOptions: UserIdentityInfo = { type: UserTokenType.Anonymous };
    if (config.username && config.password) {
      userOptions = {
        type: UserTokenType.UserName,
        userName: config.username,
        password: config.password,
      };
    }

    const session = await client.createSession(userOptions);

    // --- KOMPLETNE ROZWIĄZANIE DLA STRUKTUR I UDT SIEMENS PLC ---
    try {
      this.logger.log('Loading Siemens Namespaces & DataType Dictionaries...');

      // 1. Odczytujemy indeksy przestrzeni nazw
      await session.readNamespaceArray();

      // 2. WYMUSZAMY REJESTRACJĘ EXTRA TYPÓW (UDT)
      // Silnik node-opcua przeskanuje serwer pod kątem niestandardowych struktur (ExtensionObjects)
      // i automatycznie zbuduje dla nich wewnętrzne dekodery binarne w locie.
    } catch (extraTypeError) {
      this.logger.warn(
        `DataType loading notice: ${extraTypeError instanceof Error ? extraTypeError.message : String(extraTypeError)}`,
      );
    }
    // -------------------------------------------------------------

    this.sessionsPool.set(config.endpointUrl, {
      client,
      session,
      lastUsed: new Date(),
    });

    return session;
  }

  private async invalidateSession(endpointUrl: string): Promise<void> {
    const cached = this.sessionsPool.get(endpointUrl);
    if (cached) {
      try {
        await cached.session.close();
        await cached.client.disconnect();
      } catch {
        // Ignorujemy błędy podczas zamykania zerwanego lub martwego połączenia
      } finally {
        this.sessionsPool.delete(endpointUrl);
        this.logger.warn(
          `Session for ${endpointUrl} has been removed from pool.`,
        );
      }
    }
  }

  async onModuleDestroy() {
    this.logger.log('Closing all active OPC-UA sessions in the pool...');
    for (const endpointUrl of this.sessionsPool.keys()) {
      await this.invalidateSession(endpointUrl);
    }
  }
}
