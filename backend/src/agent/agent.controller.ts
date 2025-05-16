import { Controller, Get, Param, ParseUUIDPipe, Post, Body } from '@nestjs/common';
import { UserMessage } from './dtos/userMessage.dto';
import { UUID } from 'crypto';
import { AgentService } from './agent.service';
import { ChatService } from './chat.service';

@Controller('agent')
export class AgentController {

    constructor(
        private readonly agentService: AgentService,
        private readonly chatService: ChatService
    ) {}

    @Post('chat/:id')
    async getAgent( @Body() body: UserMessage, @Param('id', ParseUUIDPipe) id: UUID
    ) {
      const {message, veridaAuthToken} = body;
      return await this.agentService.callAgent(message, id, veridaAuthToken);
    }
  
    @Post('new_chat')
    async newChat() {
      return await this.agentService.createNewChat();
    }
  
    @Get('chat')
    async getChats() {
      return await this.chatService.getConversations();
    }
  
    @Get('chat/:id')
    async getChat(@Param('id', ParseUUIDPipe) id: UUID) {
      return await this.chatService.getConversationHistory(id);
    }
}
