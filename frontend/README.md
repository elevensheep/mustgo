# 니맛내맛 Frontend

'니맛내맛' 서비스의 프론트엔드 애플리케이션입니다. React 19, TypeScript, Vite를 기반으로 구축되었습니다.

## 🚀 주요 기능

- **AI 맛집 추천**: RAG 기반 챗봇으로 자연어 질의에 맞는 맛집 추천
- **플레이리스트 관리**: 상황·감정·테마별 맛집 플레이리스트 생성 및 공유
- **맛집 탐색**: 다양한 맛집 검색 및 상세 정보 조회
- **카카오 지도 연동**: 실시간 음식점 검색 및 위치 기반 플레이리스트 생성
- **인증 시스템**: 이메일/비밀번호 및 OAuth 로그인 지원
- **반응형 디자인**: 모바일과 데스크톱 모두 지원

## 🛠️ 기술 스택

- **Frontend**: React 19, TypeScript, Vite
- **상태 관리**: Zustand
- **라우팅**: React Router
- **스타일링**: Tailwind CSS
- **HTTP 클라이언트**: Axios
- **폼 관리**: React Hook Form
- **서버 상태**: React Query
- **아이콘**: Lucide React

## 📦 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000

# 카카오 지도 API (필수)
VITE_KAKAO_MAP_API_KEY=your_kakao_map_api_key_here

# OAuth Configuration (선택사항)
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GITHUB_CLIENT_ID=your_github_client_id
```

#### 카카오 지도 API 키 발급 방법

1. [카카오 개발자 콘솔](https://developers.kakao.com/)에 접속
2. 애플리케이션 생성 또는 기존 애플리케이션 선택
3. 플랫폼 설정에서 Web 플랫폼 추가
4. 사이트 도메인 등록 (개발: `http://localhost:5173`, 프로덕션: 실제 도메인)
5. JavaScript 키 복사하여 `VITE_KAKAO_MAP_API_KEY`에 설정

### 3. 개발 서버 실행

```bash
npm run dev
```

개발 서버가 실행되면 `http://localhost:5173`에서 애플리케이션을 확인할 수 있습니다.

## 🛠️ 개발 도구

### 코드 품질 관리

```bash
# 린팅
npm run lint          # ESLint 실행
npm run lint:fix      # ESLint 자동 수정

# 코드 포맷팅
npm run format        # Prettier로 코드 포맷팅
npm run format:check  # 포맷팅 검사

# 타입 체크
npm run type-check    # TypeScript 타입 검사
```

### 테스트

```bash
# 테스트 실행
npm run test          # 단위 테스트 실행
npm run test:ui       # 테스트 UI 실행
npm run test:coverage # 커버리지 포함 테스트
```

### 빌드

```bash
# 프로덕션 빌드
npm run build         # 프로덕션 빌드
npm run build:analyze # 번들 분석 포함 빌드
npm run preview       # 빌드 결과 미리보기
```

### 유틸리티

```bash
# 캐시 정리
npm run clean         # 빌드 캐시 및 node_modules 정리
```

## 🏗️ 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── ui/             # 기본 UI 컴포넌트 (Button, Input, Card 등)
│   ├── layout/         # 레이아웃 컴포넌트 (Header, Footer)
│   └── common/         # 공통 컴포넌트
├── pages/              # 페이지 컴포넌트
│   ├── auth/           # 인증 관련 페이지
│   ├── PlacesPage.tsx  # 맛집 목록 페이지
│   ├── PlaylistsPage.tsx # 플레이리스트 목록 페이지
│   └── ChatPage.tsx    # AI 챗봇 페이지
├── hooks/              # 커스텀 훅
├── services/           # API 서비스
├── stores/             # Zustand 상태 관리
├── types/              # TypeScript 타입 정의
├── utils/              # 유틸리티 함수
└── constants/          # 상수 정의
```

## 🔧 주요 기능 설명

### 인증 시스템
- 이메일/비밀번호 로그인
- OAuth 로그인 (Google, GitHub, Discord, Kakao)
- JWT 토큰 기반 인증
- 자동 토큰 갱신

### 맛집 관리
- 맛집 목록 조회 및 검색
- 맛집 상세 정보 보기
- 맛집 등록 및 수정
- 위치 정보 표시

### 플레이리스트 관리
- 플레이리스트 생성 및 편집
- 카카오 지도를 통한 위치 기반 플레이리스트 생성
- 실시간 음식점 검색 및 추가
- 맛집을 플레이리스트에 추가/제거
- 플레이리스트 공유
- 테마별 분류

### AI 챗봇
- 자연어 질의 처리
- 상황별 맛집 추천
- 대화형 인터페이스
- 예시 질문 제공

## 🎨 UI/UX 특징

- **모던한 디자인**: 깔끔하고 직관적인 인터페이스
- **반응형 레이아웃**: 모든 디바이스에서 최적화된 경험
- **다크/라이트 모드**: 사용자 선호도에 따른 테마 지원
- **접근성**: 키보드 네비게이션 및 스크린 리더 지원

## 🔗 API 연동

백엔드 API와의 연동을 위해 다음 엔드포인트를 사용합니다:

- **인증**: `/api/auth/*`
- **사용자**: `/api/users/*`
- **맛집**: `/api/places/*`
- **플레이리스트**: `/api/place-groups/*`
- **댓글**: `/api/comments/*`

## 📱 반응형 디자인

- **모바일**: 320px 이상
- **태블릿**: 768px 이상
- **데스크톱**: 1024px 이상
- **대형 화면**: 1280px 이상

## 🚀 배포

### 빌드

```bash
npm run build
```

### 프리뷰

```bash
npm run preview
```

## 🔧 개발 환경 설정

### Git Hooks 설정

```bash
# Husky 설치 (자동으로 실행됨)
npm run prepare

# 또는 수동으로 설치
npx husky install
```

### IDE 설정

#### VS Code 권장 확장 프로그램

- **ES7+ React/Redux/React-Native snippets**
- **TypeScript Importer**
- **Tailwind CSS IntelliSense**
- **Prettier - Code formatter**
- **ESLint**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**

#### VS Code 설정 (`.vscode/settings.json`)

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "tailwindCSS.includeLanguages": {
    "typescript": "typescript",
    "typescriptreact": "typescriptreact"
  }
}
```

## 📊 성능 최적화

### 번들 분석

```bash
npm run build:analyze
```

### 성능 모니터링

- **React DevTools Profiler** 사용
- **Lighthouse** 성능 측정
- **Bundle Analyzer**로 번들 크기 최적화

### 최적화 기법

- **React.memo**로 불필요한 리렌더링 방지
- **useMemo/useCallback**로 계산 최적화
- **Lazy Loading**으로 코드 스플리팅
- **이미지 최적화** 및 지연 로딩

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.