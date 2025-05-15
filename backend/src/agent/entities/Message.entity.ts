import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Conversation } from "./Conversation.entity";

@Entity()
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    content: string;

    @Column()
    role: string; // 'human' or 'assistant'

    @CreateDateColumn()
    timestamp: Date;

    @ManyToOne(() => Conversation, conversation => conversation.messages)
    conversation: Conversation;

    @Column('json', { nullable: true })
    metadata: Record<string, any>; // For storing any additional message metadata
}