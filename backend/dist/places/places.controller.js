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
exports.PlacesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const places_service_1 = require("./places.service");
const create_place_dto_1 = require("./dto/create-place.dto");
const api_response_dto_1 = require("../common/dto/api-response.dto");
let PlacesController = class PlacesController {
    constructor(placesService) {
        this.placesService = placesService;
    }
    async create(createPlaceDto) {
        const place = await this.placesService.create(createPlaceDto);
        if (!place) {
            return api_response_dto_1.ApiResponse.successWithMessage('중복된 맛집이 삭제되었습니다', null);
        }
        const placeResponse = {
            id: place.id,
            placeId: place.placeId,
            name: place.name,
            address: place.address,
            roadAddress: place.roadAddress,
            category: place.category,
            phone: place.phone,
            url: place.url,
            description: place.description,
            imageUrl: place.imageUrl,
            latitude: place.latitude,
            longitude: place.longitude,
            distance: place.distance,
            isFromAPI: place.isFromAPI,
            createdAt: place.createdAt,
            updatedAt: place.updatedAt,
        };
        return api_response_dto_1.ApiResponse.successWithMessage('맛집이 성공적으로 생성되었습니다', placeResponse);
    }
    async findAll() {
        const places = await this.placesService.findAll();
        const placeResponses = places.map(place => ({
            id: place.id,
            placeId: place.placeId,
            name: place.name,
            address: place.address,
            roadAddress: place.roadAddress,
            category: place.category,
            phone: place.phone,
            url: place.url,
            description: place.description,
            imageUrl: place.imageUrl,
            latitude: place.latitude,
            longitude: place.longitude,
            distance: place.distance,
            isFromAPI: place.isFromAPI,
            createdAt: place.createdAt,
            updatedAt: place.updatedAt,
        }));
        return api_response_dto_1.ApiResponse.successWithMessage('모든 맛집을 조회했습니다', placeResponses);
    }
    async findByName(name) {
        const places = await this.placesService.findByName(name);
        if (places.length === 0) {
            return api_response_dto_1.ApiResponse.error('검색 결과가 없습니다', 'PLACE_NOT_FOUND');
        }
        const placeResponses = places.map(place => ({
            id: place.id,
            placeId: place.placeId,
            name: place.name,
            address: place.address,
            roadAddress: place.roadAddress,
            category: place.category,
            phone: place.phone,
            url: place.url,
            description: place.description,
            imageUrl: place.imageUrl,
            latitude: place.latitude,
            longitude: place.longitude,
            distance: place.distance,
            isFromAPI: place.isFromAPI,
            createdAt: place.createdAt,
            updatedAt: place.updatedAt,
        }));
        return api_response_dto_1.ApiResponse.successWithMessage('맛집 검색이 완료되었습니다', placeResponses);
    }
};
exports.PlacesController = PlacesController;
__decorate([
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiOperation)({ summary: '새 맛집 생성', description: '새로운 맛집을 등록합니다' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: '맛집 생성 성공' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: '잘못된 요청 데이터' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '사용자를 찾을 수 없음' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_place_dto_1.CreatePlaceDto]),
    __metadata("design:returntype", Promise)
], PlacesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, swagger_1.ApiOperation)({ summary: '모든 맛집 조회', description: '등록된 모든 맛집 목록을 조회합니다' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '맛집 목록 조회 성공' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PlacesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':name'),
    (0, swagger_1.ApiOperation)({ summary: '맛집 이름으로 검색', description: '맛집 이름으로 맛집을 검색합니다' }),
    (0, swagger_1.ApiParam)({ name: 'name', description: '검색할 맛집 이름', example: '맛있는 식당' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '맛집 검색 완료' }),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlacesController.prototype, "findByName", null);
exports.PlacesController = PlacesController = __decorate([
    (0, swagger_1.ApiTags)('맛집 관리'),
    (0, common_1.Controller)('api/places'),
    __metadata("design:paramtypes", [places_service_1.PlacesService])
], PlacesController);
//# sourceMappingURL=places.controller.js.map