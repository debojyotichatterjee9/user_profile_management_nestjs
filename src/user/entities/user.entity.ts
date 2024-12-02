import * as crypto from 'crypto';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { NIL as NIL_UUID } from 'uuid';
import { Address } from './user.address.entity';
import { MetaData } from './user.metadata.entity';
import { Identification } from './user.identification.entity';
import { Contact } from './user.contact.entity';
import { SocialProfile } from './user.social.entity';

@Entity({ name: 'users' })
@Index(['email'], { unique: true })
export class User {
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

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: true })
  username: string;

  @Column({ type: 'uuid', default: NIL_UUID })
  organization_id: string;

  @Column({ nullable: true })
  secret_hash: string;

  @Column({ nullable: true })
  salt_key: string;

  @OneToMany(() => Identification, (identification) => identification.user_id, {
    cascade: true,
  })
  identification: Relation<Identification[]>;

  @OneToMany(() => Address, (address) => address.user_id, { cascade: true })
  address: Relation<Address[]>;

  @OneToMany(() => Contact, (contact) => contact.user_id, { cascade: true })
  contact: Relation<Contact[]>;

  @OneToMany(() => SocialProfile, (socialProfile) => socialProfile.user_id, {
    cascade: true,
  })
  social_profiles: Relation<SocialProfile[]>;

  @Column({ nullable: true })
  avatar: string;

  @OneToOne(() => MetaData, (metaData) => metaData.entity_id, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  meta_data: MetaData;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_on: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_on: Date;

  setPassword(password: string) {
    this.salt_key = crypto.randomBytes(24).toString('hex');
    this.secret_hash = crypto
      .pbkdf2Sync(password, this.salt_key, 1000, 64, 'sha512')
      .toString('hex');
  }

  validatePassword(password: string): boolean {
    const passwordHash = crypto
      .pbkdf2Sync(password, this.salt_key, 1000, 64, 'sha512')
      .toString('hex');

    return this.secret_hash === passwordHash;
  }
}
