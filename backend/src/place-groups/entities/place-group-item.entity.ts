import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PlaceGroup } from './place-group.entity';
import { Place } from '../../places/entities/place.entity';

@Entity('place_group_items')
export class PlaceGroupItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PlaceGroup, (placeGroup) => placeGroup.items, { lazy: true })
  @JoinColumn({ name: 'place_group_id', referencedColumnName: 'id' })
  placeGroup: PlaceGroup;

  @ManyToOne(() => Place, { lazy: true })
  @JoinColumn({ name: 'place_id', referencedColumnName: 'id' })
  place: Place;

  @Column({ nullable: true })
  note: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}