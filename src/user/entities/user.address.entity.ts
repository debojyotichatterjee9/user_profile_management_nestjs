import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Timezone } from './user.timezone.entity';

@Entity({ name: 'addresses' })
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @OneToOne(() => Location, { cascade: true, eager: true })
  @JoinColumn()
  location: Location;

  @OneToOne(() => Timezone, { cascade: true, eager: true })
  @JoinColumn()
  timezone: Relation<Timezone>;

  @Column({ default: false })
  is_default: boolean;
}
