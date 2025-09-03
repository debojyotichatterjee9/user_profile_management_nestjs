import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'user_address' })
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.id)
  user_id: Relation<User>;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  type: string;

  @Column({ nullable: true })
  label: string;

  @Column({ type: 'json', nullable: true })
  address: any;

  @Column({ nullable: true, default: '' })
  city: string;

  @Column({ nullable: true, default: '' })
  state: string;

  @Column({ nullable: true, default: '' })
  country: string;

  @Column({ nullable: true, default: '', length: 2 })
  country_code: string;

  @Column({ nullable: true, default: '' })
  zipcode: string;

  @Column({ nullable: true })
  latitude: string;

  @Column({ nullable: true })
  longitude: string;

  @Column({ nullable: true })
  offset: string;

  @Column({ nullable: true })
  zone: string;

  @Column({ default: false })
  is_default: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_on: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_on: Date;
}
