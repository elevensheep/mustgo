import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email', // 요청 본문의 'email' 필드를 Passport의 username으로 사용
      passwordField: 'password' // 요청 본문의 'password' 필드를 Passport의 password로 사용
    });
  }

  async validate(email: string, password: string): Promise<any> {
    console.log(`🔐 [LocalStrategy] 이메일 로그인 시도: ${email}`);
    
    try {
      const user = await this.authService.validateUser(email, password);
      if (!user) {
        console.log(`❌ [LocalStrategy] 사용자 검증 실패: ${email}`);
        throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다');
      }
      
      console.log(`✅ [LocalStrategy] 사용자 검증 성공: ${email}`);
      return user;
    } catch (error) {
      console.error(`❌ [LocalStrategy] 로그인 오류:`, error.message);
      throw new UnauthorizedException('로그인에 실패했습니다');
    }
  }
}