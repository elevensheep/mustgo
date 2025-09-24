import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaceGroup } from './entities/place-group.entity';
import { PlaceGroupItem } from './entities/place-group-item.entity';
import { Place } from '../places/entities/place.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PlaceGroupsService {
  constructor(
    @InjectRepository(PlaceGroup)
    private placeGroupsRepository: Repository<PlaceGroup>,
    @InjectRepository(PlaceGroupItem)
    private placeGroupItemsRepository: Repository<PlaceGroupItem>,
    @InjectRepository(Place)
    private placesRepository: Repository<Place>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(name: string, description: string, userId: string): Promise<PlaceGroup> {
    // User 존재 확인
    const user = await this.usersRepository.findOne({ where: { uuid: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    const placeGroup = this.placeGroupsRepository.create({
      name,
      description,
      user,
    });

    return this.placeGroupsRepository.save(placeGroup);
  }

  async findAll(): Promise<PlaceGroup[]> {
    return this.placeGroupsRepository.find({
      relations: ['user', 'items'],
    });
  }

  async findOne(id: number): Promise<PlaceGroup> {
    return this.placeGroupsRepository.findOne({
      where: { id },
      relations: ['user', 'items'],
    });
  }

  async addPlaceToGroup(groupId: number, placeId: number, note?: string): Promise<PlaceGroupItem> {
    // PlaceGroup과 Place 존재 확인
    const placeGroup = await this.placeGroupsRepository.findOne({ where: { id: groupId } });
    const place = await this.placesRepository.findOne({ where: { id: placeId } });

    if (!placeGroup || !place) {
      throw new Error('PlaceGroup or Place not found');
    }

    const placeGroupItem = this.placeGroupItemsRepository.create({
      placeGroup,
      place,
      note,
    });

    return this.placeGroupItemsRepository.save(placeGroupItem);
  }
}