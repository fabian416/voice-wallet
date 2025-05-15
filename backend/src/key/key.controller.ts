import { Controller, Post } from '@nestjs/common';
import { KeyService } from './key.service';

@Controller('key')
export class KeyController {
  constructor(private readonly keyService: KeyService) {}

  @Post()
  createKey() {
    return this.keyService.createKey();
  }
}
