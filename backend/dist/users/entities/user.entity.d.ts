import { Place } from '../../places/entities/place.entity';
import { Comment } from '../../comments/entities/comment.entity';
export declare class User {
    uuid: string;
    email: string;
    password: string;
    nickname: string;
    createdAt: Date;
    updatedAt: Date;
    places: Place[];
    comments: Comment[];
}
