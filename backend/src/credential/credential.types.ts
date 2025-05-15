export interface CreateCredentialPayload {
    issuerDid: string;
    subjectDid: string;
    groupId: string;
    userId: string;
  }
  
  export interface Credential {
    "@context": string[];
    type: string[];
    issuer: Issuer;
    issuanceDate: string;
    credentialSubject: CredentialSubject;
    credentialStatus: CredentialStatus;
    proof: Proof;
  }
  
  export interface Issuer {
    id: string;
  }
  
  export interface CredentialSubject {
    id: string;
    name: string;
    gender: string;
    groupID?: string;
    userID?: string;
  }
  
  export interface CredentialStatus {
    id: string;
    type: string;
    statusPurpose: string;
    statusListIndex: string;
  }
  
  export interface Proof {
    type: string;
    jwt: string;
  }
  