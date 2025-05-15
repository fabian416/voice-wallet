import { Controller, Post, Body } from '@nestjs/common';
import { CredentialService } from './credential.service';
import { CreateCredentialPayload } from './credential.types';

@Controller('credential')
export class CredentialController {
  constructor(private readonly credentialService: CredentialService) {}

  @Post('issue')
  createCredential(@Body() payload: CreateCredentialPayload) {
    return this.credentialService.createCredential(payload);
  }
}
