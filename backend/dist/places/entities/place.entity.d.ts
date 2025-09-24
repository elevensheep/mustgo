import { User } from '../../users/entities/user.entity';
import { Comment } from '../../comments/entities/comment.entity';
export declare class Place {
    id: number;
    placeId: string;
    placeName: string;
    description: string;
    imageUrl: string;
    user: User;
    latitude: number;
    longitude: number;
    createdAt: Date;
    updatedAt: Date;
    comments: Comment[];
}
