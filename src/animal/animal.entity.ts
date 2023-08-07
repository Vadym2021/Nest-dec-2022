import {
  Entity,
  Column,
  PrimaryGeneratedColumn, ManyToOne,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Animal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'boolean', default: true })
  class: boolean;

  @Column({ type: 'boolean', default: true })
  type: boolean;

  @Column({ type: 'int', nullable: true })
  age: number;

  @ManyToOne(() => User, (entity) => entity.animals)
  user: User;
}
