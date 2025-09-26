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
exports.CreatePlaceDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreatePlaceDto {
}
exports.CreatePlaceDto = CreatePlaceDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '맛집 고유 ID',
        example: 'place_12345',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePlaceDto.prototype, "placeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '맛집 이름',
        example: '맛있는 식당',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: '맛집 이름은 필수입니다' }),
    __metadata("design:type", String)
], CreatePlaceDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '주소',
        example: '서울시 강남구 테헤란로 123',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePlaceDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '도로명 주소',
        example: '서울시 강남구 테헤란로 123',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePlaceDto.prototype, "roadAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '카테고리',
        example: '한식',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePlaceDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '전화번호',
        example: '02-1234-5678',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePlaceDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '웹사이트 URL',
        example: 'https://example.com',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePlaceDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '맛집 설명',
        example: '정말 맛있는 식당입니다',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePlaceDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '이미지 URL',
        example: 'https://example.com/image.jpg',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePlaceDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '사용자 UUID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)({ message: '사용자 ID는 필수입니다' }),
    __metadata("design:type", String)
], CreatePlaceDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '위도',
        example: 37.5665,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)({ message: '위도는 필수입니다' }),
    __metadata("design:type", Number)
], CreatePlaceDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '경도',
        example: 126.9780,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)({ message: '경도는 필수입니다' }),
    __metadata("design:type", Number)
], CreatePlaceDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '거리',
        example: 100,
        required: false,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreatePlaceDto.prototype, "distance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'API에서 가져온 데이터인지 여부',
        example: false,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreatePlaceDto.prototype, "isFromAPI", void 0);
//# sourceMappingURL=create-place.dto.js.map