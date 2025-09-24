// API 관련 상수
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  // 인증
  AUTH: {
    LOGIN: '/api/auth/login',
    PROFILE: '/api/auth/profile',
    SUPABASE_LOGIN: (provider: string) => `/api/auth/supabase/${provider}`,
    SUPABASE_CALLBACK: '/api/auth/supabase/callback',
    SUPABASE_SIGNOUT: '/api/auth/supabase/signout',
  },
  
  // 사용자
  USERS: {
    CREATE: '/api/users/create',
    ALL: '/api/users/all',
    BY_ID: (id: string) => `/api/users/${id}`,
    UPDATE: (id: string) => `/api/users/${id}`,
    DELETE: (id: string) => `/api/users/${id}`,
    CHECK_EMAIL: '/api/users/check-email',
  },
  
  // 맛집
  PLACES: {
    CREATE: '/api/places/create',
    ALL: '/api/places/all',
    BY_NAME: (name: string) => `/api/places/${encodeURIComponent(name)}`,
  },
  
  // 플레이리스트
  PLACE_GROUPS: {
    CREATE: '/api/place-groups/create',
    ALL: '/api/place-groups/all',
    BY_ID: (id: string) => `/api/place-groups/${id}`,
  },
  
  // 댓글
  COMMENTS: {
    CREATE: '/api/comments/create',
    BY_PLACE: (placeId: string) => `/api/comments/place/${placeId}`,
    BY_GROUP: (groupId: string) => `/api/comments/group/${groupId}`,
  },
} as const;

// OAuth 제공자
export const OAUTH_PROVIDERS = ['google', 'github', 'discord', 'kakao'] as const;

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  USER: 'user',
  THEME: 'theme',
} as const;

// 라우트 경로
export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  AUTH_SUCCESS: '/auth/success',
  AUTH_ERROR: '/auth/error',
  PLACES: '/places',
  PLACE_DETAIL: (id: string) => `/places/${id}`,
  PLAYLISTS: '/playlists',
  PLAYLIST_CREATE: '/playlists/create',
  PLAYLIST_DETAIL: (id: string) => `/playlists/${id}`,
  CHAT: '/chat',
  PROFILE: '/profile',
} as const;

// 페이지네이션
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
} as const;

// 이미지 관련
export const IMAGE = {
  PLACEHOLDER: 'https://via.placeholder.com/300x200?text=No+Image',
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
} as const;
