"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
let SupabaseService = class SupabaseService {
    constructor(configService) {
        this.configService = configService;
        this.supabase = (0, supabase_js_1.createClient)(this.configService.get('SUPABASE_URL'), this.configService.get('SUPABASE_ANON_KEY'));
    }
    getClient() {
        return this.supabase;
    }
    async getUserInfo(accessToken) {
        try {
            console.log('🔍 [SupabaseService] 사용자 정보 조회 시작');
            const { data: { user }, error } = await this.supabase.auth.getUser(accessToken);
            if (error) {
                console.error('❌ [SupabaseService] 사용자 정보 조회 실패:', error.message);
                throw new Error(error.message);
            }
            if (!user) {
                console.error('❌ [SupabaseService] 사용자 정보가 없습니다');
                throw new Error('사용자 정보가 없습니다');
            }
            console.log('✅ [SupabaseService] 사용자 정보 조회 성공:', {
                id: user.id,
                email: user.email,
                metadata: user.user_metadata
            });
            return user;
        }
        catch (error) {
            console.error('❌ [SupabaseService] 사용자 정보 조회 실패:', error.message);
            throw new Error(`Supabase 사용자 정보 조회 실패: ${error.message}`);
        }
    }
    async signInWithOAuth(provider) {
        console.log(`🌐 [SupabaseService] ${provider} OAuth URL 생성 시작`);
        console.log(`🔗 [SupabaseService] 리다이렉트 URL: ${this.configService.get('FRONTEND_URL')}/auth/success`);
        const { data, error } = await this.supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${this.configService.get('FRONTEND_URL')}/auth/success`,
            },
        });
        if (error) {
            console.error(`❌ [SupabaseService] ${provider} OAuth URL 생성 실패:`, error.message);
            throw new Error(error.message);
        }
        console.log(`✅ [SupabaseService] ${provider} OAuth URL 생성 성공:`, data.url);
        return data;
    }
    async signOut(accessToken) {
        const { error } = await this.supabase.auth.signOut();
        if (error) {
            throw new Error(error.message);
        }
        return { success: true };
    }
};
exports.SupabaseService = SupabaseService;
exports.SupabaseService = SupabaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SupabaseService);
//# sourceMappingURL=supabase.service.js.map