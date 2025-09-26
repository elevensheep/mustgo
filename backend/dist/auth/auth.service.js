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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const supabase_service_1 = require("./supabase.service");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(usersService, jwtService, supabaseService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.supabaseService = supabaseService;
    }
    async validateUser(email, password) {
        console.log(`🔍 [AuthService] 사용자 검증 시작: ${email}`);
        const user = await this.usersService.findByEmail(email);
        console.log(`👤 [AuthService] 사용자 조회 결과:`, user ? '사용자 존재' : '사용자 없음');
        if (!user) {
            console.log(`❌ [AuthService] 사용자를 찾을 수 없습니다: ${email}`);
            return null;
        }
        console.log(`🔐 [AuthService] 비밀번호 검증 중...`);
        console.log(`🔐 [AuthService] 입력된 비밀번호: ${password}`);
        console.log(`🔐 [AuthService] 저장된 해시: ${user.password}`);
        console.log(`🔐 [AuthService] 해시 길이: ${user.password.length}`);
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log(`🔐 [AuthService] 비밀번호 검증 결과:`, isPasswordValid ? '성공' : '실패');
        if (isPasswordValid) {
            const { password, ...result } = user;
            console.log(`✅ [AuthService] 사용자 검증 성공:`, result.uuid);
            return result;
        }
        console.log(`❌ [AuthService] 비밀번호가 일치하지 않습니다`);
        return null;
    }
    async login(user) {
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
    async validateJwtPayload(payload) {
        const user = await this.usersService.findOne(payload.sub);
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        return user;
    }
    async getSupabaseUserInfo(accessToken) {
        try {
            console.log('🔍 [AuthService] Supabase 사용자 정보 조회 시작');
            const supabaseUser = await this.supabaseService.getUserInfo(accessToken);
            if (!supabaseUser) {
                console.error('❌ [AuthService] Supabase 사용자 정보가 없습니다');
                return null;
            }
            console.log('✅ [AuthService] Supabase 사용자 정보 조회 성공:', {
                email: supabaseUser.email,
                metadata: supabaseUser.user_metadata
            });
            let localUser = await this.usersService.findByEmail(supabaseUser.email);
            if (!localUser) {
                console.log('👤 [AuthService] 새 사용자 생성 중...');
                const newUser = await this.usersService.create({
                    email: supabaseUser.email,
                    password: '',
                    nickname: supabaseUser.user_metadata?.full_name || supabaseUser.email.split('@')[0],
                });
                localUser = newUser;
                console.log('✅ [AuthService] 새 사용자 생성 완료:', localUser.uuid);
            }
            else {
                console.log('✅ [AuthService] 기존 사용자 찾음:', localUser.uuid);
            }
            const result = {
                uuid: localUser.uuid,
                email: localUser.email,
                nickname: localUser.nickname,
                supabaseId: supabaseUser.id,
            };
            console.log('🎯 [AuthService] 최종 사용자 정보:', result);
            return result;
        }
        catch (error) {
            console.error('❌ [AuthService] Supabase 사용자 정보 조회 실패:', error.message);
            throw new common_1.UnauthorizedException(`Supabase 사용자 정보 조회 실패: ${error.message}`);
        }
    }
    async signInWithSupabase(provider) {
        console.log(`🔧 [AuthService] Supabase OAuth 서비스 호출: ${provider}`);
        return this.supabaseService.signInWithOAuth(provider);
    }
    async signOutFromSupabase(accessToken) {
        return this.supabaseService.signOut(accessToken);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        supabase_service_1.SupabaseService])
], AuthService);
//# sourceMappingURL=auth.service.js.map