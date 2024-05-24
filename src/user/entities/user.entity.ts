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
import { Authentication } from './user.authentication.entity';
import { Avatar } from './user.avatar.entity';
import { Contact } from './user.contact.entity';
import { Identification } from './user.identification.entity';
import { MetaData } from './user.metadata.entity';
import { Name } from './user.name.entity';
import { SocialProfile } from './user.social.entity';

@Entity({ name: 'users' })
@Index(['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Name, (name) => name.user, { cascade: true, eager: true })
  @JoinColumn()
  name: Relation<Name>;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: true })
  username: string;

  @Column({ type: 'uuid', default: NIL_UUID })
  organization_id: string;

  @OneToOne(() => Authentication, { cascade: true, eager: true })
  @JoinColumn()
  authentication: Authentication;

  @OneToMany(() => Identification, (identification) => identification.id, {
    cascade: true,
  })
  identification: Identification[];

  @OneToMany(() => Address, (address) => address.id, { cascade: true })
  address: Address[];

  @OneToMany(() => Contact, (contact) => contact.id, { cascade: true })
  contact: Contact[];

  @OneToMany(() => SocialProfile, (socialProfile) => socialProfile.id, {
    cascade: true,
  })
  social_profiles: SocialProfile[];

  @OneToOne(() => Avatar, { cascade: true, eager: true })
  @JoinColumn()
  avatar: Avatar;

  @OneToOne(() => MetaData, { cascade: true, eager: true })
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
    this.authentication.salt_key = crypto.randomBytes(24).toString('hex');
    this.authentication.secret_hash = crypto
      .pbkdf2Sync(password, this.authentication.salt_key, 1000, 64, 'sha512')
      .toString('hex');
  }

  validatePassword(password: string): boolean {
    const passwordHash = crypto
      .pbkdf2Sync(password, this.authentication.salt_key, 1000, 64, 'sha512')
      .toString('hex');

    return this.authentication.secret_hash === passwordHash;
  }
}
