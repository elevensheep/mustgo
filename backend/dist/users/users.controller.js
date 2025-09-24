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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("./users.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const api_response_dto_1 = require("../common/dto/api-response.dto");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async create(createUserDto) {
        const user = await this.usersService.create(createUserDto);
        const userResponse = {
            uuid: user.uuid,
            email: user.email,
            nickname: user.nickname,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
        return api_response_dto_1.ApiResponse.successWithMessage('사용자가 성공적으로 생성되었습니다', userResponse);
    }
    async findAll() {
        const users = await this.usersService.findAll();
        const userResponses = users.map(user => ({
            uuid: user.uuid,
            email: user.email,
            nickname: user.nickname,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }));
        return api_response_dto_1.ApiResponse.success(userResponses);
    }
    async findOne(id) {
        const user = await this.usersService.findOne(id);
        const userResponse = {
            uuid: user.uuid,
            email: user.email,
            nickname: user.nickname,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
        return api_response_dto_1.ApiResponse.success(userResponse);
    }
    async update(id, updateUserDto) {
        const user = await this.usersService.update(id, updateUserDto);
        const userResponse = {
            uuid: user.uuid,
            email: user.email,
            nickname: user.nickname,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
        return api_response_dto_1.ApiResponse.successWithMessage('사용자 정보가 성공적으로 수정되었습니다', userResponse);
    }
    async remove(id) {
        await this.usersService.remove(id);
        return api_response_dto_1.ApiResponse.successWithMessage('사용자가 성공적으로 삭제되었습니다', null);
    }
    async checkEmail(email) {
        const exists = await this.usersService.isEmailExists(email);
        return api_response_dto_1.ApiResponse.successWithMessage(exists ? '이메일이 이미 사용 중입니다' : '사용 가능한 이메일입니다', exists);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiOperation)({ summary: '새 사용자 생성', description: '새로운 사용자 계정을 생성합니다' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: '사용자 생성 성공' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: '잘못된 요청 데이터' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: '이미 존재하는 이메일' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, swagger_1.ApiOperation)({ summary: '모든 사용자 조회', description: '시스템에 등록된 모든 사용자 목록을 조회합니다' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '사용자 목록 조회 성공' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '사용자 ID로 조회', description: 'UUID를 사용하여 특정 사용자 정보를 조회합니다' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: '사용자 UUID', example: '550e8400-e29b-41d4-a716-446655440000' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '사용자 조회 성공' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '사용자를 찾을 수 없음' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '사용자 정보 수정', description: '기존 사용자의 정보를 수정합니다' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: '사용자 UUID', example: '550e8400-e29b-41d4-a716-446655440000' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '사용자 정보 수정 성공' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: '잘못된 요청 데이터' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '사용자를 찾을 수 없음' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '사용자 삭제', description: '특정 사용자 계정을 삭제합니다' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: '사용자 UUID', example: '550e8400-e29b-41d4-a716-446655440000' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '사용자 삭제 성공' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '사용자를 찾을 수 없음' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('check-email'),
    (0, swagger_1.ApiOperation)({ summary: '이메일 중복 체크', description: '이메일 주소가 이미 사용 중인지 확인합니다' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '이메일 중복 체크 완료' }),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "checkEmail", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('사용자 관리'),
    (0, common_1.Controller)('api/users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map