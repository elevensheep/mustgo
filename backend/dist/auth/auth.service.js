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
        const user = await this.usersService.findByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
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
            const supabaseUser = await this.supabaseService.getUserInfo(accessToken);
            if (!supabaseUser) {
                return null;
            }
            let localUser = await this.usersService.findByEmail(supabaseUser.email);
            if (!localUser) {
                const newUser = await this.usersService.create({
                    email: supabaseUser.email,
                    password: '',
                    nickname: supabaseUser.user_metadata?.full_name || supabaseUser.email.split('@')[0],
                });
                localUser = newUser;
            }
            return {
                uuid: localUser.uuid,
                email: localUser.email,
                nickname: localUser.nickname,
                supabaseId: supabaseUser.id,
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Supabase 사용자 정보 조회 실패');
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