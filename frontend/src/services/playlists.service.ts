import { apiService } from './api';
import { API_ENDPOINTS } from '../constants';
import type { PlaceGroup, CreatePlaceGroupDto, Place } from '../types';

export class PlaylistsService {
  // 모든 플레이리스트 조회
  async getAllPlaylists(): Promise<PlaceGroup[]> {
    const response = await apiService.get<PlaceGroup[]>(API_ENDPOINTS.PLACE_GROUPS.ALL);
    return response.data;
  }

  // 특정 플레이리스트 조회
  async getPlaylistById(id: string): Promise<PlaceGroup> {
    const response = await apiService.get<PlaceGroup>(API_ENDPOINTS.PLACE_GROUPS.BY_ID(id));
    return response.data;
  }

  // 새 플레이리스트 생성
  async createPlaylist(playlistData: CreatePlaceGroupDto): Promise<PlaceGroup> {
    const response = await apiService.post<PlaceGroup>(API_ENDPOINTS.PLACE_GROUPS.CREATE, playlistData);
    return response.data;
  }

  // 플레이리스트 수정
  async updatePlaylist(id: string, playlistData: Partial<CreatePlaceGroupDto>): Promise<PlaceGroup> {
    const response = await apiService.patch<PlaceGroup>(`/api/place-groups/${id}`, playlistData);
    return response.data;
  }

  // 플레이리스트 삭제
  async deletePlaylist(id: string): Promise<void> {
    await apiService.delete(`/api/place-groups/${id}`);
  }

  // 사용자의 플레이리스트 조회
  async getUserPlaylists(userId: string): Promise<PlaceGroup[]> {
    const allPlaylists = await this.getAllPlaylists();
    return allPlaylists.filter(playlist => playlist.userId === userId);
  }

  // 플레이리스트에 맛집 추가 (추후 구현)
  async addPlaceToPlaylist(playlistId: string, placeId: string): Promise<void> {
    // TODO: 백엔드에서 플레이리스트-맛집 관계 API 구현 후 연결
    await apiService.post(`/api/place-groups/${playlistId}/places`, { placeId });
  }

  // 플레이리스트에서 맛집 제거 (추후 구현)
  async removePlaceFromPlaylist(playlistId: string, placeId: string): Promise<void> {
    // TODO: 백엔드에서 플레이리스트-맛집 관계 API 구현 후 연결
    await apiService.delete(`/api/place-groups/${playlistId}/places/${placeId}`);
  }

  // 플레이리스트의 맛집 목록 조회 (추후 구현)
  async getPlaylistPlaces(playlistId: string): Promise<Place[]> {
    // TODO: 백엔드에서 플레이리스트의 맛집 목록 API 구현 후 연결
    const response = await apiService.get<Place[]>(`/api/place-groups/${playlistId}/places`);
    return response.data;
  }

  // 인기 플레이리스트 조회
  async getPopularPlaylists(limit: number = 10): Promise<PlaceGroup[]> {
    const allPlaylists = await this.getAllPlaylists();
    // TODO: 실제 인기도 기준으로 정렬 (좋아요, 조회수 등)
    return allPlaylists.slice(0, limit);
  }

  // 최근 생성된 플레이리스트 조회
  async getRecentPlaylists(limit: number = 10): Promise<PlaceGroup[]> {
    const allPlaylists = await this.getAllPlaylists();
    return allPlaylists
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }
}

export const playlistsService = new PlaylistsService();
