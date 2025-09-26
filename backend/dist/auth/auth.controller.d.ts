import { AuthService } from './auth.service';
import { ApiResponse as ApiResponseDto } from '../common/dto/api-response.dto';
import { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(req: any, body: any): Promise<ApiResponseDto<any>>;
    getProfile(req: any): Promise<ApiResponseDto<any>>;
    signInWithSupabase(provider: 'google' | 'github' | 'discord' | 'kakao', res: Response): Promise<void | Response<any, Record<string, any>>>;
    supabaseCallback(req: any, res: Response): Promise<void>;
    verifySupabaseToken(body: {
        accessToken: string;
    }): Promise<ApiResponseDto<any>>;
    signOutFromSupabase(body: {
        accessToken: string;
    }): Promise<ApiResponseDto<any>>;
}
