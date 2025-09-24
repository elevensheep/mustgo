import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { ApiResponse as ApiResponseDto } from '../common/dto/api-response.dto';

@ApiTags('댓글 관리')
@Controller('api/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':placeId')
  @ApiOperation({ summary: '맛집 댓글 조회', description: '특정 맛집의 댓글 목록을 조회합니다' })
  @ApiParam({ name: 'placeId', description: '맛집 ID', example: 'place_12345' })
  @ApiResponse({ status: 200, description: '댓글 목록 조회 성공' })
  async findByPlaceId(@Param('placeId') placeId: string): Promise<ApiResponseDto<any[]>> {
    const comments = await this.commentsService.findByPlaceId(placeId);
    return ApiResponseDto.success(comments);
  }
}