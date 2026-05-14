export interface IDataProvider {
  readTotalValue(connectionInfo: any, mappingInfo: any): Promise<number>;
  readPulseValue?(connectionInfo: any, mappingInfo: any): Promise<number>;
}
