export interface IOpcUaBulkMapping {
  nodeId: string;
  meterIdPath: string;
  extractionPath: string;
  valuePath: string;
  timestampPath: string;
  defaultMeterId?: number;
  startIndex?: number;
}
