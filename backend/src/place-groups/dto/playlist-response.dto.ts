import { ApiProperty } from '@nestjs/swagger';
import { PlaceResponseDto } from '../../places/dto/place-response.dto';

export class LocationResponseDto {
  @ApiProperty({ description: '위도', example: 37.5665 })
  latitude: number;

  @ApiProperty({ description: '경도', example: 126.9780 })
  longitude: number;

  @ApiProperty({ description: '주소', example: '서울시 강남구 테헤란로 123' })
  address: string;
}

export class UserResponseDto {
  @ApiProperty({ description: '사용자 UUID', example: '550e8400-e29b-41d4-a716-446655440000' })
  uuid: string;

  @ApiProperty({ description: '닉네임', example: '맛집러버' })
  nickname: string;

  @ApiProperty({ description: '이메일', example: 'user@example.com' })
  email: string;
}

export class PlaceGroupItemResponseDto {
  @ApiProperty({ description: '아이템 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '맛집 정보', type: PlaceResponseDto })
  place: PlaceResponseDto;

  @ApiProperty({ description: '메모', example: '정말 맛있었어요!', required: false })
  note?: string;

  @ApiProperty({ description: '생성일', example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: '수정일', example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

export class PlaylistResponseDto {
  @ApiProperty({ description: '플레이리스트 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '플레이리스트 이름', example: '강남 맛집 투어' })
  name: string;

  @ApiProperty({ description: '플레이리스트 설명', example: '강남구 맛집들을 모은 플레이리스트', required: false })
  description?: string;

  @ApiProperty({ description: '위치 정보', type: LocationResponseDto, required: false })
  location?: LocationResponseDto;

  @ApiProperty({ description: '작성자 정보', type: UserResponseDto })
  user: UserResponseDto;

  @ApiProperty({ description: '포함된 맛집들', type: [PlaceGroupItemResponseDto] })
  items: PlaceGroupItemResponseDto[];

  @ApiProperty({ description: '생성일', example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: '수정일', example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}
