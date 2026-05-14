export class OpcUaConnectionDto {
  endpointUrl!: string; // np. "opc.tcp://192.168.1.100:4840"
  securityMode?: 'None' | 'Sign' | 'SignAndEncrypt';
  securityPolicy?: 'None' | 'Basic256Sha256' | 'Aes128_Sha256_RsaOaep';
  username?: string;
  password?: string;
}
