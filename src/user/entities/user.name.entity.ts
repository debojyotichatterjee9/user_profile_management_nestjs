import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'names' })
export class Name {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  name_prefix: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  middle_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  name_suffix: string;

  @OneToOne(() => User, (user) => user.id)
  user: Relation<User>;
}
