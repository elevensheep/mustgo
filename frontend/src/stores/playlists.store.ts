import { create } from 'zustand';
import { playlistsService } from '../services/playlists.service';
import type { PlaceGroup, CreatePlaceGroupDto } from '../types';

interface PlaylistsState {
  playlists: PlaceGroup[];
  selectedPlaylist: PlaceGroup | null;
  userPlaylists: PlaceGroup[];
  popularPlaylists: PlaceGroup[];
  recentPlaylists: PlaceGroup[];
  isLoading: boolean;
  error: string | null;
}

interface PlaylistsActions {
  fetchAllPlaylists: () => Promise<void>;
  fetchPlaylistById: (id: string) => Promise<void>;
  createPlaylist: (playlistData: CreatePlaceGroupDto) => Promise<void>;
  updatePlaylist: (id: string, playlistData: Partial<CreatePlaceGroupDto>) => Promise<void>;
  deletePlaylist: (id: string) => Promise<void>;
  selectPlaylist: (playlist: PlaceGroup | null) => void;
  fetchUserPlaylists: (userId: string) => Promise<void>;
  fetchPopularPlaylists: () => Promise<void>;
  fetchRecentPlaylists: () => Promise<void>;
  clearError: () => void;
}

type PlaylistsStore = PlaylistsState & PlaylistsActions;

export const usePlaylistsStore = create<PlaylistsStore>((set, get) => ({
  // State
  playlists: [],
  selectedPlaylist: null,
  userPlaylists: [],
  popularPlaylists: [],
  recentPlaylists: [],
  isLoading: false,
  error: null,

  // Actions
  fetchAllPlaylists: async () => {
    set({ isLoading: true, error: null });
    try {
      const playlists = await playlistsService.getAllPlaylists();
      set({ playlists, isLoading: false, error: null });
        } catch (error: unknown) {
      set({
        playlists: [],
        isLoading: false,
          error: error instanceof Error ? error.message : '플레이리스트 목록을 불러오는데 실패했습니다.',
      });
    }
  },

  fetchPlaylistById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const playlist = await playlistsService.getPlaylistById(id);
      set({ selectedPlaylist: playlist, isLoading: false, error: null });
        } catch (error: unknown) {
      set({
        selectedPlaylist: null,
        isLoading: false,
        error: (error as any)?.response?.data?.message || '플레이리스트를 불러오는데 실패했습니다.',
      });
    }
  },

  createPlaylist: async (playlistData: CreatePlaceGroupDto) => {
    set({ isLoading: true, error: null });
    try {
      const newPlaylist = await playlistsService.createPlaylist(playlistData);
      const { playlists, userPlaylists } = get();
      set({
        playlists: [newPlaylist, ...playlists],
        userPlaylists: [newPlaylist, ...userPlaylists],
        isLoading: false,
        error: null,
      });
        } catch (error: unknown) {
      set({
        isLoading: false,
        error: (error as any)?.response?.data?.message || '플레이리스트 생성에 실패했습니다.',
      });
      throw error;
    }
  },

  updatePlaylist: async (id: string, playlistData: Partial<CreatePlaceGroupDto>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedPlaylist = await playlistsService.updatePlaylist(id, playlistData);
      const { playlists, userPlaylists, selectedPlaylist } = get();
      
      const updatePlaylistInArray = (arr: PlaceGroup[]) =>
        arr.map(playlist => playlist.id === updatedPlaylist.id ? updatedPlaylist : playlist);

      set({
        playlists: updatePlaylistInArray(playlists),
        userPlaylists: updatePlaylistInArray(userPlaylists),
        selectedPlaylist: selectedPlaylist?.id === updatedPlaylist.id ? updatedPlaylist : selectedPlaylist,
        isLoading: false,
        error: null,
      });
        } catch (error: unknown) {
      set({
        isLoading: false,
        error: (error as any)?.response?.data?.message || '플레이리스트 수정에 실패했습니다.',
      });
      throw error;
    }
  },

  deletePlaylist: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await playlistsService.deletePlaylist(id);
      const { playlists, userPlaylists, selectedPlaylist } = get();
      
      set({
        playlists: playlists.filter(playlist => playlist.id !== parseInt(id)),
        userPlaylists: userPlaylists.filter(playlist => playlist.id !== parseInt(id)),
        selectedPlaylist: selectedPlaylist?.id === parseInt(id) ? null : selectedPlaylist,
        isLoading: false,
        error: null,
      });
        } catch (error: unknown) {
      set({
        isLoading: false,
        error: (error as any)?.response?.data?.message || '플레이리스트 삭제에 실패했습니다.',
      });
      throw error;
    }
  },

  selectPlaylist: (playlist: PlaceGroup | null) => {
    set({ selectedPlaylist: playlist });
  },

  fetchUserPlaylists: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const playlists = await playlistsService.getUserPlaylists(userId);
      set({ userPlaylists: playlists, isLoading: false, error: null });
        } catch (error: unknown) {
      set({
        userPlaylists: [],
        isLoading: false,
        error: (error as any)?.response?.data?.message || '사용자 플레이리스트를 불러오는데 실패했습니다.',
      });
    }
  },

  fetchPopularPlaylists: async () => {
    set({ isLoading: true, error: null });
    try {
      const playlists = await playlistsService.getPopularPlaylists();
      set({ popularPlaylists: playlists, isLoading: false, error: null });
        } catch (error: unknown) {
      set({
        popularPlaylists: [],
        isLoading: false,
        error: (error as any)?.response?.data?.message || '인기 플레이리스트를 불러오는데 실패했습니다.',
      });
    }
  },

  fetchRecentPlaylists: async () => {
    set({ isLoading: true, error: null });
    try {
      const playlists = await playlistsService.getRecentPlaylists();
      set({ recentPlaylists: playlists, isLoading: false, error: null });
        } catch (error: unknown) {
      set({
        recentPlaylists: [],
        isLoading: false,
        error: (error as any)?.response?.data?.message || '최근 플레이리스트를 불러오는데 실패했습니다.',
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
