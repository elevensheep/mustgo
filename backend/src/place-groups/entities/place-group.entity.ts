import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { PlaceGroupItem } from './place-group-item.entity';

@Entity('place_groups')
export class PlaceGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, { lazy: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'uuid' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => PlaceGroupItem, (item) => item.placeGroup)
  items: PlaceGroupItem[];
}