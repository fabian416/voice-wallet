import { Injectable, Logger } from '@nestjs/common';
import { create, IPFSHTTPClient } from 'ipfs-http-client';

@Injectable()
export class IpfsService {
  private readonly logger = new Logger(IpfsService.name);
  private readonly client: IPFSHTTPClient;

  constructor() {
    const projectId = process.env.INFURA_PROJECT_ID!;
    const projectSecret = process.env.INFURA_PROJECT_SECRET!;

    this.client = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
        authorization: `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString('base64')}`,
      },
    });
  }

  async uploadBase64(base64: string): Promise<string> {
    const { cid } = await this.client.add(base64);
    this.logger.log(`✅ Voiceprint uploaded to IPFS with CID: ${cid}`);
    const url = `https://ipfs.io/ipfs/${cid.toString()}`;
    return url;
  }
}