import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'user_meta_data' })
export class MetaData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ type: 'date', nullable: true })
  dob: Date;

  @Column({ nullable: true })
  theme_code: string;

  @Column({ default: false })
  is_super_admin: boolean;

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
