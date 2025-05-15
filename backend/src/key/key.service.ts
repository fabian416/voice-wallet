import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class KeyService {
  private readonly logger = new Logger(KeyService.name);
  private readonly cheqdApi = axios.create({
    baseURL: 'https://studio-api.cheqd.net',
    headers: {
      'x-api-key': process.env.CHEQD_API_KEY!,
      'Content-Type': 'application/json',
    },
  });

  async createKey(): Promise<string | undefined> {
    try {
      const { data } = await this.cheqdApi.post<{ publicKeyHex: string }>('/key/create');
      this.logger.log(`✅ Key created: ${data.publicKeyHex}`);
      return data.publicKeyHex;
    } catch (error: any) {
      if (error.response) {
        this.logger.error(`❌ createKey: ${JSON.stringify(error.response.data)}`);
        this.logger.error(`❌ Status: ${error.response.status}`);
      } else if (error.request) {
        this.logger.error('❌ createKey: No response received', error.request);
      } else {
        this.logger.error(`❌ createKey: Axios config error: ${error.message}`);
      }
    }
  }
}
