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
exports.CommentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const comments_service_1 = require("./comments.service");
const api_response_dto_1 = require("../common/dto/api-response.dto");
let CommentsController = class CommentsController {
    constructor(commentsService) {
        this.commentsService = commentsService;
    }
    async findByPlaceId(placeId) {
        const comments = await this.commentsService.findByPlaceId(placeId);
        return api_response_dto_1.ApiResponse.success(comments);
    }
};
exports.CommentsController = CommentsController;
__decorate([
    (0, common_1.Get)(':placeId'),
    (0, swagger_1.ApiOperation)({ summary: '맛집 댓글 조회', description: '특정 맛집의 댓글 목록을 조회합니다' }),
    (0, swagger_1.ApiParam)({ name: 'placeId', description: '맛집 ID', example: 'place_12345' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '댓글 목록 조회 성공' }),
    __param(0, (0, common_1.Param)('placeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "findByPlaceId", null);
exports.CommentsController = CommentsController = __decorate([
    (0, swagger_1.ApiTags)('댓글 관리'),
    (0, common_1.Controller)('api/comments'),
    __metadata("design:paramtypes", [comments_service_1.CommentsService])
], CommentsController);
//# sourceMappingURL=comments.controller.js.map