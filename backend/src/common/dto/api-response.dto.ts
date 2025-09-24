import { ApiProperty } from '@nestjs/swagger';

export class ApiResponse<T> {
  @ApiProperty({ description: '응답 성공 여부', example: true })
  success: boolean;

  @ApiProperty({ description: '응답 메시지', example: '요청이 성공적으로 처리되었습니다' })
  message: string;

  @ApiProperty({ description: '응답 데이터' })
  data?: T;

  @ApiProperty({ description: '에러 코드', example: 'USER_NOT_FOUND', required: false })
  errorCode?: string;

  constructor(success: boolean, message: string, data?: T, errorCode?: string) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.errorCode = errorCode;
  }

  static success<T>(data?: T): ApiResponse<T> {
    return new ApiResponse<T>(true, '요청이 성공적으로 처리되었습니다', data);
  }

  static successWithMessage<T>(message: string, data?: T): ApiResponse<T> {
    return new ApiResponse<T>(true, message, data);
  }

  static error<T>(message: string, errorCode?: string): ApiResponse<T> {
    return new ApiResponse<T>(false, message, undefined, errorCode);
  }
}