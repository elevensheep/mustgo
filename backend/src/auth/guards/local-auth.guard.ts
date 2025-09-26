import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  canActivate(context: ExecutionContext) {
    console.log(`🔐 [LocalAuthGuard] 가드 실행 시작`);
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    console.log(`🔐 [LocalAuthGuard] handleRequest 호출`);
    console.log(`🔐 [LocalAuthGuard] err:`, err);
    console.log(`🔐 [LocalAuthGuard] user:`, user);
    console.log(`🔐 [LocalAuthGuard] info:`, info);
    
    if (err || !user) {
      console.log(`❌ [LocalAuthGuard] 인증 실패`);
      throw err || new Error('인증 실패');
    }
    
    console.log(`✅ [LocalAuthGuard] 인증 성공`);
    return user;
  }
}