import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'identifications' })
export class Identification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  value: string;

  @ManyToOne(() => User, (user) => user.id)
  user: Relation<User>;
}
