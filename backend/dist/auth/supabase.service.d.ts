import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
export declare class SupabaseService {
    private configService;
    private supabase;
    constructor(configService: ConfigService);
    getClient(): SupabaseClient;
    getUserInfo(accessToken: string): Promise<import("@supabase/supabase-js").AuthUser>;
    signInWithOAuth(provider: 'google' | 'github' | 'discord' | 'kakao'): Promise<{
        provider: import("@supabase/supabase-js").Provider;
        url: string;
    } | {
        provider: import("@supabase/supabase-js").Provider;
        url: null;
    }>;
    signOut(accessToken: string): Promise<{
        success: boolean;
    }>;
}
