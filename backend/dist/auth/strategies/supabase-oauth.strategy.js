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
exports.SupabaseOAuthStrategy = void 0;
const passport_custom_1 = require("passport-custom");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_service_1 = require("../auth.service");
let SupabaseOAuthStrategy = class SupabaseOAuthStrategy extends (0, passport_1.PassportStrategy)(passport_custom_1.Strategy, 'supabase-oauth') {
    constructor(configService, authService) {
        super();
        this.configService = configService;
        this.authService = authService;
    }
    async validate(req) {
        console.log(`🔍 [OAuth Strategy] OAuth 전략 검증 시작`);
        console.log(`📋 [OAuth Strategy] 요청 쿼리:`, req.query);
        try {
            const accessToken = req.query.access_token;
            console.log(`🔑 [OAuth Strategy] Access Token 추출:`, accessToken ? '토큰 있음' : '토큰 없음');
            if (!accessToken) {
                console.error(`❌ [OAuth Strategy] Access token이 없습니다`);
                throw new common_1.UnauthorizedException('Access token이 없습니다');
            }
            console.log(`👤 [OAuth Strategy] Supabase에서 사용자 정보 조회 중...`);
            const userInfo = await this.authService.getSupabaseUserInfo(accessToken);
            if (!userInfo) {
                console.error(`❌ [OAuth Strategy] Supabase 사용자 정보를 가져올 수 없습니다`);
                throw new common_1.UnauthorizedException('Supabase 사용자 정보를 가져올 수 없습니다');
            }
            console.log(`✅ [OAuth Strategy] 사용자 인증 성공:`, userInfo);
            return userInfo;
        }
        catch (error) {
            console.error(`❌ [OAuth Strategy] OAuth 인증 실패:`, error.message);
            throw new common_1.UnauthorizedException('Supabase OAuth 인증에 실패했습니다');
        }
    }
};
exports.SupabaseOAuthStrategy = SupabaseOAuthStrategy;
exports.SupabaseOAuthStrategy = SupabaseOAuthStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        auth_service_1.AuthService])
], SupabaseOAuthStrategy);
//# sourceMappingURL=supabase-oauth.strategy.js.map