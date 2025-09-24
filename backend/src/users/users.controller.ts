import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { ApiResponse as ApiResponseDto } from '../common/dto/api-response.dto';

@ApiTags('사용자 관리')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  @ApiOperation({ summary: '새 사용자 생성', description: '새로운 사용자 계정을 생성합니다' })
  @ApiResponse({ status: 201, description: '사용자 생성 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터' })
  @ApiResponse({ status: 409, description: '이미 존재하는 이메일' })
  async create(@Body() createUserDto: CreateUserDto): Promise<ApiResponseDto<UserResponseDto>> {
    const user = await this.usersService.create(createUserDto);
    const userResponse: UserResponseDto = {
      uuid: user.uuid,
      email: user.email,
      nickname: user.nickname,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    return ApiResponseDto.successWithMessage('사용자가 성공적으로 생성되었습니다', userResponse);
  }

  @Get('all')
  @ApiOperation({ summary: '모든 사용자 조회', description: '시스템에 등록된 모든 사용자 목록을 조회합니다' })
  @ApiResponse({ status: 200, description: '사용자 목록 조회 성공' })
  async findAll(): Promise<ApiResponseDto<UserResponseDto[]>> {
    const users = await this.usersService.findAll();
    const userResponses: UserResponseDto[] = users.map(user => ({
      uuid: user.uuid,
      email: user.email,
      nickname: user.nickname,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
    return ApiResponseDto.success(userResponses);
  }

  @Get(':id')
  @ApiOperation({ summary: '사용자 ID로 조회', description: 'UUID를 사용하여 특정 사용자 정보를 조회합니다' })
  @ApiParam({ name: 'id', description: '사용자 UUID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: 200, description: '사용자 조회 성공' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
  async findOne(@Param('id') id: string): Promise<ApiResponseDto<UserResponseDto>> {
    const user = await this.usersService.findOne(id);
    const userResponse: UserResponseDto = {
      uuid: user.uuid,
      email: user.email,
      nickname: user.nickname,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    return ApiResponseDto.success(userResponse);
  }

  @Patch(':id')
  @ApiOperation({ summary: '사용자 정보 수정', description: '기존 사용자의 정보를 수정합니다' })
  @ApiParam({ name: 'id', description: '사용자 UUID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: 200, description: '사용자 정보 수정 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ApiResponseDto<UserResponseDto>> {
    const user = await this.usersService.update(id, updateUserDto);
    const userResponse: UserResponseDto = {
      uuid: user.uuid,
      email: user.email,
      nickname: user.nickname,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    return ApiResponseDto.successWithMessage('사용자 정보가 성공적으로 수정되었습니다', userResponse);
  }

  @Delete(':id')
  @ApiOperation({ summary: '사용자 삭제', description: '특정 사용자 계정을 삭제합니다' })
  @ApiParam({ name: 'id', description: '사용자 UUID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: 200, description: '사용자 삭제 성공' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
  async remove(@Param('id') id: string): Promise<ApiResponseDto<null>> {
    await this.usersService.remove(id);
    return ApiResponseDto.successWithMessage('사용자가 성공적으로 삭제되었습니다', null);
  }

  @Get('check-email')
  @ApiOperation({ summary: '이메일 중복 체크', description: '이메일 주소가 이미 사용 중인지 확인합니다' })
  @ApiResponse({ status: 200, description: '이메일 중복 체크 완료' })
  async checkEmail(@Param('email') email: string): Promise<ApiResponseDto<boolean>> {
    const exists = await this.usersService.isEmailExists(email);
    return ApiResponseDto.successWithMessage(
      exists ? '이메일이 이미 사용 중입니다' : '사용 가능한 이메일입니다',
      exists,
    );
  }
}