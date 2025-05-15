import { Controller, Post, UploadedFile, UseInterceptors, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VoiceService } from './voice.service';

@Controller('voice')
export class VoiceController {
  constructor(private readonly voiceService: VoiceService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('audio'))
  async register(@UploadedFile() file: Express.Multer.File) {
    const embedding = await this.voiceService.generateEmbeddingBase64(file);
    // Here we can save it or emit in a Verify credential
    return { embedding };
  }

  @Post('verify')
  @UseInterceptors(FileInterceptor('audio'))
  async verify(
    @UploadedFile() file: Express.Multer.File,
    @Body('reference') reference: string // embedding registered previously
  ) {
    const current = await this.voiceService.generateEmbeddingBase64(file);
    const distance = await this.voiceService.compareEmbeddings(current, reference);

    return {
      distance,
      match: distance < 0.675,
    };
  }
}