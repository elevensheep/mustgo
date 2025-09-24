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
exports.PlaceGroupsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const place_groups_service_1 = require("./place-groups.service");
const api_response_dto_1 = require("../common/dto/api-response.dto");
let PlaceGroupsController = class PlaceGroupsController {
    constructor(placeGroupsService) {
        this.placeGroupsService = placeGroupsService;
    }
    async create(createPlaceGroupDto) {
        const placeGroup = await this.placeGroupsService.create(createPlaceGroupDto.name, createPlaceGroupDto.description, createPlaceGroupDto.userId);
        return api_response_dto_1.ApiResponse.successWithMessage('맛집 그룹이 성공적으로 생성되었습니다', placeGroup);
    }
    async findAll() {
        const placeGroups = await this.placeGroupsService.findAll();
        return api_response_dto_1.ApiResponse.success(placeGroups);
    }
    async findOne(id) {
        const placeGroup = await this.placeGroupsService.findOne(+id);
        return api_response_dto_1.ApiResponse.success(placeGroup);
    }
};
exports.PlaceGroupsController = PlaceGroupsController;
__decorate([
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiOperation)({ summary: '새 맛집 그룹 생성', description: '새로운 맛집 그룹을 생성합니다' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: '맛집 그룹 생성 성공' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlaceGroupsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, swagger_1.ApiOperation)({ summary: '모든 맛집 그룹 조회', description: '등록된 모든 맛집 그룹을 조회합니다' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '맛집 그룹 목록 조회 성공' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PlaceGroupsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '맛집 그룹 조회', description: '특정 맛집 그룹을 조회합니다' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '맛집 그룹 조회 성공' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlaceGroupsController.prototype, "findOne", null);
exports.PlaceGroupsController = PlaceGroupsController = __decorate([
    (0, swagger_1.ApiTags)('맛집 그룹 관리'),
    (0, common_1.Controller)('api/place-groups'),
    __metadata("design:paramtypes", [place_groups_service_1.PlaceGroupsService])
], PlaceGroupsController);
//# sourceMappingURL=place-groups.controller.js.map