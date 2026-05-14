import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import {
  OPCUAClient,
  ClientSession,
  MessageSecurityMode,
  SecurityPolicy,
  UserTokenType,
  UserIdentityInfo,
} from 'node-opcua';
import { IDataProvider } from '../../core/interface/data-provider.interface';
import { OpcUaConnectionDto } from './dto/opcua-connection.dto';
import { IOpcUaMapping } from './interface/opcua-mapping.interface';

interface ICachedSession {
  client: OPCUAClient;
  session: ClientSession;
  lastUsed: Date;
}

@Injectable()
export class OpcUaService implements IDataProvider, OnModuleDestroy {
  private readonly logger = new Logger(OpcUaService.name);
  // Pula przechowująca aktywne sesje, kluczem jest endpointUrl
  private sessionsPool = new Map<string, ICachedSession>();

  // Implementacja kontraktu dla wartości całkowitych
  async readTotalValue(
    connectionInfo: OpcUaConnectionDto,
    mappingInfo: IOpcUaMapping,
  ): Promise<any> {
    return this.readNodeValue(connectionInfo, mappingInfo);
  }

  // Implementacja kontraktu dla wartości impulsowych (jeśli idą przez OPC-UA)
  async readPulseValue(
    connectionInfo: OpcUaConnectionDto,
    mappingInfo: IOpcUaMapping,
  ): Promise<any> {
    return this.readNodeValue(connectionInfo, mappingInfo);
  }

  private async readNodeValue(
    connectionInfo: OpcUaConnectionDto,
    mappingInfo: IOpcUaMapping,
  ): Promise<any> {
    const session = await this.getOrCreateSession(connectionInfo);

    try {
      const dataValue = await session.read({
        nodeId: mappingInfo.nodeId,
        attributeId: 13, // 13 odpowiada wartości atrybutu "Value" w specyfikacji OPC-UA
      });

      if (!dataValue || dataValue.statusCode.value !== 0) {
        throw new Error(
          `Failed to read NodeId ${mappingInfo.nodeId}. Status: ${dataValue?.statusCode.toString()}`,
        );
      }

      const rawValue = dataValue.value?.value as unknown;

      //   if (typeof rawValue !== 'number') {
      //     throw new Error(
      //       `NodeId ${mappingInfo.nodeId} returned non-numeric value: ${typeof rawValue}`,
      //     );
      //   }

      return rawValue;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      this.logger.error(
        `Error reading node ${mappingInfo.nodeId} from ${connectionInfo.endpointUrl}: ${errorMessage}`,
      );

      // W razie zerwania sesji usuwamy ją z cache, aby kolejny interwał spróbował połączyć się na nowo
      // Używamy await, ponieważ funkcja invalidateSession zwraca Promise<void>
      await this.invalidateSession(connectionInfo.endpointUrl);

      throw error;
    }
  }

  // Upewnij się, że na samej górze pliku pośród importów z 'node-opcua' znajduje się:
  // import { OPCUAClient, ClientSession, MessageSecurityMode, SecurityPolicy, UserTokenType, UserIdentityInfo } from 'node-opcua';

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
      connectionStrategy: {
        maxRetry: 2,
        initialDelay: 1000,
        maxDelay: 5000,
      },
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
        // Ignorujemy błędy przy zamykaniu martwego połączenia
      } finally {
        this.sessionsPool.delete(endpointUrl);
        this.logger.warn(
          `Session for ${endpointUrl} has been invalidated and removed from pool.`,
        );
      }
    }
  }

  // Zabezpieczenie: zamykamy wszystkie połączenia w puli przy wyłączaniu aplikacji NestJS
  async onModuleDestroy() {
    this.logger.log('Closing all active OPC-UA sessions in the pool...');
    for (const endpointUrl of this.sessionsPool.keys()) {
      await this.invalidateSession(endpointUrl);
    }
  }
}
