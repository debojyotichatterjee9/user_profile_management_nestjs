import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'timezones' })
export class Timezone {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  offset: string;

  @Column({ nullable: true })
  zone: string;
}
