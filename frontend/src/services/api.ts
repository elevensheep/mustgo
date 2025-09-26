import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../constants';
import type { ApiResponse } from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000, // 30초로 증가
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 요청 인터셉터 - 토큰 자동 추가
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 응답 인터셉터 - 에러 처리
    this.api.interceptors.response.use(
      (response: AxiosResponse<ApiResponse<unknown>>) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // 토큰 만료 시 로그아웃
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
          window.location.href = '/auth/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // GET 요청
  async get<T>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    const response = await this.api.get<ApiResponse<T>>(url, { params });
    return response.data;
  }

  // POST 요청
  async post<T>(url: string, data?: Record<string, unknown>): Promise<ApiResponse<T>> {
    console.log(`📡 [ApiService] POST 요청: ${url}`);
    console.log(`📡 [ApiService] 요청 데이터:`, data);
    
    try {
      const response = await this.api.post<ApiResponse<T>>(url, data);
      console.log(`✅ [ApiService] 응답 성공:`, response.data);
      return response.data;
    } catch (error: any) {
      console.error(`❌ [ApiService] 요청 실패:`, error);
      
      // 상세한 에러 정보 로깅
      if (error.response) {
        console.error(`❌ [ApiService] 응답 에러:`, {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers
        });
      } else if (error.request) {
        console.error(`❌ [ApiService] 요청 에러:`, error.request);
      } else {
        console.error(`❌ [ApiService] 설정 에러:`, error.message);
      }
      
      throw error;
    }
  }

  // PUT 요청
  async put<T>(url: string, data?: Record<string, unknown>): Promise<ApiResponse<T>> {
    const response = await this.api.put<ApiResponse<T>>(url, data);
    return response.data;
  }

  // PATCH 요청
  async patch<T>(url: string, data?: Record<string, unknown>): Promise<ApiResponse<T>> {
    const response = await this.api.patch<ApiResponse<T>>(url, data);
    return response.data;
  }

  // DELETE 요청
  async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.api.delete<ApiResponse<T>>(url);
    return response.data;
  }

  // 파일 업로드
  async uploadFile<T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.api.post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
