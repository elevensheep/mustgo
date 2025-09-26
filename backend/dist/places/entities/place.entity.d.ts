import { User } from '../../users/entities/user.entity';
import { Comment } from '../../comments/entities/comment.entity';
export declare class Place {
    id: number;
    placeId: string;
    name: string;
    address: string;
    roadAddress: string;
    category: string;
    phone: string;
    url: string;
    description: string;
    imageUrl: string;
    user: User;
    latitude: number;
    longitude: number;
    distance: number;
    isFromAPI: boolean;
    createdAt: Date;
    updatedAt: Date;
    comments: Comment[];
}
