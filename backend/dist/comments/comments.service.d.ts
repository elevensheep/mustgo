import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Place } from '../places/entities/place.entity';
import { User } from '../users/entities/user.entity';
export declare class CommentsService {
    private commentsRepository;
    private placesRepository;
    private usersRepository;
    constructor(commentsRepository: Repository<Comment>, placesRepository: Repository<Place>, usersRepository: Repository<User>);
    findByPlaceId(placeId: string): Promise<Comment[]>;
    create(placeId: string, userId: string, content: string): Promise<Comment>;
}
