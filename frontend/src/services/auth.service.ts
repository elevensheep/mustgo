import { apiService } from './api';
import { API_ENDPOINTS } from '../constants';
import type { LoginDto, AuthResponse, User, CreateUserDto, OAuthProvider } from '../types';

export class AuthService {
  // 이메일/비밀번호 로그인
  async login(credentials: LoginDto): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  }

  // 사용자 프로필 조회
  async getProfile(): Promise<User> {
    const response = await apiService.post<User>(API_ENDPOINTS.AUTH.PROFILE);
    return response.data;
  }

  // OAuth 로그인 시작
  initiateOAuthLogin(provider: OAuthProvider): void {
    const url = `${API_ENDPOINTS.AUTH.SUPABASE_LOGIN(provider)}`;
    window.location.href = url;
  }

  // OAuth 로그아웃
  async signOut(accessToken: string): Promise<void> {
    await apiService.post(API_ENDPOINTS.AUTH.SUPABASE_SIGNOUT, { accessToken });
  }

  // 회원가입
  async register(userData: CreateUserDto): Promise<User> {
    const response = await apiService.post<User>(API_ENDPOINTS.USERS.CREATE, userData);
    return response.data;
  }

  // 이메일 중복 체크
  async checkEmailExists(email: string): Promise<boolean> {
    const response = await apiService.get<boolean>(`${API_ENDPOINTS.USERS.CHECK_EMAIL}/${email}`);
    return response.data;
  }

  // 토큰 저장
  saveToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  // 토큰 가져오기
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // 사용자 정보 저장
  saveUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // 사용자 정보 가져오기
  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // 로그아웃
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }

  // 로그인 상태 확인
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
