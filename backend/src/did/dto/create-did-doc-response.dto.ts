export class CreateDIDDocResponseDto {
  didDoc: DidDocDto;
  key: {
    kid: string;
    publicKeyHex: string;
  };
}

export class DidDocDto {
    id: string;
    controller: string[];
    verificationMethod: VerificationMethodDto[];
    authentication: string[];
  }
  
  export class VerificationMethodDto {
    id: string;
    type: string;
    controller: string;
    publicKeyMultibase: string;
  }