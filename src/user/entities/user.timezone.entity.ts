import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'timezones' })
export class Timezone {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  offset: string;

  @Column({ nullable: true })
  zone: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_on: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_on: Date;
}
