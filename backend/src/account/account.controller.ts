import { Controller, Get, Post, Body } from '@nestjs/common';
import { AccountService, CreateAccountPayload } from './account.service';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  getAccount() {
    return this.accountService.getAccount();
  }
}
