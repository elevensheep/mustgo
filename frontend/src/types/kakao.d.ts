// 카카오 지도 API 타입 정의
declare global {
  interface Window {
    kakao: any;
  }
}

export interface KakaoMapOptions {
  center: {
    lat: number;
    lng: number;
  };
  level: number;
}

export interface KakaoMarkerOptions {
  position: {
    lat: number;
    lng: number;
  };
  title?: string;
  image?: any;
}

export interface KakaoPlaceSearchResult {
  place_name: string;
  address_name: string;
  road_address_name: string;
  place_url: string;
  category_name: string;
  phone: string;
  x: string;
  y: string;
  distance?: string;
}

export interface KakaoPlaceSearchResponse {
  documents: KakaoPlaceSearchResult[];
  meta: {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
  };
}

export interface RestaurantSearchResult {
  id: string;
  name: string;
  address: string;
  roadAddress: string;
  category: string;
  phone: string;
  url: string;
  lat: number;
  lng: number;
  distance?: number;
}

export interface MapLocation {
  lat: number;
  lng: number;
  address?: string;
  name?: string;
}
