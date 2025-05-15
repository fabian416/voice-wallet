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

  async compareEmbeddings(base64A: string, base64B: string): Promise<number> {
    const a = Buffer.from(base64A, 'base64');
    const b = Buffer.from(base64B, 'base64');
    const embeddingA = new Float32Array(a.buffer, a.byteOffset, a.byteLength / 4);
    const embeddingB = new Float32Array(b.buffer, b.byteOffset, b.byteLength / 4);

    let sum = 0;
    for (let i = 0; i < embeddingA.length; i++) {
      const diff = embeddingA[i] - embeddingB[i];
      sum += diff * diff;
    }

    return Math.sqrt(sum);
  }
}