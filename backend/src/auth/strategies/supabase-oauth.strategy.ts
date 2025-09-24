import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class SupabaseOAuthStrategy extends PassportStrategy(Strategy, 'supabase-oauth') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super();
  }

  async validate(req: any): Promise<any> {
    console.log(`🔍 [OAuth Strategy] OAuth 전략 검증 시작`);
    console.log(`📋 [OAuth Strategy] 요청 쿼리:`, req.query);
    
    try {
      // URL에서 access_token 파라미터 추출
      const accessToken = req.query.access_token;
      console.log(`🔑 [OAuth Strategy] Access Token 추출:`, accessToken ? '토큰 있음' : '토큰 없음');
      
      if (!accessToken) {
        console.error(`❌ [OAuth Strategy] Access token이 없습니다`);
        throw new UnauthorizedException('Access token이 없습니다');
      }

      // Supabase에서 사용자 정보 가져오기
      console.log(`👤 [OAuth Strategy] Supabase에서 사용자 정보 조회 중...`);
      const userInfo = await this.authService.getSupabaseUserInfo(accessToken);
      
      if (!userInfo) {
        console.error(`❌ [OAuth Strategy] Supabase 사용자 정보를 가져올 수 없습니다`);
        throw new UnauthorizedException('Supabase 사용자 정보를 가져올 수 없습니다');
      }

      console.log(`✅ [OAuth Strategy] 사용자 인증 성공:`, userInfo);
      return userInfo;
    } catch (error) {
      console.error(`❌ [OAuth Strategy] OAuth 인증 실패:`, error.message);
      throw new UnauthorizedException('Supabase OAuth 인증에 실패했습니다');
    }
  }
}
