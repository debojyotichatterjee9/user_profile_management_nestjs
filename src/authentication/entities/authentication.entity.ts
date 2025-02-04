import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'sessions' })
@Index(['user_email', 'user_id', 'token'], { unique: true })
export class Authentication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  key: string;

  @Column({ nullable: false })
  token: string;

  @Column({ nullable: false })
  refresh_token: string;

  @Column({ nullable: false })
  user_id: string;

  @Column({ nullable: false })
  user_email: string;

  @Column({ nullable: false })
  user_agent: string;

  @Column({ nullable: false })
  ip: string;

  @Column({ default: false })
  token_expired: boolean;

  @Column({ default: false })
  refresh_token_expired: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  last_accessed_on: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_on: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_on: Date;
}
