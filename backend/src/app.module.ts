import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountController } from './account/account.controller';
import { AccountService } from './account/account.service';
import { KeyController } from './key/key.controller';
import { KeyService } from './key/key.service';
import { DidService } from './did/did.service';
import { DidController } from './did/did.controller';
import { CredentialService } from './credential/credential.service';
import { CredentialController } from './credential/credential.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController, AccountController, KeyController, DidController, CredentialController],
  providers: [AppService, AccountService, KeyService, DidService, CredentialService],
})

export class AppModule {}