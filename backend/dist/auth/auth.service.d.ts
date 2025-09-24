import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SupabaseService } from './supabase.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private supabaseService;
    constructor(usersService: UsersService, jwtService: JwtService, supabaseService: SupabaseService);
    validateUser(email: string, password: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            uuid: any;
            email: any;
            nickname: any;
        };
    }>;
    validateJwtPayload(payload: any): Promise<import("../users/entities/user.entity").User>;
    getSupabaseUserInfo(accessToken: string): Promise<{
        uuid: string;
        email: string;
        nickname: string;
        supabaseId: string;
    }>;
    signInWithSupabase(provider: 'google' | 'github' | 'discord' | 'kakao'): Promise<{
        provider: import("@supabase/auth-js").Provider;
        url: string;
    } | {
        provider: import("@supabase/auth-js").Provider;
        url: null;
    }>;
    signOutFromSupabase(accessToken: string): Promise<{
        success: boolean;
    }>;
}
