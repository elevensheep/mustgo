import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsUUID } from 'class-validator';

export class CreatePlaceDto {
  @ApiProperty({
    description: '맛집 고유 ID',
    example: 'place_12345',
  })
  @IsString()
  @IsNotEmpty({ message: '맛집 ID는 필수입니다' })
  placeId: string;

  @ApiProperty({
    description: '맛집 이름',
    example: '맛있는 식당',
  })
  @IsString()
  @IsNotEmpty({ message: '맛집 이름은 필수입니다' })
  placeName: string;

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
    required: false,
  })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({
    description: '경도',
    example: 126.9780,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  longitude?: number;
}