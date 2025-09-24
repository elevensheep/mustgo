import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PlaceGroupsService } from './place-groups.service';
import { ApiResponse as ApiResponseDto } from '../common/dto/api-response.dto';

@ApiTags('맛집 그룹 관리')
@Controller('api/place-groups')
export class PlaceGroupsController {
  constructor(private readonly placeGroupsService: PlaceGroupsService) {}

  @Post('create')
  @ApiOperation({ summary: '새 맛집 그룹 생성', description: '새로운 맛집 그룹을 생성합니다' })
  @ApiResponse({ status: 201, description: '맛집 그룹 생성 성공' })
  async create(
    @Body() createPlaceGroupDto: { name: string; description?: string; userId: string },
  ): Promise<ApiResponseDto<any>> {
    const placeGroup = await this.placeGroupsService.create(
      createPlaceGroupDto.name,
      createPlaceGroupDto.description,
      createPlaceGroupDto.userId,
    );
    return ApiResponseDto.successWithMessage('맛집 그룹이 성공적으로 생성되었습니다', placeGroup);
  }

  @Get('all')
  @ApiOperation({ summary: '모든 맛집 그룹 조회', description: '등록된 모든 맛집 그룹을 조회합니다' })
  @ApiResponse({ status: 200, description: '맛집 그룹 목록 조회 성공' })
  async findAll(): Promise<ApiResponseDto<any[]>> {
    const placeGroups = await this.placeGroupsService.findAll();
    return ApiResponseDto.success(placeGroups);
  }

  @Get(':id')
  @ApiOperation({ summary: '맛집 그룹 조회', description: '특정 맛집 그룹을 조회합니다' })
  @ApiResponse({ status: 200, description: '맛집 그룹 조회 성공' })
  async findOne(@Param('id') id: string): Promise<ApiResponseDto<any>> {
    const placeGroup = await this.placeGroupsService.findOne(+id);
    return ApiResponseDto.success(placeGroup);
  }
}