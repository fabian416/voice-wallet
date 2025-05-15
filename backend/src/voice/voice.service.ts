import { Injectable } from '@nestjs/common';
import { execFile } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';

const execFileAsync = promisify(execFile);

@Injectable()
export class VoiceService {
  async generateEmbeddingBase64(audioPath: string): Promise<string> {
    const scriptPath = path.resolve(__dirname, '../../../scripts/generate_embedding.py');

    try {
      const { stdout } = await execFileAsync('python3', [scriptPath, audioPath]);
      return stdout.trim(); // This will be the string base64
    } catch (error) {
      console.error('Error generating voice embedding:', error);
      throw new Error('Voice embedding failed');
    }
  }
}