import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/Conversation.entity';
import { Message } from './entities/Message.entity';
import { AgentService } from './agent.service';
import { ChatService } from './chat.service';
import { AgentController } from './agent.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, Message])],
  providers: [AgentService, ChatService],
  exports: [AgentService, ChatService],
  controllers: [AgentController],
})
export class AgentModule {}
