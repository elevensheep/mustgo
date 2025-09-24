import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: '사용자 UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  uuid: string;

  @ApiProperty({
    description: '사용자 이메일',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: '사용자 닉네임',
    example: '맛집러버',
  })
  nickname: string;

  @ApiProperty({
    description: '계정 생성일시',
    example: '2024-01-01T12:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '계정 수정일시',
    example: '2024-01-01T12:00:00.000Z',
  })
  updatedAt: Date;
}