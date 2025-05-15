import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

export type GetAccountResponse = {
  customer: {
    customerId: string;
    name: string;
  };
  paymentAccount: {
    mainnet: string;
    testnet: string;
  };
};

export type CreateAccountPayload = {
  name: string;
  id: string;
};

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);
  private readonly cheqdApi = axios.create({
    baseURL: 'https://studio-api.cheqd.net',
    headers: {
      'x-api-key': process.env.CHEQD_API_KEY!,
      'Authorization': `Bearer ${process.env.CHEQD_ID_TOKEN!}`,
      'Content-Type': 'application/json',
    },
  });

  async getAccount(): Promise<GetAccountResponse | undefined> {
    try {
      const { data } = await this.cheqdApi.get<GetAccountResponse>('/account');
      this.logger.log(`✅ Account fetched: ${JSON.stringify(data)}`);
      return data;
    } catch (error: any) {
      this.handleError(error, 'getAccount');
    }
  }

  private handleError(error: any, method: string) {
    if (error.response) {
      this.logger.error(`❌ ${method}: ${JSON.stringify(error.response.data)}`);
      this.logger.error(`❌ Status: ${error.response.status}`);
    } else if (error.request) {
      this.logger.error(`❌ ${method}: No response received`, error.request);
    } else {
      this.logger.error(`❌ ${method}: Axios config error: ${error.message}`);
    }
  }
}
