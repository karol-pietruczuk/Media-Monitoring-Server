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

      for (const meterStructure of rawData as Record<string, unknown>[]) {
        const plcMeterId = meterStructure[mappingInfo.meterIdPath];
        const recordsArray = meterStructure[mappingInfo.extractionPath];

        if (typeof plcMeterId !== 'number') continue;

        // Jeśli to tablica – bierzemy wszystko (po slice), jeśli pojedynczy obiekt – traktujemy jak tablicę 1-elementową
        const recordsToProcess = Array.isArray(recordsArray)
          ? recordsArray.slice(mappingInfo.startIndex ?? 0)
          : recordsArray
            ? [recordsArray]
            : [];

        for (const record of recordsToProcess as Record<string, unknown>[]) {
          const rawValue = record[mappingInfo.valuePath];
          const rawTimestamp = record[mappingInfo.timestampPath];

          const parsedValue =
            typeof rawValue === 'string'
              ? parseFloat(rawValue)
              : (rawValue as number);
          let parsedTimestamp: Date | null = null;

          if (typeof rawTimestamp === 'string') {
            let isoFriendlyStr = rawTimestamp
              .trim()
              .replace(' ', 'T')
              .replace(/(\.\d{3})\d+/, '$1');
            if (!isoFriendlyStr.endsWith('Z')) isoFriendlyStr += 'Z';
            parsedTimestamp = new Date(isoFriendlyStr);
          } else if (rawTimestamp instanceof Date) {
            parsedTimestamp = rawTimestamp;
          }

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

    const securityMode =
      MessageSecurityMode[
        config.securityMode as keyof typeof MessageSecurityMode
      ] ?? MessageSecurityMode.None;
    const securityPolicy =
      SecurityPolicy[config.securityPolicy as keyof typeof SecurityPolicy] ??
      SecurityPolicy.None;

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

    try {
      await session.readNamespaceArray();
      await session.extractNamespaceDataType();
    } catch (extraTypeError) {
      this.logger.warn(
        `DataType loading notice: ${extraTypeError instanceof Error ? extraTypeError.message : String(extraTypeError)}`,
      );
    }

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
      } finally {
        this.sessionsPool.delete(endpointUrl);
      }
    }
  }

  async onModuleDestroy() {
    for (const endpointUrl of this.sessionsPool.keys()) {
      await this.invalidateSession(endpointUrl);
    }
  }
}
