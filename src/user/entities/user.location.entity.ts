import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'locations' })
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  latitude: string;

  @Column({ nullable: true })
  longitude: string;
}
