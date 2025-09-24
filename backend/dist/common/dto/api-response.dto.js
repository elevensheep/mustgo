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
exports.ApiResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
class ApiResponse {
    constructor(success, message, data, errorCode) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.errorCode = errorCode;
    }
    static success(data) {
        return new ApiResponse(true, '요청이 성공적으로 처리되었습니다', data);
    }
    static successWithMessage(message, data) {
        return new ApiResponse(true, message, data);
    }
    static error(message, errorCode) {
        return new ApiResponse(false, message, undefined, errorCode);
    }
}
exports.ApiResponse = ApiResponse;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '응답 성공 여부', example: true }),
    __metadata("design:type", Boolean)
], ApiResponse.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '응답 메시지', example: '요청이 성공적으로 처리되었습니다' }),
    __metadata("design:type", String)
], ApiResponse.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '응답 데이터' }),
    __metadata("design:type", Object)
], ApiResponse.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '에러 코드', example: 'USER_NOT_FOUND', required: false }),
    __metadata("design:type", String)
], ApiResponse.prototype, "errorCode", void 0);
//# sourceMappingURL=api-response.dto.js.map