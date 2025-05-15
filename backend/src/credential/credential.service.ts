import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import type { CreateCredentialPayload, Credential } from './credential.types';

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

  async createCredential(payload: CreateCredentialPayload): Promise<Credential | undefined> {
    try {
      const { data } = await this.cheqdApi.post<Credential>('/credential/issue', {
        issuerDid: payload.issuerDid,
        subjectDid: `did:key:${payload.subjectDid}`,
        attributes: {
          groupID: payload.groupId,
          userID: payload.userId,
        },
        type: ['Join'],
        format: 'jwt',
        credentialStatus: {
          statusPurpose: 'revocation',
          statusListName: 'members-credentials',
          statusListIndex: 10,
        },
      });

      this.logger.log(`✅ Credential issued for user ${payload.userId}`);
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
}
