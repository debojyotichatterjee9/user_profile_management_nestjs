import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'social_profiles' })
export class SocialProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  label: string;

  @Column({ nullable: true })
  link: string;
}
