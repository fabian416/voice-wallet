import { Injectable } from "@nestjs/common";
import { Message } from "./entities/Message.entity";
import { Repository } from "typeorm";
import { Conversation } from "./entities/Conversation.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ChatService {
    
    constructor(
        @InjectRepository(Conversation)
        private conversationRepository: Repository<Conversation>,
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
    ) {}

    async createConversation(title: string) {
        const conversation = this.conversationRepository.create({ title });
        return await this.conversationRepository.save(conversation);
    }

    async getOrCreateConversation(conversationId?: string) {
        if (!conversationId) {
            return await this.createConversation("New Conversation");
        }

        const conversation = await this.conversationRepository.findOne({ where: { id: conversationId }, relations: ['messages'] });
        if (!conversation) {
            return await this.createConversation("New Conversation");
        }
        return conversation;
    }

    async getConversations() {
        return await this.conversationRepository.find();
    }

    async getConversationHistory(conversationId: string) {
        return await this.messageRepository.find({ 
            where: { conversation: { id: conversationId } },
            order: { timestamp: 'ASC' }
        });
    }

    async storeMessage(conversationId: string, message: string, role: "user" | "assistant") {
        const messageEntity = this.messageRepository.create({ 
            content: message, 
            role: role,
            conversation: { id: conversationId } 
        });

        return await this.messageRepository.save(messageEntity);
    }
    
}