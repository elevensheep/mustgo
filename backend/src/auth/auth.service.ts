import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SupabaseService } from './supabase.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private supabaseService: SupabaseService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    console.log(`🔍 [AuthService] 사용자 검증 시작: ${email}`);
    
    const user = await this.usersService.findByEmail(email);
    console.log(`👤 [AuthService] 사용자 조회 결과:`, user ? '사용자 존재' : '사용자 없음');
    
    if (!user) {
      console.log(`❌ [AuthService] 사용자를 찾을 수 없습니다: ${email}`);
      return null;
    }
    
    console.log(`🔐 [AuthService] 비밀번호 검증 중...`);
    console.log(`🔐 [AuthService] 입력된 비밀번호: ${password}`);
    console.log(`🔐 [AuthService] 저장된 해시: ${user.password}`);
    console.log(`🔐 [AuthService] 해시 길이: ${user.password.length}`);
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(`🔐 [AuthService] 비밀번호 검증 결과:`, isPasswordValid ? '성공' : '실패');
    
    if (isPasswordValid) {
      const { password, ...result } = user;
      console.log(`✅ [AuthService] 사용자 검증 성공:`, result.uuid);
      return result;
    }
    
    console.log(`❌ [AuthService] 비밀번호가 일치하지 않습니다`);
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.uuid };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        uuid: user.uuid,
        email: user.email,
        nickname: user.nickname,
      },
    };
  }

  async validateJwtPayload(payload: any) {
    const user = await this.usersService.findOne(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async getSupabaseUserInfo(accessToken: string) {
    try {
      console.log('🔍 [AuthService] Supabase 사용자 정보 조회 시작');
      
      const supabaseUser = await this.supabaseService.getUserInfo(accessToken);
      
      if (!supabaseUser) {
        console.error('❌ [AuthService] Supabase 사용자 정보가 없습니다');
        return null;
      }

      console.log('✅ [AuthService] Supabase 사용자 정보 조회 성공:', {
        email: supabaseUser.email,
        metadata: supabaseUser.user_metadata
      });

      // Supabase 사용자를 로컬 데이터베이스에서 찾거나 생성
      let localUser = await this.usersService.findByEmail(supabaseUser.email);
      
      if (!localUser) {
        console.log('👤 [AuthService] 새 사용자 생성 중...');
        // 새 사용자 생성
        const newUser = await this.usersService.create({
          email: supabaseUser.email,
          password: '', // OAuth 사용자는 비밀번호 없음
          nickname: supabaseUser.user_metadata?.full_name || supabaseUser.email.split('@')[0],
        });
        localUser = newUser;
        console.log('✅ [AuthService] 새 사용자 생성 완료:', localUser.uuid);
      } else {
        console.log('✅ [AuthService] 기존 사용자 찾음:', localUser.uuid);
      }

      const result = {
        uuid: localUser.uuid,
        email: localUser.email,
        nickname: localUser.nickname,
        supabaseId: supabaseUser.id,
      };

      console.log('🎯 [AuthService] 최종 사용자 정보:', result);
      return result;
    } catch (error) {
      console.error('❌ [AuthService] Supabase 사용자 정보 조회 실패:', error.message);
      throw new UnauthorizedException(`Supabase 사용자 정보 조회 실패: ${error.message}`);
    }
  }

  async signInWithSupabase(provider: 'google' | 'github' | 'discord' | 'kakao') {
    console.log(`🔧 [AuthService] Supabase OAuth 서비스 호출: ${provider}`);
    return this.supabaseService.signInWithOAuth(provider);
  }

  async signOutFromSupabase(accessToken: string) {
    return this.supabaseService.signOut(accessToken);
  }
}