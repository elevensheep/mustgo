import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PlaceGroupsService } from './place-groups.service';
import { ApiResponse as ApiResponseDto } from '../common/dto/api-response.dto';
import { CreatePlaceGroupDto } from './dto/create-place-group.dto';
import { PlaylistResponseDto } from './dto/playlist-response.dto';

@ApiTags('맛집 그룹 관리')
@Controller('api/place-groups')
export class PlaceGroupsController {
  constructor(private readonly placeGroupsService: PlaceGroupsService) {}

  @Post('create')
  @ApiOperation({ summary: '새 플레이리스트 생성', description: '새로운 플레이리스트를 생성합니다' })
  @ApiResponse({ status: 201, description: '플레이리스트 생성 성공', type: PlaylistResponseDto })
  async create(
    @Body() createPlaceGroupDto: CreatePlaceGroupDto,
  ): Promise<ApiResponseDto<PlaylistResponseDto>> {
    const placeGroup = await this.placeGroupsService.create(createPlaceGroupDto);
    return ApiResponseDto.successWithMessage('플레이리스트가 성공적으로 생성되었습니다', placeGroup);
  }

  @Get('all')
  @ApiOperation({ summary: '모든 플레이리스트 조회', description: '등록된 모든 플레이리스트를 조회합니다' })
  @ApiResponse({ status: 200, description: '플레이리스트 목록 조회 성공', type: [PlaylistResponseDto] })
  async findAll(): Promise<ApiResponseDto<PlaylistResponseDto[]>> {
    const placeGroups = await this.placeGroupsService.findAll();
    return ApiResponseDto.success(placeGroups);
  }

  @Get(':id')
  @ApiOperation({ summary: '플레이리스트 조회', description: '특정 플레이리스트를 조회합니다' })
  @ApiResponse({ status: 200, description: '플레이리스트 조회 성공', type: PlaylistResponseDto })
  async findOne(@Param('id') id: string): Promise<ApiResponseDto<PlaylistResponseDto>> {
    const placeGroup = await this.placeGroupsService.findOne(+id);
    return ApiResponseDto.success(placeGroup);
  }
}