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
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
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
      const supabaseUser = await this.supabaseService.getUserInfo(accessToken);
      
      if (!supabaseUser) {
        return null;
      }

      // Supabase 사용자를 로컬 데이터베이스에서 찾거나 생성
      let localUser = await this.usersService.findByEmail(supabaseUser.email);
      
      if (!localUser) {
        // 새 사용자 생성
        const newUser = await this.usersService.create({
          email: supabaseUser.email,
          password: '', // OAuth 사용자는 비밀번호 없음
          nickname: supabaseUser.user_metadata?.full_name || supabaseUser.email.split('@')[0],
        });
        localUser = newUser;
      }

      return {
        uuid: localUser.uuid,
        email: localUser.email,
        nickname: localUser.nickname,
        supabaseId: supabaseUser.id,
      };
    } catch (error) {
      throw new UnauthorizedException('Supabase 사용자 정보 조회 실패');
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