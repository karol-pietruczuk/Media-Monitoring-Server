export interface IOpcUaBulkMapping {
  nodeId: string;
  meterIdPath: string;
  extractionPath: string;
  valuePath: string;
  timestampPath: string;
  defaultMeterId?: number; // Opcjonalne pole używane tylko przy odczycie pojedynczych wartości
}
