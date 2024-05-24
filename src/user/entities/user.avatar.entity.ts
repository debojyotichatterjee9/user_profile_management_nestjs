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
}
