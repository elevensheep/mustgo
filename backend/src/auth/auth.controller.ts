import { Controller, Post, Body, UseGuards, Request, Get, Query, Res, Param, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SupabaseOAuthGuard } from './guards/supabase-oauth.guard';
import { ApiResponse as ApiResponseDto } from '../common/dto/api-response.dto';
import { Response } from 'express';

@ApiTags('인증')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: '사용자 로그인', description: '이메일과 비밀번호로 로그인합니다' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'password123' },
      },
    },
  })
  @ApiResponse({ status: 200, description: '로그인 성공' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  async login(@Request() req, @Body() body: any): Promise<ApiResponseDto<any>> {
    console.log(`🔐 [AuthController] 로그인 요청 수신`);
    console.log(`📋 [AuthController] 요청 본문:`, body);
    console.log(`👤 [AuthController] req.user:`, req.user);
    
    if (!req.user) {
      console.log(`❌ [AuthController] req.user가 없습니다 - LocalStrategy 실패`);
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다');
    }
    
    const result = await this.authService.login(req.user);
    console.log(`✅ [AuthController] 로그인 성공:`, result);
    return ApiResponseDto.successWithMessage('로그인이 성공했습니다', result);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  @ApiOperation({ summary: '사용자 프로필 조회', description: 'JWT 토큰으로 사용자 프로필을 조회합니다' })
  @ApiResponse({ status: 200, description: '프로필 조회 성공' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  async getProfile(@Request() req): Promise<ApiResponseDto<any>> {
    return ApiResponseDto.success(req.user);
  }

  @Get('supabase/:provider')
  @ApiOperation({ summary: 'Supabase OAuth 로그인', description: 'Supabase를 통한 OAuth 로그인을 시작합니다' })
  @ApiParam({ name: 'provider', description: 'OAuth 제공자', enum: ['google', 'github', 'discord', 'kakao'] })
  @ApiResponse({ status: 302, description: 'OAuth 제공자로 리다이렉트' })
  async signInWithSupabase(
    @Param('provider') provider: 'google' | 'github' | 'discord' | 'kakao',
    @Res() res: Response,
  ) {
    console.log(`🔐 [OAuth] ${provider} 로그인 요청 시작`);
    
    try {
      // 1. Supabase OAuth URL 생성 요청
      console.log(`📡 [OAuth] Supabase 서비스에 ${provider} OAuth URL 요청 중...`);
      const { url } = await this.authService.signInWithSupabase(provider);
      
      console.log(`✅ [OAuth] ${provider} OAuth URL 생성 성공:`, url);
      console.log(`🔄 [OAuth] 사용자를 ${provider} OAuth 페이지로 리다이렉트 중...`);
      
      // 2. 사용자를 OAuth 제공자 페이지로 리다이렉트
      return res.redirect(url);
    } catch (error) {
      console.error(`❌ [OAuth] ${provider} 로그인 시작 실패:`, error.message);
      return res.status(400).json(ApiResponseDto.error('OAuth 로그인 시작에 실패했습니다'));
    }
  }

  @Get('supabase/callback')
  @UseGuards(SupabaseOAuthGuard)
  @ApiOperation({ summary: 'Supabase OAuth 콜백', description: 'OAuth 인증 후 콜백을 처리합니다' })
  @ApiResponse({ status: 200, description: 'OAuth 로그인 성공' })
  @ApiResponse({ status: 401, description: 'OAuth 인증 실패' })
  async supabaseCallback(@Request() req, @Res() res: Response) {
    console.log(`🔄 [OAuth Callback] OAuth 콜백 요청 수신`);
    console.log(`📋 [OAuth Callback] 요청 데이터:`, {
      query: req.query,
      user: req.user ? '사용자 정보 있음' : '사용자 정보 없음'
    });
    
    try {
      // 1. OAuth 인증된 사용자 정보 확인
      console.log(`👤 [OAuth Callback] 인증된 사용자 정보:`, req.user);
      
      // 2. JWT 토큰 생성
      console.log(`🔑 [OAuth Callback] JWT 토큰 생성 중...`);
      const result = await this.authService.login(req.user);
      
      console.log(`✅ [OAuth Callback] JWT 토큰 생성 성공`);
      console.log(`🔄 [OAuth Callback] 프론트엔드로 리다이렉트 중: ${process.env.FRONTEND_URL}/auth/success`);
      
      // 3. 프론트엔드로 리다이렉트 (토큰 포함)
      return res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${result.access_token}`);
    } catch (error) {
      console.error(`❌ [OAuth Callback] 콜백 처리 실패:`, error.message);
      console.log(`🔄 [OAuth Callback] 에러 페이지로 리다이렉트 중: ${process.env.FRONTEND_URL}/auth/error`);
      
      return res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=${encodeURIComponent(error.message)}`);
    }
  }

  @Post('supabase/verify')
  @ApiOperation({ summary: 'Supabase 토큰 검증', description: 'Supabase 토큰을 검증하고 JWT 토큰을 반환합니다' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string', description: 'Supabase access token' },
      },
    },
  })
  @ApiResponse({ status: 200, description: '토큰 검증 성공' })
  @ApiResponse({ status: 401, description: '토큰 검증 실패' })
  async verifySupabaseToken(@Body() body: { accessToken: string }): Promise<ApiResponseDto<any>> {
    try {
      console.log('🔍 [AuthController] Supabase 토큰 검증 요청');
      const userInfo = await this.authService.getSupabaseUserInfo(body.accessToken);
      const result = await this.authService.login(userInfo);
      return ApiResponseDto.successWithMessage('토큰 검증이 성공했습니다', result);
    } catch (error) {
      console.error('❌ [AuthController] Supabase 토큰 검증 실패:', error.message);
      return ApiResponseDto.error('토큰 검증에 실패했습니다');
    }
  }

  @Post('supabase/signout')
  @ApiOperation({ summary: 'Supabase 로그아웃', description: 'Supabase에서 로그아웃합니다' })
  @ApiResponse({ status: 200, description: '로그아웃 성공' })
  async signOutFromSupabase(@Body() body: { accessToken: string }): Promise<ApiResponseDto<any>> {
    try {
      const result = await this.authService.signOutFromSupabase(body.accessToken);
      return ApiResponseDto.successWithMessage('Supabase에서 성공적으로 로그아웃했습니다', result);
    } catch (error) {
      return ApiResponseDto.error('Supabase 로그아웃에 실패했습니다');
    }
  }
}