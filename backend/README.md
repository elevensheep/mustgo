# MustGo Backend - 맛집 커뮤니티 API

NestJS로 구현된 맛집 커뮤니티 백엔드 API입니다. Supabase OAuth를 통한 소셜 로그인과 JWT 기반 인증을 지원합니다.

> **참고**: 이 프로젝트는 `mustgo/backend/` 폴더에 위치합니다.

## 🚀 주요 기능

- **사용자 관리**: 회원가입, 로그인, 프로필 관리
- **맛집 관리**: 맛집 등록, 조회, 검색
- **댓글 시스템**: 맛집에 대한 댓글 작성 및 조회
- **맛집 그룹**: 맛집을 그룹으로 관리
- **소셜 로그인**: Supabase OAuth (Google, GitHub, Discord, Kakao)
- **인증/보안**: JWT 기반 인증 시스템 + Passport.js

## 🛠 기술 스택

- **Framework**: NestJS
- **Database**: PostgreSQL (Supabase)
- **ORM**: TypeORM
- **Authentication**: JWT + Passport.js + Supabase OAuth
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator
- **Node.js**: 18+ (Headers API 지원)

## ⚠️ 요구사항

- **Node.js**: 18.0.0 이상 (Headers API 지원)
- **npm**: 8.0.0 이상
- **PostgreSQL**: Supabase 계정 필요
- **Supabase**: OAuth 제공자 설정 필요

## 📦 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 설정하세요:

```env
# Database Configuration
DATABASE_URL=postgresql://your-database-username:your-database-password@your-project.pooler.supabase.com:6543/postgres
DATABASE_HOST=your-project.pooler.supabase.com
DATABASE_PORT=6543
DATABASE_USERNAME=your-database-username
DATABASE_PASSWORD=your-database-password
DATABASE_NAME=postgres

# Supabase Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-key-here
SUPABASE_PROJECT_REF=your-project-ref

# Supabase OAuth Configuration
SUPABASE_OAUTH_CLIENT_ID=your-oauth-client-id
SUPABASE_OAUTH_CLIENT_SECRET=your-oauth-client-secret
SUPABASE_OAUTH_CALLBACK_URL=http://localhost:3000/auth/callback
FRONTEND_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=your-jwt-secret-key-here-make-it-very-long-and-secure
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=8000
NODE_ENV=development
```

### 3. Supabase OAuth 설정

Supabase 대시보드에서 OAuth 설정을 완료하세요:

1. **Authentication** → **URL Configuration**
2. **Redirect URLs**에 `http://localhost:3000/auth/callback` 추가
3. **Site URL**을 `http://localhost:3000`으로 설정
4. **OAuth Providers**에서 Google, GitHub, Discord, Kakao 활성화

### 4. 애플리케이션 실행

```bash
# 개발 모드
npm run start:dev

# 프로덕션 모드
npm run build
npm run start:prod
```

## 📚 API 문서

애플리케이션 실행 후 다음 URL에서 Swagger 문서를 확인할 수 있습니다:

- **Swagger UI**: http://localhost:8000/api-docs

## 🗂 프로젝트 구조

```
src/
├── auth/                 # 인증 관련
│   ├── guards/          # 인증 가드
│   ├── strategies/      # Passport 전략
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── supabase.service.ts
│   └── auth.module.ts
├── users/               # 사용자 관리
│   ├── dto/            # 데이터 전송 객체
│   ├── entities/       # 엔티티
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── places/              # 맛집 관리
│   ├── dto/
│   ├── entities/
│   ├── places.controller.ts
│   ├── places.service.ts
│   └── places.module.ts
├── comments/            # 댓글 관리
│   ├── entities/
│   ├── comments.controller.ts
│   ├── comments.service.ts
│   └── comments.module.ts
├── place-groups/        # 맛집 그룹 관리
│   ├── entities/
│   ├── place-groups.controller.ts
│   ├── place-groups.service.ts
│   └── place-groups.module.ts
├── common/              # 공통 모듈
│   └── dto/
│       └── api-response.dto.ts
├── types/               # TypeScript 타입 정의
│   └── passport-custom.d.ts
├── app.module.ts        # 루트 모듈
└── main.ts             # 애플리케이션 진입점
```

## 🔧 API 엔드포인트

### 사용자 관리
- `POST /api/users/create` - 사용자 생성
- `GET /api/users/all` - 모든 사용자 조회
- `GET /api/users/:id` - 사용자 조회
- `PATCH /api/users/:id` - 사용자 정보 수정
- `DELETE /api/users/:id` - 사용자 삭제
- `GET /api/users/check-email` - 이메일 중복 체크

### 맛집 관리
- `POST /api/places/create` - 맛집 생성
- `GET /api/places/all` - 모든 맛집 조회
- `GET /api/places/:placeName` - 맛집 이름으로 검색

### 댓글 관리
- `GET /api/comments/:placeId` - 맛집 댓글 조회

### 인증
- `POST /api/auth/login` - 로그인
- `GET /api/auth/profile` - 프로필 조회
- `GET /api/auth/supabase/:provider` - Supabase OAuth 로그인 (Google, GitHub, Discord, Kakao)
- `GET /api/auth/supabase/callback` - OAuth 콜백 처리
- `POST /api/auth/supabase/signout` - Supabase 로그아웃

### 맛집 그룹 관리
- `POST /api/place-groups/create` - 맛집 그룹 생성
- `GET /api/place-groups/all` - 모든 맛집 그룹 조회
- `GET /api/place-groups/:id` - 맛집 그룹 조회
- `PATCH /api/place-groups/:id` - 맛집 그룹 수정
- `DELETE /api/place-groups/:id` - 맛집 그룹 삭제
- `POST /api/place-groups/:id/add-place` - 맛집 그룹에 맛집 추가

## 🧪 테스트

```bash
# 단위 테스트
npm run test

# e2e 테스트
npm run test:e2e

# 테스트 커버리지
npm run test:cov
```

## 🔐 OAuth 테스트

### OAuth 로그인 테스트
```bash
# Kakao OAuth 로그인
curl -X 'GET' 'http://localhost:8000/api/auth/supabase/kakao'

# Google OAuth 로그인
curl -X 'GET' 'http://localhost:8000/api/auth/supabase/google'

# GitHub OAuth 로그인
curl -X 'GET' 'http://localhost:8000/api/auth/supabase/github'

# Discord OAuth 로그인
curl -X 'GET' 'http://localhost:8000/api/auth/supabase/discord'
```

### OAuth 콜백 테스트
```bash
# OAuth 콜백 (access_token 포함)
curl -X 'GET' 'http://localhost:8000/api/auth/supabase/callback?access_token=your-access-token'
```

## 📊 로그 모니터링

개발 모드에서 OAuth 처리 과정을 실시간으로 확인할 수 있습니다:

- **OAuth 시작**: ` [OAuth] {provider} 로그인 요청 시작`
- **URL 생성**: `✅ [OAuth] {provider} OAuth URL 생성 성공`
- **콜백 처리**: `🔄 [OAuth Callback] OAuth 콜백 요청 수신`
- **사용자 인증**: `✅ [OAuth Strategy] 사용자 인증 성공`
- **JWT 생성**: `✅ [OAuth Callback] JWT 토큰 생성 성공`

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.
