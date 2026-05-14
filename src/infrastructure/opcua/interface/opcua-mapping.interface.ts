export interface IOpcUaMapping {
  nodeId: string; // np. "ns=2;s=HalaA.Robot1.StatusBlock"
  extractionPath?: string; // np. "telemetry.energy.value" lub "data[0]"
}
