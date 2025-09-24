import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: '사용자 이메일',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다' })
  @IsNotEmpty({ message: '이메일은 필수입니다' })
  email: string;

  @ApiProperty({
    description: '사용자 비밀번호',
    example: 'password123',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty({ message: '비밀번호는 필수입니다' })
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다' })
  password: string;

  @ApiProperty({
    description: '사용자 닉네임',
    example: '맛집러버',
    minLength: 2,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty({ message: '닉네임은 필수입니다' })
  @MinLength(2, { message: '닉네임은 최소 2자 이상이어야 합니다' })
  @MaxLength(20, { message: '닉네임은 최대 20자까지 가능합니다' })
  nickname: string;
}