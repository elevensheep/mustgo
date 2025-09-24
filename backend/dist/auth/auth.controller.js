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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const local_auth_guard_1 = require("./guards/local-auth.guard");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const supabase_oauth_guard_1 = require("./guards/supabase-oauth.guard");
const api_response_dto_1 = require("../common/dto/api-response.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(req) {
        const result = await this.authService.login(req.user);
        return api_response_dto_1.ApiResponse.successWithMessage('로그인이 성공했습니다', result);
    }
    async getProfile(req) {
        return api_response_dto_1.ApiResponse.success(req.user);
    }
    async signInWithSupabase(provider, res) {
        console.log(`🔐 [OAuth] ${provider} 로그인 요청 시작`);
        try {
            console.log(`📡 [OAuth] Supabase 서비스에 ${provider} OAuth URL 요청 중...`);
            const { url } = await this.authService.signInWithSupabase(provider);
            console.log(`✅ [OAuth] ${provider} OAuth URL 생성 성공:`, url);
            console.log(`🔄 [OAuth] 사용자를 ${provider} OAuth 페이지로 리다이렉트 중...`);
            return res.redirect(url);
        }
        catch (error) {
            console.error(`❌ [OAuth] ${provider} 로그인 시작 실패:`, error.message);
            return res.status(400).json(api_response_dto_1.ApiResponse.error('OAuth 로그인 시작에 실패했습니다'));
        }
    }
    async supabaseCallback(req, res) {
        console.log(`🔄 [OAuth Callback] OAuth 콜백 요청 수신`);
        console.log(`📋 [OAuth Callback] 요청 데이터:`, {
            query: req.query,
            user: req.user ? '사용자 정보 있음' : '사용자 정보 없음'
        });
        try {
            console.log(`👤 [OAuth Callback] 인증된 사용자 정보:`, req.user);
            console.log(`🔑 [OAuth Callback] JWT 토큰 생성 중...`);
            const result = await this.authService.login(req.user);
            console.log(`✅ [OAuth Callback] JWT 토큰 생성 성공`);
            console.log(`🔄 [OAuth Callback] 프론트엔드로 리다이렉트 중: ${process.env.FRONTEND_URL}/auth/success`);
            return res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${result.access_token}`);
        }
        catch (error) {
            console.error(`❌ [OAuth Callback] 콜백 처리 실패:`, error.message);
            console.log(`🔄 [OAuth Callback] 에러 페이지로 리다이렉트 중: ${process.env.FRONTEND_URL}/auth/error`);
            return res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=${encodeURIComponent(error.message)}`);
        }
    }
    async signOutFromSupabase(body) {
        try {
            const result = await this.authService.signOutFromSupabase(body.accessToken);
            return api_response_dto_1.ApiResponse.successWithMessage('Supabase에서 성공적으로 로그아웃했습니다', result);
        }
        catch (error) {
            return api_response_dto_1.ApiResponse.error('Supabase 로그아웃에 실패했습니다');
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: '사용자 로그인', description: '이메일과 비밀번호로 로그인합니다' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'user@example.com' },
                password: { type: 'string', example: 'password123' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '로그인 성공' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: '인증 실패' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('profile'),
    (0, swagger_1.ApiOperation)({ summary: '사용자 프로필 조회', description: 'JWT 토큰으로 사용자 프로필을 조회합니다' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '프로필 조회 성공' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: '인증 실패' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('supabase/:provider'),
    (0, swagger_1.ApiOperation)({ summary: 'Supabase OAuth 로그인', description: 'Supabase를 통한 OAuth 로그인을 시작합니다' }),
    (0, swagger_1.ApiParam)({ name: 'provider', description: 'OAuth 제공자', enum: ['google', 'github', 'discord', 'kakao'] }),
    (0, swagger_1.ApiResponse)({ status: 302, description: 'OAuth 제공자로 리다이렉트' }),
    __param(0, (0, common_1.Param)('provider')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signInWithSupabase", null);
__decorate([
    (0, common_1.Get)('supabase/callback'),
    (0, common_1.UseGuards)(supabase_oauth_guard_1.SupabaseOAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Supabase OAuth 콜백', description: 'OAuth 인증 후 콜백을 처리합니다' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'OAuth 로그인 성공' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'OAuth 인증 실패' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "supabaseCallback", null);
__decorate([
    (0, common_1.Post)('supabase/signout'),
    (0, swagger_1.ApiOperation)({ summary: 'Supabase 로그아웃', description: 'Supabase에서 로그아웃합니다' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '로그아웃 성공' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signOutFromSupabase", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('인증'),
    (0, common_1.Controller)('api/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map