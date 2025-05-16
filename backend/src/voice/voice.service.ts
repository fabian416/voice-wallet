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
    if (!file.buffer || file.buffer.length === 0) {
      throw new Error('Uploaded file is empty');
    }

    const tmpDir = path.resolve(__dirname, '../../../backend/tmp');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
  
    // Guardar temporalmente el .webm
    const inputPath = path.join(tmpDir, `${uuidv4()}.webm`);
    const wavPath = path.join(tmpDir, `${uuidv4()}.wav`);
    fs.writeFileSync(inputPath, file.buffer);
  
    try {
      // 🔁 Convertir .webm a .wav (formato requerido por resemblyzer)
      await execFileAsync('ffmpeg', [
        '-y', // overwrite
        '-i', inputPath,
        '-acodec', 'pcm_s16le',
        '-ac', '1',        // mono
        '-ar', '16000',    // 16kHz
        wavPath
      ]);
  
      // 🧠 Ejecutar el script Python con el .wav convertido
      const scriptPath = path.join(process.cwd(), 'voice-embedding', 'scripts', 'generate_embedding.py');
      const { stdout } = await execFileAsync('python3', [scriptPath, wavPath]);

      const voiceprint = stdout
        .split('\n')
        .filter((line) => line.trim() !== '')
        .pop()!;
      
      return voiceprint
    } catch (error) {
      console.error('Error generating voice embedding:', error);
      throw new Error('Voice embedding failed');
    } finally {
      // 🧹 Limpieza total
      if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
      if (fs.existsSync(wavPath)) fs.unlinkSync(wavPath);
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