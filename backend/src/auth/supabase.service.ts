import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL'),
      this.configService.get<string>('SUPABASE_ANON_KEY'),
    );
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  async getUserInfo(accessToken: string) {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser(accessToken);
      
      if (error) {
        throw new Error(error.message);
      }

      return user;
    } catch (error) {
      throw new Error(`Supabase 사용자 정보 조회 실패: ${error.message}`);
    }
  }

  async signInWithOAuth(provider: 'google' | 'github' | 'discord' | 'kakao') {
    console.log(`🌐 [SupabaseService] ${provider} OAuth URL 생성 시작`);
    console.log(`🔗 [SupabaseService] 리다이렉트 URL: ${this.configService.get<string>('FRONTEND_URL')}/auth/callback`);
    
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${this.configService.get<string>('FRONTEND_URL')}/auth/callback`,
      },
    });

    if (error) {
      console.error(`❌ [SupabaseService] ${provider} OAuth URL 생성 실패:`, error.message);
      throw new Error(error.message);
    }

    console.log(`✅ [SupabaseService] ${provider} OAuth URL 생성 성공:`, data.url);
    return data;
  }

  async signOut(accessToken: string) {
    const { error } = await this.supabase.auth.signOut();
    
    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  }
}
