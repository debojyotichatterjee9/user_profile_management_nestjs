import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity({ name: 'authentications' })
export class Authentication {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid', default: uuidv4(), unique: true })
  user_id: string;

  @Column({ nullable: true })
  secret_hash: string;

  @Column({ nullable: true })
  salt_key: string;
}
