import { ApiProperty } from '@nestjs/swagger';

export class PlaceResponseDto {
  @ApiProperty({
    description: '맛집 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '맛집 고유 ID',
    example: 'place_12345',
  })
  placeId: string;

  @ApiProperty({
    description: '맛집 이름',
    example: '맛있는 식당',
  })
  placeName: string;

  @ApiProperty({
    description: '맛집 설명',
    example: '정말 맛있는 식당입니다',
  })
  description: string;

  @ApiProperty({
    description: '이미지 URL',
    example: 'https://example.com/image.jpg',
  })
  imageUrl: string;

  @ApiProperty({
    description: '위도',
    example: 37.5665,
  })
  latitude: number;

  @ApiProperty({
    description: '경도',
    example: 126.9780,
  })
  longitude: number;

  @ApiProperty({
    description: '생성일시',
    example: '2024-01-01T12:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정일시',
    example: '2024-01-01T12:00:00.000Z',
  })
  updatedAt: Date;
}