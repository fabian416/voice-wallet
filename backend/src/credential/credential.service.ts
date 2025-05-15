import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import type { CreateCredentialPayloadDto } from './dto/create-credential-payload.dto';
import type { CredentialDto } from './dto/credential.dto';

@Injectable()
export class CredentialService {
  private readonly logger = new Logger(CredentialService.name);
  private readonly cheqdApi = axios.create({
    baseURL: 'https://studio-api.cheqd.net',
    headers: {
      'x-api-key': process.env.CHEQD_API_KEY!,
      'Content-Type': 'application/json',
    },
  });

  async createCredential(payload: CreateCredentialPayloadDto): Promise<CredentialDto | undefined> {
    try {
      const { data } = await this.cheqdApi.post<CredentialDto>('/credential/issue', {
        issuerDid: process.env.CHEQD_ISSUER_DID,
        subjectDid: `did:key:${payload.subjectDid}`,
        attributes: {
            name: payload.name,
            lastname: payload.lastname,
            email: payload.email,
            voiceprint: payload.voiceprint,
        },
        type: ['Join'],
        format: 'jwt',
        credentialStatus: {
          statusPurpose: 'revocation',
          statusListName: 'members-credentials',
          statusListIndex: 10,
        },
      });

      this.logger.log(`✅ Credential issued for user ${payload.name}`);
      return data;
    } catch (error: any) {
      if (error.response) {
        this.logger.error(`❌ createCredential: ${JSON.stringify(error.response.data)}`);
        this.logger.error(`❌ Status: ${error.response.status}`);
      } else if (error.request) {
        this.logger.error('❌ createCredential: No response received', error.request);
      } else {
        this.logger.error(`❌ createCredential: Axios config error: ${error.message}`);
      }
    }
  }


  async verifyCredential(jwt: string): Promise<any> {
    console.log({jwt});
    try {
      const { data } = await this.cheqdApi.post('/credential/verify', {
        credential: jwt,
        policies: {
          issuanceDate: true,
          expirationDate: true,
          audience: false,
        },
      });

      this.logger.log(`🟢 VC verificada correctamente`);
      return data;
    } catch (error: any) {
      if (error.response) {
        this.logger.error(`❌ verifyCredential: ${JSON.stringify(error.response.data)}`);
        this.logger.error(`❌ Status: ${error.response.status}`);
        throw new Error(`Verification failed: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        this.logger.error('❌ verifyCredential: No response received', error.request);
        throw new Error('Verification failed: no response received');
      } else {
        this.logger.error(`❌ verifyCredential: ${error.message}`);
        throw new Error(`Verification failed: ${error.message}`);
      }
    }

  }
}
