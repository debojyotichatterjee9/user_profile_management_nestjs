import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { OrgAddress } from './organization.address.entity';
import { OrgContact } from './organization.contact.entity';
import { OrgSocialProfile } from './organization.social.entity';

@Entity({ name: 'organizations' })
@Index(['id'], { unique: true })
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: false, nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  private contact_email: string;

  get email(): string {
    return this.contact_email;
  }

  set email(value: string) {
    this.contact_email = value.toLowerCase();
  }

  @BeforeInsert()
  @BeforeUpdate()
  private convertEmailToLowerCase() {
    if (this.contact_email) {
      this.contact_email = this.contact_email.toLowerCase();
    }
  }

  @OneToMany(() => OrgAddress, (address) => address.organization_id, {
    cascade: true,
  })
  address: Relation<OrgAddress[]>;

  @OneToMany(() => OrgContact, (contact) => contact.organization_id, {
    cascade: true,
  })
  contact: Relation<OrgContact[]>;

  @OneToMany(
    () => OrgSocialProfile,
    (socialProfile) => socialProfile.organization_id,
    {
      cascade: true,
    },
  )
  social_profiles: Relation<OrgSocialProfile[]>;

  @Column({ nullable: true })
  logo: string;

  @Column({ default: true })
  is_enabled: boolean;

  @Column({ default: false })
  is_deleted: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  enabled_on: Date;

  @Column({ type: 'timestamp', nullable: true })
  disabled_on: Date;

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
