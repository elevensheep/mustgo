# MustGo - 맛집 커뮤니티

맛집을 공유하고 리뷰를 남기는 커뮤니티 플랫폼입니다.

## 🏗 프로젝트 구조

```
mustgo/
├── backend/          # NestJS 백엔드 API
│   ├── src/
│   ├── package.json
│   └── README.md
├── frontend/         # React/Next.js 프론트엔드
│   ├── src/
│   ├── package.json
│   └── README.md
└── README.md         # 이 파일
```

## 🚀 빠른 시작

### 1. 백엔드 실행

```bash
cd backend
npm install
npm run start:dev
```

백엔드는 `http://localhost:8000`에서 실행됩니다.

### 2. 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev
```

프론트엔드는 `http://localhost:3000`에서 실행됩니다.

## 🛠 기술 스택

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL (Supabase)
- **ORM**: TypeORM
- **Authentication**: JWT + Passport.js + Supabase OAuth
- **Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: React / Next.js / Vue.js / Angular (선택)
- **Styling**: Tailwind CSS / Styled Components
- **State Management**: Redux / Zustand / Context API
- **HTTP Client**: Axios / Fetch API

## 📚 문서

- [Backend API 문서](./backend/README.md)
- [Frontend 문서](./frontend/README.md)
- [API 문서](http://localhost:8000/api-docs) (백엔드 실행 후)

## 🔐 인증

Supabase OAuth를 통한 소셜 로그인을 지원합니다:

- Google
- GitHub
- Discord
- Kakao

## 🚀 배포

### 개발 환경
```bash
# 백엔드
cd backend && npm run start:dev

# 프론트엔드
cd frontend && npm run dev
```

### 프로덕션 환경
```bash
# 백엔드
cd backend && npm run build && npm run start:prod

# 프론트엔드
cd frontend && npm run build && npm run start
```

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.
