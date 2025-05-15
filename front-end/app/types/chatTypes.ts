export interface Message {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: string;
}

export interface Conversation {
    id: string;
    title: string;
    messages: Message[];
}

export interface UserMessage {
    message: string;
} 

export interface Chat {
    id: string;
    title: string;
}

export interface Message {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: string;
}