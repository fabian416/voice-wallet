import { Controller, Get, Post, Body } from '@nestjs/common';
import { DidService } from './did.service';
import type { DidDoc } from './did.types';

@Controller('did')
export class DidController {
  constructor(private readonly didService: DidService) {}

  @Get('template')
  getTemplate() {
    return this.didService.createDIDDoc();
  }

  @Post('create')
  createDID(@Body() didDoc: DidDoc) {
    return this.didService.createDID(didDoc);
  }
}
