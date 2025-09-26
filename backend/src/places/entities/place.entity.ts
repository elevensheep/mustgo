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

  @Column({ name: 'place_id', unique: true, nullable: true })
  placeId: string;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ name: 'road_address', nullable: true })
  roadAddress: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  url: string;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  @ManyToOne(() => User, (user) => user.places, { lazy: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'uuid' })
  user: User;

  @Column({ type: 'double precision', nullable: false })
  latitude: number;

  @Column({ type: 'double precision', nullable: false })
  longitude: number;

  @Column({ nullable: true })
  distance: number;

  @Column({ name: 'is_from_api', default: false })
  isFromAPI: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Comment, (comment) => comment.place)
  comments: Comment[];
}