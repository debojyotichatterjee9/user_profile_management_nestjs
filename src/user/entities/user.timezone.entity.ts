import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  Relation,
} from 'typeorm';
import { Address } from './user.address.entity';

@Entity({ name: 'timezones' })
export class Timezone {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  offset: string;

  @Column({ nullable: true })
  zone: string;

  @OneToOne(() => Address, (address) => address.timezone)
  user: Relation<Address>;
}
