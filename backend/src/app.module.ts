import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './account/entities/account.entity';
import { AccountModule } from './account/account.module';
import { IpfsModule } from './ipfs/ipfs.module';
import { KeyModule } from './key/key.module';
import { DidModule } from './did/did.module';
import { DidLinkedResourceModule } from './did-linked-resource/did-linked-resource.module';
import { CredentialModule } from './credential/credential.module';
import { VoiceModule } from './voice/voice.module'; 
import { AgentModule } from './agent/agent.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      synchronize: true,
      autoLoadEntities: true,
    }),
    AccountModule,
    IpfsModule,
    KeyModule,
    DidModule,
    DidLinkedResourceModule,
    CredentialModule,
    VoiceModule,
    AgentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}