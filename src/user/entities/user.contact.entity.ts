import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'contacts' })
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  type: string;

  @Column({ nullable: true })
  label: string;

  @Column({ nullable: true })
  country_code: string;

  @Column({ nullable: true })
  number: string;

  @Column({ default: false })
  is_default: boolean;
}
