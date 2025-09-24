import { User } from '../../users/entities/user.entity';
import { Place } from '../../places/entities/place.entity';
export declare class Comment {
    commentId: number;
    user: User;
    place: Place;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}
