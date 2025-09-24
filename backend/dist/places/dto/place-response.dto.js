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
exports.PlaceResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class PlaceResponseDto {
}
exports.PlaceResponseDto = PlaceResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '맛집 ID',
        example: 1,
    }),
    __metadata("design:type", Number)
], PlaceResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '맛집 고유 ID',
        example: 'place_12345',
    }),
    __metadata("design:type", String)
], PlaceResponseDto.prototype, "placeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '맛집 이름',
        example: '맛있는 식당',
    }),
    __metadata("design:type", String)
], PlaceResponseDto.prototype, "placeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '맛집 설명',
        example: '정말 맛있는 식당입니다',
    }),
    __metadata("design:type", String)
], PlaceResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '이미지 URL',
        example: 'https://example.com/image.jpg',
    }),
    __metadata("design:type", String)
], PlaceResponseDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '위도',
        example: 37.5665,
    }),
    __metadata("design:type", Number)
], PlaceResponseDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '경도',
        example: 126.9780,
    }),
    __metadata("design:type", Number)
], PlaceResponseDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '생성일시',
        example: '2024-01-01T12:00:00.000Z',
    }),
    __metadata("design:type", Date)
], PlaceResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '수정일시',
        example: '2024-01-01T12:00:00.000Z',
    }),
    __metadata("design:type", Date)
], PlaceResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=place-response.dto.js.map