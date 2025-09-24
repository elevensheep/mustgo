import { apiService } from './api';
import { API_ENDPOINTS } from '../constants';
import type { Place, CreatePlaceDto } from '../types';

export class PlacesService {
  // 모든 맛집 조회
  async getAllPlaces(): Promise<Place[]> {
    const response = await apiService.get<Place[]>(API_ENDPOINTS.PLACES.ALL);
    return response.data;
  }

  // 맛집 이름으로 검색
  async searchPlacesByName(name: string): Promise<Place[]> {
    const response = await apiService.get<Place[]>(API_ENDPOINTS.PLACES.BY_NAME(name));
    return response.data;
  }

  // 새 맛집 생성
  async createPlace(placeData: CreatePlaceDto): Promise<Place | null> {
    const response = await apiService.post<Place | null>(API_ENDPOINTS.PLACES.CREATE, placeData);
    return response.data;
  }

  // 맛집 상세 정보 조회 (ID로)
  async getPlaceById(id: string): Promise<Place> {
    const response = await apiService.get<Place>(`/api/places/${id}`);
    return response.data;
  }

  // 맛집 정보 수정
  async updatePlace(id: string, placeData: Partial<CreatePlaceDto>): Promise<Place> {
    const response = await apiService.patch<Place>(`/api/places/${id}`, placeData);
    return response.data;
  }

  // 맛집 삭제
  async deletePlace(id: string): Promise<void> {
    await apiService.delete(`/api/places/${id}`);
  }

  // 인기 맛집 조회 (추후 구현)
  async getPopularPlaces(limit: number = 10): Promise<Place[]> {
    // TODO: 백엔드에서 인기 맛집 API 구현 후 연결
    const allPlaces = await this.getAllPlaces();
    return allPlaces.slice(0, limit);
  }

  // 최근 추가된 맛집 조회
  async getRecentPlaces(limit: number = 10): Promise<Place[]> {
    const allPlaces = await this.getAllPlaces();
    return allPlaces
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }
}

export const placesService = new PlacesService();
