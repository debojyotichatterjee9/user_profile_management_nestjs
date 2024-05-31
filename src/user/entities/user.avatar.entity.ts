import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'avatars' })
export class Avatar {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  large: string;

  @Column({ nullable: true })
  medium: string;

  @Column({ nullable: true })
  small: string;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_on: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_on: Date;
}
