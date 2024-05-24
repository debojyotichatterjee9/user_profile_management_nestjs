import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'identifications' })
export class Identification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  value: string;
}
