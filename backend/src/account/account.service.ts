import { Injectable, Logger } from '@nestjs/common';
import { IpfsService } from 'src/ipfs/ipfs.service';
import { DidService } from 'src/did/did.service';
import { DidLinkedResourceService } from 'src/did-linked-resource/did-linked-resource.service';
import { CredentialService } from 'src/credential/credential.service';
import { KeyService } from 'src/key/key.service';
import { CreateCredentialPayloadDto } from 'src/credential/dto/create-credential-payload.dto';


export interface CreateAccountPayload {
  voiceprint: string;
}

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(
    private readonly ipfsService: IpfsService,
    private readonly didService: DidService,
    private readonly didLinkedResourceService: DidLinkedResourceService,
    private readonly credentialService: CredentialService,
    private readonly keyService: KeyService
  ) {}

  async createAccount(payload: CreateAccountPayload) {
    const { voiceprint } = payload;

    const ipfsBase64Url = await this.ipfsService.uploadBase64(voiceprint);

    const didDocTemplate = await this.didService.createDIDDoc();
    if (!didDocTemplate) throw new Error('No se pudo obtener el DID Document template');

    const newDid = await this.didService.createDID(didDocTemplate.didDoc);
    if (!newDid) throw new Error('No se pudo crear el DID');

    const ipfsUrlEncoded = toBase64Url(ipfsBase64Url);
    const linkedResource = await this.didLinkedResourceService.createDidLinkedResource({
      did: newDid,
      embeddingBase64Url: ipfsUrlEncoded,
      name: 'VoiceprintEmbedding',
      version: '1.0.0',
    });
    if (!linkedResource) throw new Error('No se pudo crear el Did Linked Resource');

    const newSigner = await this.createNewSigner();

    let credentialPayload: CreateCredentialPayloadDto = {
      signer: newSigner,
      subjectDid: newDid,
      voiceprint: {
        resourceType: linkedResource.resource.resourceType,
        voiceResourceURI: linkedResource.resource.resourceURI,
        resourceName: linkedResource.resource.resourceName,
        resourceVersion: linkedResource.resource.resourceVersion,
        mediaType: linkedResource.resource.mediaType,
      }
    };

   const credential = await this.credentialService.createCredential(credentialPayload);
    if (!credential) throw new Error('No se pudo crear la Credencial');

    return {
      did: newDid,
      linkedResource: linkedResource.resource.resourceId,
      credential,
    };
  }

     /*
    let credential;
    try {
      credential = await this.credentialService.createCredential(credentialPayload);
    } catch {
      const newSigner = await this.createNewSigner();
      credentialPayload.signer = newSigner;
      credential = await this.credentialService.createCredential(credentialPayload);
    }
    */

  
  async createNewSigner() {
    const publicKeyHex = await this.keyService.createKey();
    const didDocTemplate = await this.didService.createDIDDoc(publicKeyHex);
    if (!didDocTemplate) throw new Error('No se pudo obtener el DID Document template');

    // 3. Crear el DID usando ese template
    const newDid = await this.didService.createDID(didDocTemplate.didDoc, publicKeyHex);
    if (!newDid) throw new Error('No se pudo crear el DID');

    return newDid;
  }
}

function toBase64Url(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}