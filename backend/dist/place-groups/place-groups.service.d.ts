import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { PlaceGroup } from './entities/place-group.entity';
import { PlaceGroupItem } from './entities/place-group-item.entity';
import { Place } from '../places/entities/place.entity';
import { User } from '../users/entities/user.entity';
import { CreatePlaceGroupDto, PlaceInfo } from './dto/create-place-group.dto';
export declare class PlaceGroupsService {
    private placeGroupsRepository;
    private placeGroupItemsRepository;
    private placesRepository;
    private usersRepository;
    private cacheManager;
    constructor(placeGroupsRepository: Repository<PlaceGroup>, placeGroupItemsRepository: Repository<PlaceGroupItem>, placesRepository: Repository<Place>, usersRepository: Repository<User>, cacheManager: Cache);
    create(createPlaceGroupDto: CreatePlaceGroupDto): Promise<PlaceGroup>;
    addPlaceToGroup(groupId: number, placeInfo: PlaceInfo): Promise<PlaceGroupItem>;
    findAll(): Promise<PlaceGroup[]>;
    findOne(id: number): Promise<PlaceGroup>;
}
