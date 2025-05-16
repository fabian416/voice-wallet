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
    // We launch both tasks in parallel
    const embeddingPromise = this.voiceService.generateEmbeddingBase64(file);
    const transcriptionPromise = this.voiceService.transcribeAudio(file);
  
    // We wait for the embedding and compare
    const voiceprint = await embeddingPromise;
    const distance = await this.voiceService.compareEmbeddings(voiceprint, reference);
    const match = distance < 0.775;
  
    // If there is a match, we wait for the transcription
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