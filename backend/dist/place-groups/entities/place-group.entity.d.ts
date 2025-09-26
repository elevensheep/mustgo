import { User } from '../../users/entities/user.entity';
import { PlaceGroupItem } from './place-group-item.entity';
export declare class PlaceGroup {
    id: number;
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    address: string;
    user: User;
    createdAt: Date;
    updatedAt: Date;
    items: PlaceGroupItem[];
}
