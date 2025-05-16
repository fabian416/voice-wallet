import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from "@langchain/openai";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { ChatService } from './chat.service';
import { Conversation } from './entities/Conversation.entity';
import { PersonalAgentKit, PersonalAgentKitOptions } from "@verida/personalagentkit";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { Tool } from '@langchain/core/tools';

@Injectable()
export class AgentService {
    private agent: any;
    private llm: any;
    private agentTools: Tool[];

    constructor(
        private readonly chatService: ChatService
    ) {}
    
    async onModuleInit() {
        // Initialize LLM
        const llm = new ChatOpenAI({
            model: "gpt-4o-mini",
            apiKey: process.env.OPENAI_API_KEY,
            temperature: 0,
        });            
        this.llm = llm;
    }

    async buildAgent(veridaAuthToken?: string) {
        let agentTools = [new TavilySearchResults({ maxResults: 3 })]

        // VERIDA AI
        /**
            if (veridaAuthToken) {
                const personalAgentkit = await PersonalAgentKit.from(<PersonalAgentKitOptions>{
                    veridaApiKey: process.env.VERIDA_API_KEY,
                    veridaApiEndpoint: process.env.VERIDA_API_ENDPOINT || undefined,
                });
                
                const tools = await getLangChainTools(personalAgentkit);
            }

            agentTools = [...agentTools, ...tools];
        */

            
        const agent = await createReactAgent({
            llm: this.llm,
            tools: agentTools,
        });
        return agent;
    }

    async formatMessage(conversation: Conversation) {
        if (!conversation.messages) {
            return [];
        }

        const messages = conversation.messages.map(message => {
            if (message.role === "user") {
                return new HumanMessage(message.content);
            } else {
                return new AIMessage(message.content);
            }
        })
        return messages;
    }

    async createNewChat() {
        return await this.chatService.createConversation("New Conversation");
    }

    /**
     * THE MAIN FUNCTION TO USE THE AGENT
     * Call the agent with the given message and conversation ID
     * @param message - The message to call the agent with
     * @param conversationId - The ID of the conversation
     * @returns The assistant response
     */
    async callAgent(message: string, conversationId: string, veridaAuthToken?: string) {
        // Fetching conversation and messages from database
        const conversation = await this.chatService.getOrCreateConversation(conversationId);
        const formattedMessages = await this.formatMessage(conversation);
        
        await this.chatService.storeMessage(conversation.id, message, "user");
        
        const agent = await this.buildAgent(veridaAuthToken);

        const finalState = await agent.invoke({ 
            messages: [...formattedMessages, new HumanMessage(message)]
        });


        
        // Storing and returning assistant response
        const assistantResponse = finalState.messages[finalState.messages.length - 1].content.toString();
        await this.chatService.storeMessage(conversation.id, assistantResponse, "assistant");
        return assistantResponse;
    }
}
