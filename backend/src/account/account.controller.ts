import { Controller, Post, Body } from '@nestjs/common';
import { AccountService, CreateAccountPayload } from './account.service';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('create')
  createAccount(@Body() body: CreateAccountPayload) {
    return this.accountService.createAccount(body);
  }
}