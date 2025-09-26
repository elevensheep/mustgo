import { Repository } from 'typeorm';
import { Place } from './entities/place.entity';
import { CreatePlaceDto } from './dto/create-place.dto';
import { User } from '../users/entities/user.entity';
export declare class PlacesService {
    private placesRepository;
    private usersRepository;
    constructor(placesRepository: Repository<Place>, usersRepository: Repository<User>);
    create(createPlaceDto: CreatePlaceDto): Promise<Place>;
    findAll(): Promise<Place[]>;
    findByName(name: string): Promise<Place[]>;
    findOne(id: number): Promise<Place>;
}
