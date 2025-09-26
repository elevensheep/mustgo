import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { PlaceGroup } from './entities/place-group.entity';
import { PlaceGroupItem } from './entities/place-group-item.entity';
import { Place } from '../places/entities/place.entity';
import { User } from '../users/entities/user.entity';
import { CreatePlaceGroupDto, PlaceInfo } from './dto/create-place-group.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

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
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async create(createPlaceGroupDto: CreatePlaceGroupDto): Promise<PlaceGroup> {
    // User 존재 확인
    const user = await this.usersRepository.findOne({ where: { uuid: createPlaceGroupDto.userId } });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다');
    }

    // 플레이리스트 이름 중복 확인
    const existingPlaylist = await this.placeGroupsRepository.findOne({
      where: { name: createPlaceGroupDto.name, user: { uuid: createPlaceGroupDto.userId } }
    });

    if (existingPlaylist) {
      throw new BadRequestException('같은 이름의 플레이리스트가 이미 존재합니다');
    }

    // 플레이리스트 생성
    const placeGroup = this.placeGroupsRepository.create({
      name: createPlaceGroupDto.name,
      description: createPlaceGroupDto.description,
      latitude: createPlaceGroupDto.location?.latitude,
      longitude: createPlaceGroupDto.location?.longitude,
      address: createPlaceGroupDto.location?.address,
      user,
    });

    const savedPlaceGroup = await this.placeGroupsRepository.save(placeGroup);

    // 맛집들 처리
    if (createPlaceGroupDto.places && createPlaceGroupDto.places.length > 0) {
      for (const placeInfo of createPlaceGroupDto.places) {
        await this.addPlaceToGroup(savedPlaceGroup.id, placeInfo);
      }
    }

    // 캐시 무효화
    await this.cacheManager.del('playlists:all');
    await this.cacheManager.del(`playlist:${savedPlaceGroup.id}`);

    return this.findOne(savedPlaceGroup.id);
  }

  async addPlaceToGroup(groupId: number, placeInfo: PlaceInfo): Promise<PlaceGroupItem> {
    // PlaceGroup 존재 확인
    const placeGroup = await this.placeGroupsRepository.findOne({ where: { id: groupId } });
    if (!placeGroup) {
      throw new NotFoundException('플레이리스트를 찾을 수 없습니다');
    }

    let place: Place;

    // 기존 Place가 있는지 확인 (placeId 또는 id로)
    if (placeInfo.id) {
      place = await this.placesRepository.findOne({ where: { id: placeInfo.id } });
    } else if (placeInfo.placeId) {
      place = await this.placesRepository.findOne({ where: { placeId: placeInfo.placeId } });
    }

    // Place가 없으면 새로 생성
    if (!place) {
      place = this.placesRepository.create({
        placeId: placeInfo.placeId,
        name: placeInfo.name,
        address: placeInfo.address,
        roadAddress: placeInfo.roadAddress,
        category: placeInfo.category,
        phone: placeInfo.phone,
        url: placeInfo.url,
        description: placeInfo.description,
        imageUrl: placeInfo.imageUrl,
        latitude: placeInfo.latitude,
        longitude: placeInfo.longitude,
        distance: placeInfo.distance,
        isFromAPI: placeInfo.isFromAPI || false,
        user: placeGroup.user,
      });
      place = await this.placesRepository.save(place);
    }

    // PlaceGroupItem 생성
    const placeGroupItem = this.placeGroupItemsRepository.create({
      placeGroup,
      place,
    });

    return this.placeGroupItemsRepository.save(placeGroupItem);
  }

  async findAll(): Promise<PlaceGroup[]> {
    const cacheKey = 'playlists:all';
    const cached = await this.cacheManager.get<PlaceGroup[]>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const playlists = await this.placeGroupsRepository.find({
      relations: ['user', 'items', 'items.place'],
    });

    // 5분간 캐시
    await this.cacheManager.set(cacheKey, playlists, 300);
    
    return playlists;
  }

  async findOne(id: number): Promise<PlaceGroup> {
    const cacheKey = `playlist:${id}`;
    const cached = await this.cacheManager.get<PlaceGroup>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const placeGroup = await this.placeGroupsRepository.findOne({
      where: { id },
      relations: ['user', 'items', 'items.place'],
    });

    if (!placeGroup) {
      throw new NotFoundException('플레이리스트를 찾을 수 없습니다');
    }

    // 10분간 캐시
    await this.cacheManager.set(cacheKey, placeGroup, 600);

    return placeGroup;
  }

}