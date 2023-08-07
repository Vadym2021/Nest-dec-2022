import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { CarClassEnum } from './model/enum/car-class.enum';
import { User } from '../user/user.entity';

@Entity()
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  producer: string;

  @Column({ type: 'int', nullable: false })
  age: number;

  @Column({ type: 'varchar', nullable: false })
  model: string;

  @Column({ type: 'enum', enum: CarClassEnum })
  class: CarClassEnum;

  @ManyToMany(() => User, (entity) => entity.cars)
  users: User[];
}
