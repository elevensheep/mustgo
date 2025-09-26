export declare class CreatePlaceDto {
    placeId?: string;
    name: string;
    address?: string;
    roadAddress?: string;
    category?: string;
    phone?: string;
    url?: string;
    description?: string;
    imageUrl?: string;
    userId: string;
    latitude: number;
    longitude: number;
    distance?: number;
    isFromAPI?: boolean;
}
