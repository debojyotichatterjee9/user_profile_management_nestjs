import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NIL as NIL_UUID } from 'uuid';
import { Permission } from './permission.entity';

@Entity({ name: 'role' })
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column({ type: 'uuid', default: NIL_UUID })
  organization_id: string;

  @ManyToMany(
    (): typeof Permission => Permission,
    (permission: Permission): Role[] => permission.roles,
    { cascade: true },
  )
  @JoinTable()
  permissions: Permission[];

  @Column({ default: true })
  is_enabled: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdOn: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedOn: Date;
}
