import { Controller, Get, Post, Body } from '@nestjs/common';
import { DidService } from './did.service';
import type { DidDocDto } from './dto/create-did-doc-response.dto';

@Controller('did')
export class DidController {
  constructor(private readonly didService: DidService) {}

  @Get('template')
  getTemplate() {
    return this.didService.createDIDDoc();
  }

  @Post('create')
  createDID(@Body() didDoc: DidDocDto) {
    return this.didService.createDID(didDoc);
  }
}
