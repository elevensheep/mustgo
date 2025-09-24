import { Strategy } from 'passport-custom';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
declare const SupabaseOAuthStrategy_base: new (...args: any[]) => Strategy;
export declare class SupabaseOAuthStrategy extends SupabaseOAuthStrategy_base {
    private configService;
    private authService;
    constructor(configService: ConfigService, authService: AuthService);
    validate(req: any): Promise<any>;
}
export {};
