import { Controller, Post, Body } from '@nestjs/common';
import { CredentialService } from './credential.service';
import { CreateCredentialPayloadDto } from './dto/create-credential-payload.dto';

@Controller('credential')
export class CredentialController {
  constructor(private readonly credentialService: CredentialService) {}

  @Post('issue')
  createCredential(@Body() payload: CreateCredentialPayloadDto) {
    return this.credentialService.createCredential(payload);
  }

  @Post('verify')
  verifyCredential(@Body() payload: {jwt: string}) {
    return this.credentialService.verifyCredential(payload.jwt);
  }
}
