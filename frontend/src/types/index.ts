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

// 맛집 관련 타입
export interface Place {
  id: number;
  placeId: string;
  placeName: string;
  description?: string;
  imageUrl?: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlaceDto {
  placeId: string;
  placeName: string;
  description?: string;
  imageUrl?: string;
  latitude: number;
  longitude: number;
  userId: string;
  [key: string]: unknown;
}

// 플레이리스트 관련 타입
export interface PlaceGroup {
  id: number;
  name: string;
  description?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlaceGroupDto {
  name: string;
  description?: string;
  userId: string;
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
