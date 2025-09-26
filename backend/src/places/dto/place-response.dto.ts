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
    required: false,
  })
  placeId?: string;

  @ApiProperty({
    description: '맛집 이름',
    example: '맛있는 식당',
  })
  name: string;

  @ApiProperty({
    description: '주소',
    example: '서울시 강남구 테헤란로 123',
    required: false,
  })
  address?: string;

  @ApiProperty({
    description: '도로명 주소',
    example: '서울시 강남구 테헤란로 123',
    required: false,
  })
  roadAddress?: string;

  @ApiProperty({
    description: '카테고리',
    example: '한식',
    required: false,
  })
  category?: string;

  @ApiProperty({
    description: '전화번호',
    example: '02-1234-5678',
    required: false,
  })
  phone?: string;

  @ApiProperty({
    description: '웹사이트 URL',
    example: 'https://example.com',
    required: false,
  })
  url?: string;

  @ApiProperty({
    description: '맛집 설명',
    example: '정말 맛있는 식당입니다',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: '이미지 URL',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  imageUrl?: string;

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
    description: '거리',
    example: 100,
    required: false,
  })
  distance?: number;

  @ApiProperty({
    description: 'API에서 가져온 데이터인지 여부',
    example: false,
    required: false,
  })
  isFromAPI?: boolean;

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