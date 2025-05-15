import { Injectable } from '@nestjs/common';
import { execFile } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const execFileAsync = promisify(execFile);

@Injectable()
export class VoiceService {
  // Receive a file form the frontend (buffer) and then process it 
  async generateEmbeddingBase64(file: Express.Multer.File): Promise<string> {
    // Save temporary the auido
    const tmpPath = path.resolve(__dirname, `../../../tmp/${uuidv4()}.wav`);
    fs.writeFileSync(tmpPath, file.buffer);

    const scriptPath = path.resolve(__dirname, '../../../scripts/voice_embedding/generate_embedding.py');

    try {
      const { stdout } = await execFileAsync('python3', [scriptPath, tmpPath]);
      return stdout.trim();
    } catch (error) {
      console.error('Error generating voice embedding:', error);
      throw new Error('Voice embedding failed');
    } finally {
      // Alwas remove the temporary file even if it fails
      fs.unlinkSync(tmpPath);
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