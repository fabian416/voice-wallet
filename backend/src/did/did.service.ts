import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import type { CreateDIDDocResponseDto, DidDocDto } from './dto/create-did-doc-response.dto';


@Injectable()
export class DidService {
  private readonly logger = new Logger(DidService.name);
  private readonly cheqdApi = axios.create({
    baseURL: 'https://studio-api.cheqd.net',
    headers: {
      'x-api-key': process.env.CHEQD_API_KEY!,
      'Content-Type': 'application/json',
    },
  });

  private readonly network = process.env.CHEQD_NETWORK!;

  async createDIDDoc(publicKeyHex: string = process.env.CHEQD_ISSUER_PUBLIC_KEY!): Promise<CreateDIDDocResponseDto | undefined> {
    try {
      const url = `https://did-registrar.cheqd.net/1.0/did-document?verificationMethod=Ed25519VerificationKey2020&methodSpecificIdAlgo=uuid&network=${this.network}&publicKeyHex=${publicKeyHex}`;
      const { data } = await axios.get<CreateDIDDocResponseDto>(url);
      this.logger.log(`✅ DID Document template fetched`);
      return data;
    } catch (error: any) {
      this.logger.error('❌ Error fetching DID Doc template', error.message);
    }
  }

  async createDID(didDoc: DidDocDto, publicKeyHex: string = process.env.CHEQD_ISSUER_PUBLIC_KEY!): Promise<string | undefined> {
    try {
      const { data } = await this.cheqdApi.post<{ did: string }>('/did/create', {
        network: this.network,
        identifierFormatType: 'uuid',
        options: {
          key: publicKeyHex,
          verificationMethodType: 'Ed25519VerificationKey2018',
        },
        didDocument: didDoc,
      });

      this.logger.log(`✅ DID created: ${data.did}`);
      return data.did;
    } catch (error: any) {
      if (error.response) {
        this.logger.error(`❌ createDID: ${JSON.stringify(error.response.data)}`);
        this.logger.error(`❌ Status: ${error.response.status}`);
      } else if (error.request) {
        this.logger.error('❌ createDID: No response received', error.request);
      } else {
        this.logger.error(`❌ createDID: Axios config error: ${error.message}`);
      }
    }
  }
}
