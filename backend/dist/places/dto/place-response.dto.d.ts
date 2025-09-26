export declare class PlaceResponseDto {
    id: number;
    placeId?: string;
    name: string;
    address?: string;
    roadAddress?: string;
    category?: string;
    phone?: string;
    url?: string;
    description?: string;
    imageUrl?: string;
    latitude: number;
    longitude: number;
    distance?: number;
    isFromAPI?: boolean;
    createdAt: Date;
    updatedAt: Date;
}
