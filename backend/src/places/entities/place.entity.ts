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
import { Comment } from '../../comments/entities/comment.entity';

@Entity('places')
export class Place {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'place_id', unique: true, nullable: false })
  placeId: string;

  @Column({ name: 'place_name', nullable: false })
  placeName: string;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  @ManyToOne(() => User, (user) => user.places, { lazy: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'uuid' })
  user: User;

  @Column({ nullable: true })
  latitude: number;

  @Column({ nullable: true })
  longitude: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Comment, (comment) => comment.place)
  comments: Comment[];
}