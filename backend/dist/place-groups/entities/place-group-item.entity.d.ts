import { PlaceGroup } from './place-group.entity';
import { Place } from '../../places/entities/place.entity';
export declare class PlaceGroupItem {
    id: number;
    placeGroup: PlaceGroup;
    place: Place;
    note: string;
    createdAt: Date;
    updatedAt: Date;
}
