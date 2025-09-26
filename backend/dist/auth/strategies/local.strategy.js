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
exports.LocalStrategy = void 0;
const passport_local_1 = require("passport-local");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../auth.service");
let LocalStrategy = class LocalStrategy extends (0, passport_1.PassportStrategy)(passport_local_1.Strategy) {
    constructor(authService) {
        super({
            usernameField: 'email',
            passwordField: 'password'
        });
        this.authService = authService;
    }
    async validate(email, password) {
        console.log(`🔐 [LocalStrategy] 이메일 로그인 시도: ${email}`);
        try {
            const user = await this.authService.validateUser(email, password);
            if (!user) {
                console.log(`❌ [LocalStrategy] 사용자 검증 실패: ${email}`);
                throw new common_1.UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다');
            }
            console.log(`✅ [LocalStrategy] 사용자 검증 성공: ${email}`);
            return user;
        }
        catch (error) {
            console.error(`❌ [LocalStrategy] 로그인 오류:`, error.message);
            throw new common_1.UnauthorizedException('로그인에 실패했습니다');
        }
    }
};
exports.LocalStrategy = LocalStrategy;
exports.LocalStrategy = LocalStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], LocalStrategy);
//# sourceMappingURL=local.strategy.js.map