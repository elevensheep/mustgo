import { create } from 'zustand';
import { placesService } from '../services/places.service';
import type { Place, CreatePlaceDto } from '../types';

interface PlacesState {
  places: Place[];
  selectedPlace: Place | null;
  searchResults: Place[];
  popularPlaces: Place[];
  recentPlaces: Place[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
}

interface PlacesActions {
  fetchAllPlaces: () => Promise<void>;
  searchPlaces: (query: string) => Promise<void>;
  createPlace: (placeData: CreatePlaceDto) => Promise<void>;
  selectPlace: (place: Place | null) => void;
  fetchPopularPlaces: () => Promise<void>;
  fetchRecentPlaces: () => Promise<void>;
  clearSearchResults: () => void;
  clearError: () => void;
  setSearchQuery: (query: string) => void;
}

type PlacesStore = PlacesState & PlacesActions;

export const usePlacesStore = create<PlacesStore>((set, get) => ({
  // State
  places: [],
  selectedPlace: null,
  searchResults: [],
  popularPlaces: [],
  recentPlaces: [],
  isLoading: false,
  error: null,
  searchQuery: '',

  // Actions
  fetchAllPlaces: async () => {
    set({ isLoading: true, error: null });
    try {
      const places = await placesService.getAllPlaces();
      set({ places, isLoading: false, error: null });
        } catch (error: unknown) {
      set({
        places: [],
        isLoading: false,
          error: error instanceof Error ? error.message : '맛집 목록을 불러오는데 실패했습니다.',
      });
    }
  },

  searchPlaces: async (query: string) => {
    if (!query.trim()) {
      set({ searchResults: [], searchQuery: '' });
      return;
    }

    set({ isLoading: true, error: null, searchQuery: query });
    try {
      const results = await placesService.searchPlacesByName(query);
      set({ searchResults: results, isLoading: false, error: null });
        } catch (error: unknown) {
      set({
        searchResults: [],
        isLoading: false,
        error: error instanceof Error ? error.message : '검색에 실패했습니다.',
      });
    }
  },

  createPlace: async (placeData: CreatePlaceDto) => {
    set({ isLoading: true, error: null });
    try {
      const newPlace = await placesService.createPlace(placeData);
      if (newPlace) {
        const { places } = get();
        set({
          places: [newPlace, ...places],
          isLoading: false,
          error: null,
        });
      } else {
        set({ isLoading: false, error: null });
      }
        } catch (error: unknown) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : '맛집 등록에 실패했습니다.',
      });
      throw error;
    }
  },

  selectPlace: (place: Place | null) => {
    set({ selectedPlace: place });
  },

  fetchPopularPlaces: async () => {
    set({ isLoading: true, error: null });
    try {
      const places = await placesService.getPopularPlaces();
      set({ popularPlaces: places, isLoading: false, error: null });
        } catch (error: unknown) {
      set({
        popularPlaces: [],
        isLoading: false,
        error: error instanceof Error ? error.message : '인기 맛집을 불러오는데 실패했습니다.',
      });
    }
  },

  fetchRecentPlaces: async () => {
    set({ isLoading: true, error: null });
    try {
      const places = await placesService.getRecentPlaces();
      set({ recentPlaces: places, isLoading: false, error: null });
        } catch (error: unknown) {
      set({
        recentPlaces: [],
        isLoading: false,
        error: error instanceof Error ? error.message : '최근 맛집을 불러오는데 실패했습니다.',
      });
    }
  },

  clearSearchResults: () => {
    set({ searchResults: [], searchQuery: '' });
  },

  clearError: () => {
    set({ error: null });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },
}));
