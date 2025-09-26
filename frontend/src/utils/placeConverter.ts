import type { Place } from '../types';
import type { RestaurantSearchResult } from '../types/kakao';

// RestaurantSearchResult를 Place로 변환
export const convertRestaurantToPlace = (restaurant: RestaurantSearchResult): Place => {
  return {
    placeId: restaurant.id,
    name: restaurant.name,
    address: restaurant.address,
    roadAddress: restaurant.roadAddress,
    category: restaurant.category,
    phone: restaurant.phone,
    url: restaurant.url,
    latitude: restaurant.lat,
    longitude: restaurant.lng,
    distance: restaurant.distance,
    isFromAPI: true
  };
};

// Place를 CreatePlaceDto로 변환
export const convertPlaceToCreateDto = (place: Place, userId: string) => {
  return {
    placeId: place.placeId,
    name: place.name,
    address: place.address,
    roadAddress: place.roadAddress,
    category: place.category,
    phone: place.phone,
    url: place.url,
    description: place.description,
    imageUrl: place.imageUrl,
    latitude: place.latitude,
    longitude: place.longitude,
    userId
  };
};
