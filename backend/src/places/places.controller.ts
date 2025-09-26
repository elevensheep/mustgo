import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PlacesService } from './places.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { PlaceResponseDto } from './dto/place-response.dto';
import { ApiResponse as ApiResponseDto } from '../common/dto/api-response.dto';

@ApiTags('맛집 관리')
@Controller('api/places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post('create')
  @ApiOperation({ summary: '새 맛집 생성', description: '새로운 맛집을 등록합니다' })
  @ApiResponse({ status: 201, description: '맛집 생성 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
  async create(@Body() createPlaceDto: CreatePlaceDto): Promise<ApiResponseDto<PlaceResponseDto | null>> {
    const place = await this.placesService.create(createPlaceDto);
    
    if (!place) {
      return ApiResponseDto.successWithMessage('중복된 맛집이 삭제되었습니다', null);
    }

    const placeResponse: PlaceResponseDto = {
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

    return ApiResponseDto.successWithMessage('맛집이 성공적으로 생성되었습니다', placeResponse);
  }

  @Get('all')
  @ApiOperation({ summary: '모든 맛집 조회', description: '등록된 모든 맛집 목록을 조회합니다' })
  @ApiResponse({ status: 200, description: '맛집 목록 조회 성공' })
  async findAll(): Promise<ApiResponseDto<PlaceResponseDto[]>> {
    const places = await this.placesService.findAll();
    const placeResponses: PlaceResponseDto[] = places.map(place => ({
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
    return ApiResponseDto.successWithMessage('모든 맛집을 조회했습니다', placeResponses);
  }

  @Get(':name')
  @ApiOperation({ summary: '맛집 이름으로 검색', description: '맛집 이름으로 맛집을 검색합니다' })
  @ApiParam({ name: 'name', description: '검색할 맛집 이름', example: '맛있는 식당' })
  @ApiResponse({ status: 200, description: '맛집 검색 완료' })
  async findByName(@Param('name') name: string): Promise<ApiResponseDto<PlaceResponseDto[]>> {
    const places = await this.placesService.findByName(name);
    
    if (places.length === 0) {
      return ApiResponseDto.error('검색 결과가 없습니다', 'PLACE_NOT_FOUND');
    }

    const placeResponses: PlaceResponseDto[] = places.map(place => ({
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

    return ApiResponseDto.successWithMessage('맛집 검색이 완료되었습니다', placeResponses);
  }
}