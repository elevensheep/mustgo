import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsUUID } from 'class-validator';

export class CreatePlaceDto {
  @ApiProperty({
    description: '맛집 고유 ID',
    example: 'place_12345',
    required: false,
  })
  @IsString()
  @IsOptional()
  placeId?: string;

  @ApiProperty({
    description: '맛집 이름',
    example: '맛있는 식당',
  })
  @IsString()
  @IsNotEmpty({ message: '맛집 이름은 필수입니다' })
  name: string;

  @ApiProperty({
    description: '주소',
    example: '서울시 강남구 테헤란로 123',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: '도로명 주소',
    example: '서울시 강남구 테헤란로 123',
    required: false,
  })
  @IsString()
  @IsOptional()
  roadAddress?: string;

  @ApiProperty({
    description: '카테고리',
    example: '한식',
    required: false,
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({
    description: '전화번호',
    example: '02-1234-5678',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: '웹사이트 URL',
    example: 'https://example.com',
    required: false,
  })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiProperty({
    description: '맛집 설명',
    example: '정말 맛있는 식당입니다',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: '이미지 URL',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    description: '사용자 UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty({ message: '사용자 ID는 필수입니다' })
  userId: string;

  @ApiProperty({
    description: '위도',
    example: 37.5665,
  })
  @IsNumber()
  @IsNotEmpty({ message: '위도는 필수입니다' })
  latitude: number;

  @ApiProperty({
    description: '경도',
    example: 126.9780,
  })
  @IsNumber()
  @IsNotEmpty({ message: '경도는 필수입니다' })
  longitude: number;

  @ApiProperty({
    description: '거리',
    example: 100,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  distance?: number;

  @ApiProperty({
    description: 'API에서 가져온 데이터인지 여부',
    example: false,
    required: false,
  })
  @IsOptional()
  isFromAPI?: boolean;
}