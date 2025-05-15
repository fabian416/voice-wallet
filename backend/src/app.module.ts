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
import { DidLinkedResourceService } from './did-linked-resource/did-linked-resource.service';
import { DidLinkedResourceController } from './did-linked-resource/did-linked-resource.controller';
import { CredentialModule } from './credential/credential.module';
import { AgentModule } from './agent/agent.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      synchronize: true,
    }),
    CredentialModule,
    AgentModule
  ],
  controllers: [AppController, AccountController, KeyController, DidController, CredentialController, DidLinkedResourceController],
  providers: [AppService, AccountService, KeyService, DidService, CredentialService, DidLinkedResourceService],
})

export class AppModule {}