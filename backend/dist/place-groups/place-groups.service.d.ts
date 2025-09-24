import { Repository } from 'typeorm';
import { PlaceGroup } from './entities/place-group.entity';
import { PlaceGroupItem } from './entities/place-group-item.entity';
import { Place } from '../places/entities/place.entity';
import { User } from '../users/entities/user.entity';
export declare class PlaceGroupsService {
    private placeGroupsRepository;
    private placeGroupItemsRepository;
    private placesRepository;
    private usersRepository;
    constructor(placeGroupsRepository: Repository<PlaceGroup>, placeGroupItemsRepository: Repository<PlaceGroupItem>, placesRepository: Repository<Place>, usersRepository: Repository<User>);
    create(name: string, description: string, userId: string): Promise<PlaceGroup>;
    findAll(): Promise<PlaceGroup[]>;
    findOne(id: number): Promise<PlaceGroup>;
    addPlaceToGroup(groupId: number, placeId: number, note?: string): Promise<PlaceGroupItem>;
}
