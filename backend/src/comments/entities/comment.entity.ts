import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Place } from '../../places/entities/place.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  commentId: number;

  @ManyToOne(() => User, (user) => user.comments, { lazy: true })
  @JoinColumn({ name: 'user_uuid', referencedColumnName: 'uuid' })
  user: User;

  @ManyToOne(() => Place, (place) => place.comments, { lazy: true })
  @JoinColumn({ name: 'place_id', referencedColumnName: 'id' })
  place: Place;

  @Column({ nullable: true })
  content: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}