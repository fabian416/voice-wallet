import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { IpfsModule } from '../ipfs/ipfs.module';
import { DidModule } from '../did/did.module';
import { DidLinkedResourceModule } from '../did-linked-resource/did-linked-resource.module';
import { CredentialModule } from '../credential/credential.module';
import { KeyModule } from '../key/key.module';

@Module({
  imports: [
    IpfsModule,
    DidModule,
    DidLinkedResourceModule,
    CredentialModule,
    KeyModule,
  ],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}