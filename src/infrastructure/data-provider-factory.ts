import { Injectable } from '@nestjs/common';
import { IDataProvider } from '../core/interface/data-provider.interface';
import { OpcUaService } from './opcua/opcua.service';

@Injectable()
export class DataProviderFactory {
  constructor(
    // private modbusService: ModbusService,
    // private mqttService: MqttService,
    private opcUaService: OpcUaService,
  ) {}

  getProvider(protocol: string): IDataProvider {
    switch (protocol) {
      //   case 'MODBUS_TCP': return this.modbusService;
      //   case 'MQTT': return this.mqttService;
      case 'OPC_UA':
        return this.opcUaService;
      default:
        throw new Error(`Unsupported protocol: ${protocol}`);
    }
  }
}
