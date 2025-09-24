import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Place } from './entities/place.entity';
import { CreatePlaceDto } from './dto/create-place.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PlacesService {
  constructor(
    @InjectRepository(Place)
    private placesRepository: Repository<Place>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createPlaceDto: CreatePlaceDto): Promise<Place> {
    // 사용자 존재 확인
    const user = await this.usersRepository.findOne({
      where: { uuid: createPlaceDto.userId },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다');
    }

    // 중복된 placeId 체크
    const existingPlace = await this.placesRepository.findOne({
      where: { placeId: createPlaceDto.placeId },
    });

    if (existingPlace) {
      // 중복된 장소가 있으면 삭제하고 새로 생성
      await this.placesRepository.remove(existingPlace);
    }

    const place = this.placesRepository.create({
      placeId: createPlaceDto.placeId,
      placeName: createPlaceDto.placeName,
      description: createPlaceDto.description,
      imageUrl: createPlaceDto.imageUrl,
      latitude: createPlaceDto.latitude,
      longitude: createPlaceDto.longitude,
      user: user,
    });

    return this.placesRepository.save(place);
  }

  async findAll(): Promise<Place[]> {
    return this.placesRepository.find({
      relations: ['user'],
    });
  }

  async findByName(placeName: string): Promise<Place[]> {
    return this.placesRepository
      .createQueryBuilder('place')
      .leftJoinAndSelect('place.user', 'user')
      .where('place.placeName ILIKE :placeName', { placeName: `%${placeName}%` })
      .getMany();
  }

  async findOne(id: number): Promise<Place> {
    const place = await this.placesRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!place) {
      throw new NotFoundException('맛집을 찾을 수 없습니다');
    }

    return place;
  }
}