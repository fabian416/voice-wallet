import { Controller, Post } from '@nestjs/common';
import { VeridaService } from './verida.service';

@Controller('verida')
export class VeridaController {
  constructor(private readonly veridaService: VeridaService) {}

  @Post('account')
  async createVeridaAccount() {
    return this.veridaService.createAccount();
  }
}