export interface IFlatReadingResult {
  meterId: number;
  value: number;
  timestamp: Date;
}

export interface IDataProvider {
  readBulk(
    connectionInfo: unknown,
    mappingInfo: unknown,
  ): Promise<IFlatReadingResult[]>;
}
