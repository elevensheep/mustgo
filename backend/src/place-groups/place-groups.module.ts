import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaceGroupsService } from './place-groups.service';
import { PlaceGroupsController } from './place-groups.controller';
import { PlaceGroup } from './entities/place-group.entity';
import { PlaceGroupItem } from './entities/place-group-item.entity';
import { Place } from '../places/entities/place.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlaceGroup, PlaceGroupItem, Place, User])],
  controllers: [PlaceGroupsController],
  providers: [PlaceGroupsService],
  exports: [PlaceGroupsService],
})
export class PlaceGroupsModule {}