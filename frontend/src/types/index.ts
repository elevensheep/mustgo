// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
  errorCode?: string;
}

// 사용자 관련 타입
export interface User {
  uuid: string;
  email: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  nickname: string;
  [key: string]: unknown;
}

export interface UpdateUserDto {
  nickname?: string;
}

// 인증 관련 타입
export interface LoginDto {
  email: string;
  password: string;
  [key: string]: unknown;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

// 맛집 관련 타입 (통합)
export interface Place {
  id?: number; // DB에 저장된 경우에만 존재
  placeId?: string; // 외부 API ID (카카오 등)
  name: string; // 통일된 이름 필드
  address?: string;
  roadAddress?: string;
  category?: string;
  phone?: string;
  url?: string;
  description?: string;
  imageUrl?: string;
  latitude: number;
  longitude: number;
  distance?: number; // 검색 결과에서의 거리
  isFromAPI?: boolean; // API에서 가져온 데이터인지 구분
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePlaceDto {
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
  userId: string;
  [key: string]: unknown;
}

// 위치 정보 타입
export interface LocationInfo {
  latitude: number;
  longitude: number;
  address?: string;
  name?: string;
}

// 플레이리스트 관련 타입
export interface PlaceGroup {
  id: number;
  name: string;
  description?: string;
  userId: string;
  location?: LocationInfo;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlaceGroupDto {
  name: string;
  description?: string;
  userId: string;
  location?: LocationInfo;
  places: Place[]; // 통합된 Place 타입 사용
  [key: string]: unknown;
}

// 댓글 관련 타입
export interface Comment {
  id: number;
  content: string;
  userId: string;
  placeId?: number;
  placeGroupId?: number;
  createdAt: string;
  updatedAt: string;
}

// OAuth 제공자 타입
export type OAuthProvider = 'google' | 'github' | 'discord' | 'kakao';

// 챗봇 관련 타입
export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
  context?: string;
}
