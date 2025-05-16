import { Controller, Post, UploadedFile, UseInterceptors, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VoiceService } from './voice.service';

@Controller('voice')
export class VoiceController {
  constructor(private readonly voiceService: VoiceService) {}

  @Post('create-voiceprint')
  @UseInterceptors(FileInterceptor('audio'))
  async register(@UploadedFile() file: Express.Multer.File) {
    const voiceprint = await this.voiceService.generateEmbeddingBase64(file);
    console.log(voiceprint);
    // Here we can save it or emit in a Verify credential
    return { voiceprint };
  }

  @Post('verify')
  @UseInterceptors(FileInterceptor('audio'))
  async verify(
    @UploadedFile() file: Express.Multer.File,
    @Body('reference') reference: string
  ) {
    // 🧠 Lanzamos ambas tareas en paralelo
    const embeddingPromise = this.voiceService.generateEmbeddingBase64(file);
    const transcriptionPromise = this.voiceService.transcribeAudio(file);
  
    // ⏳ Esperamos el embedding y comparamos
    const voiceprint = await embeddingPromise;
    const distance = await this.voiceService.compareEmbeddings(voiceprint, reference);
    const match = distance < 0.775;
  
    // 📝 Si hay match, esperamos la transcripción (ya en proceso)
    let transcription: string | undefined = undefined;
    if (match) {
      transcription = await transcriptionPromise;
    }
  
    return {
      distance,
      match,
      transcription,
    };
  }
  
}