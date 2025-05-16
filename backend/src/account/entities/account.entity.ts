import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class AccountEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  did: string;

  @Column()
  ipfsUrl: string;

  @Column()
  linkedResourceId: string;

  @Column('simple-json')
  credential: any;

  @CreateDateColumn()
  createdAt: Date;
}