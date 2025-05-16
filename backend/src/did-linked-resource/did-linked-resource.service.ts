import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { CreateDidLinkedResourceDto } from './dto/create-did-linked-resource.dto';
import { createHash } from 'crypto';

@Injectable()
export class DidLinkedResourceService {
  private readonly logger = new Logger(DidLinkedResourceService.name);
  private readonly cheqdApiUrl = 'https://studio-api.cheqd.net';
  private readonly apiKey = process.env.CHEQD_API_KEY!;

  async createDidLinkedResource(dto: CreateDidLinkedResourceDto) {
    const { did, embeddingBase64Url, name, version } = dto;
    const url = `${this.cheqdApiUrl}/resource/create/${did}`;

    const body = {
      data: embeddingBase64Url,
      encoding: 'base64url',
      name,
      type: 'VoiceEmbedding',
      version,
    };

    try {
      const response = await axios.post(url, body, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
      });

      this.logger.log(`✅ Did-Linked Resource created: ${response.data.resource?.resourceId}`);
      return response.data;
    } catch (error: any) {
      this.logger.error('❌ Error creating resource:', error.response?.data || error.message);
      throw error;
    }
  }

  async fetchDidLinkedResource(did: string, resourceId: string) {
    const url = `${this.cheqdApiUrl}/resource/search/${did}?resourceId=${resourceId}`;
  
    try {
        const response = await axios.get(url, {
            headers: {
            'x-api-key': this.apiKey,
            'Accept': 'text/plain',
            },
            responseType: 'text',
        });
    
        const text = response.data.trim();
        
        this.logger.log(`✅ Fetched resource ${resourceId} for DID ${did}`);
        return {
            resourceId,
            content: text,
        };
    } catch (error: any) {
      this.logger.error('❌ Error fetching resource:', error.response?.data || error.message);
      throw error;
    }
  }
  

}
