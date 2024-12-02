import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Address } from './organization.address.entity';
import { Contact } from './organization.contact.entity';
import { SocialProfile } from './organization.social.entity';

@Entity({ name: 'organizations' })
@Index(['id'], { unique: true })
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: false, nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  contact_email: string;

  @OneToMany(() => Address, (address) => address.organization_id, {
    cascade: true,
  })
  address: Relation<Address[]>;

  @OneToMany(() => Contact, (contact) => contact.organization_id, {
    cascade: true,
  })
  contact: Relation<Contact[]>;

  @OneToMany(
    () => SocialProfile,
    (socialProfile) => socialProfile.organization_id,
    {
      cascade: true,
    },
  )
  social_profiles: Relation<SocialProfile[]>;

  @Column({ nullable: true })
  logo: string;

  @Column({ default: false })
  is_enabled: boolean;

  @Column({ default: false })
  is_activated: boolean;

  @Column({ default: false })
  is_deleted: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  enabled_on: Date;

  @Column({ type: 'timestamp', nullable: true })
  disabled_on: Date;

  @Column({ type: 'timestamp', nullable: true })
  activated_on: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_on: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_on: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_on: Date;
}

// export class Organization {}
