# 🔌 API 요구사항 명세서

> 니맛내맛 프론트엔드에 맞추기 위해 백엔드에서 구현해야 할 API 목록

## 📋 목차

- [🚨 필수 API (최우선)](#-필수-api-최우선)
- [⚡ 성능 최적화 API](#-성능-최적화-api)
- [🔍 검색 및 필터링 API](#-검색-및-필터링-api)
- [🛠️ CRUD 완성 API](#️-crud-완성-api)
- [📝 댓글 시스템 API](#-댓글-시스템-api)
- [🎯 우선순위별 구현 가이드](#-우선순위별-구현-가이드)

---

## 🚨 필수 API (최우선)

### 1. 챗봇/RAG API
**파일**: `ChatPage.tsx`  
**현재 상태**: TODO로 표시됨

```typescript
POST /api/chat/message
Content-Type: application/json
Authorization: Bearer {token}

Request Body:
{
  "message": string,
  "context"?: string
}

Response:
{
  "success": boolean,
  "message": string,
  "data": {
    "message": string,
    "suggestions"?: string[],
    "places"?: Place[]
  }
}
```

### 2. 맛집 상세 조회 API
**파일**: `PlaceDetailPage.tsx`  
**현재 상태**: 구현되지 않음

```typescript
GET /api/places/{id}
Authorization: Bearer {token}

Response:
{
  "success": boolean,
  "data": {
    "id": number,
    "placeId": string,
    "placeName": string,
    "description": string,
    "imageUrl": string,
    "latitude": number,
    "longitude": number,
    "createdAt": string,
    "updatedAt": string,
    "comments": Comment[],
    "rating": number,
    "reviewCount": number
  }
}
```

### 3. 플레이리스트-맛집 관계 API
**파일**: `PlaylistsService.tsx`  
**현재 상태**: TODO로 표시됨

```typescript
// 플레이리스트에 맛집 추가
POST /api/place-groups/{id}/places
Authorization: Bearer {token}
{
  "placeId": string
}

// 플레이리스트에서 맛집 제거
DELETE /api/place-groups/{id}/places/{placeId}
Authorization: Bearer {token}

// 플레이리스트의 맛집 목록 조회
GET /api/place-groups/{id}/places
Authorization: Bearer {token}

Response:
{
  "success": boolean,
  "data": Place[]
}
```

---

## ⚡ 성능 최적화 API

### 4. 인기 맛집 API
**파일**: `PlacesService.tsx`  
**현재 상태**: 클라이언트 사이드 임시 구현

```typescript
GET /api/places/popular?limit=10
Authorization: Bearer {token}

Response:
{
  "success": boolean,
  "data": Place[]
}
```

### 5. 인기 플레이리스트 API
**파일**: `PlaylistsService.tsx`  
**현재 상태**: 클라이언트 사이드 임시 구현

```typescript
GET /api/place-groups/popular?limit=10
Authorization: Bearer {token}

Response:
{
  "success": boolean,
  "data": PlaceGroup[]
}
```

### 6. 사용자별 플레이리스트 API
**파일**: `PlaylistsService.tsx`  
**현재 상태**: 클라이언트 사이드 필터링

```typescript
GET /api/place-groups/user/{userId}
Authorization: Bearer {token}

Response:
{
  "success": boolean,
  "data": PlaceGroup[]
}
```

### 7. 최근 추가된 맛집 API
**파일**: `PlacesService.tsx`  
**현재 상태**: 클라이언트 사이드 정렬

```typescript
GET /api/places/recent?limit=10
Authorization: Bearer {token}

Response:
{
  "success": boolean,
  "data": Place[]
}
```

### 8. 최근 생성된 플레이리스트 API
**파일**: `PlaylistsService.tsx`  
**현재 상태**: 클라이언트 사이드 정렬

```typescript
GET /api/place-groups/recent?limit=10
Authorization: Bearer {token}

Response:
{
  "success": boolean,
  "data": PlaceGroup[]
}
```

---

## 🔍 검색 및 필터링 API

### 9. 고급 맛집 검색 API
**파일**: `PlacesPage.tsx`  
**현재 상태**: 클라이언트 사이드 필터링

```typescript
GET /api/places/search?q={query}&region={region}&category={category}&sort={sort}&page={page}&limit={limit}
Authorization: Bearer {token}

Query Parameters:
- q: string (검색어)
- region: string (지역)
- category: string (카테고리)
- sort: 'recent' | 'popular' | 'rating' | 'name'
- page: number (페이지 번호)
- limit: number (페이지당 항목 수)

Response:
{
  "success": boolean,
  "data": {
    "places": Place[],
    "total": number,
    "page": number,
    "limit": number,
    "totalPages": number
  }
}
```

### 10. 고급 플레이리스트 검색 API
**파일**: `PlaylistsPage.tsx`  
**현재 상태**: 클라이언트 사이드 필터링

```typescript
GET /api/place-groups/search?q={query}&theme={theme}&region={region}&sort={sort}&page={page}&limit={limit}
Authorization: Bearer {token}

Query Parameters:
- q: string (검색어)
- theme: string (테마)
- region: string (지역)
- sort: 'recent' | 'popular' | 'name'
- page: number (페이지 번호)
- limit: number (페이지당 항목 수)

Response:
{
  "success": boolean,
  "data": {
    "playlists": PlaceGroup[],
    "total": number,
    "page": number,
    "limit": number,
    "totalPages": number
  }
}
```

### 11. 필터 옵션 목록 API
**파일**: `FilterPanel.tsx`  
**현재 상태**: 하드코딩된 옵션

```typescript
// 지역 목록
GET /api/places/regions
Authorization: Bearer {token}

// 카테고리 목록
GET /api/places/categories
Authorization: Bearer {token}

// 테마 목록
GET /api/place-groups/themes
Authorization: Bearer {token}

Response:
{
  "success": boolean,
  "data": string[]
}
```

---

## 🛠️ CRUD 완성 API

### 12. 맛집 수정 API
**파일**: `PlacesService.tsx`  
**현재 상태**: 정의됨, 구현 필요

```typescript
PATCH /api/places/{id}
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "placeName"?: string,
  "description"?: string,
  "imageUrl"?: string,
  "latitude"?: number,
  "longitude"?: number
}

Response:
{
  "success": boolean,
  "data": Place
}
```

### 13. 맛집 삭제 API
**파일**: `PlacesService.tsx`  
**현재 상태**: 정의됨, 구현 필요

```typescript
DELETE /api/places/{id}
Authorization: Bearer {token}

Response:
{
  "success": boolean,
  "message": string
}
```

### 14. 플레이리스트 수정 API
**파일**: `PlaylistsService.tsx`  
**현재 상태**: 정의됨, 구현 필요

```typescript
PATCH /api/place-groups/{id}
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "name"?: string,
  "description"?: string
}

Response:
{
  "success": boolean,
  "data": PlaceGroup
}
```

### 15. 플레이리스트 삭제 API
**파일**: `PlaylistsService.tsx`  
**현재 상태**: 정의됨, 구현 필요

```typescript
DELETE /api/place-groups/{id}
Authorization: Bearer {token}

Response:
{
  "success": boolean,
  "message": string
}
```

---

## 📝 댓글 시스템 API

### 16. 댓글 CRUD API
**파일**: `constants/index.ts`  
**현재 상태**: 엔드포인트만 정의됨

```typescript
// 댓글 생성
POST /api/comments/create
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "content": string,
  "placeId"?: number,
  "placeGroupId"?: number
}

// 맛집 댓글 조회
GET /api/comments/place/{placeId}
Authorization: Bearer {token}

// 플레이리스트 댓글 조회
GET /api/comments/group/{groupId}
Authorization: Bearer {token}

// 댓글 수정
PATCH /api/comments/{id}
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "content": string
}

// 댓글 삭제
DELETE /api/comments/{id}
Authorization: Bearer {token}

Response:
{
  "success": boolean,
  "data": Comment | Comment[]
}
```

---

## 🎯 우선순위별 구현 가이드

### 🔥 **1단계: 핵심 기능 (필수)**
- [ ] **챗봇/RAG API** - 서비스의 핵심 차별화 기능
- [ ] **맛집 상세 조회 API** - PlaceDetailPage 동작
- [ ] **플레이리스트-맛집 관계 API** - 플레이리스트 기능 완성

**예상 개발 시간**: 2-3주  
**영향도**: 높음 (핵심 기능)

### ⚡ **2단계: 성능 최적화**
- [ ] **인기 맛집/플레이리스트 API** - 홈페이지 성능 개선
- [ ] **사용자별 플레이리스트 API** - 개인화 기능
- [ ] **최근 추가된 항목 API** - 실시간성 향상

**예상 개발 시간**: 1-2주  
**영향도**: 중간 (성능 개선)

### 🔍 **3단계: 검색 및 필터링**
- [ ] **고급 검색 API** - 검색 성능 개선
- [ ] **필터 옵션 목록 API** - 동적 필터링
- [ ] **페이지네이션** - 대용량 데이터 처리

**예상 개발 시간**: 2-3주  
**영향도**: 중간 (사용자 경험)

### 🛠️ **4단계: CRUD 완성**
- [ ] **맛집 수정/삭제 API** - 관리 기능
- [ ] **플레이리스트 수정/삭제 API** - 관리 기능
- [ ] **권한 검증** - 보안 강화

**예상 개발 시간**: 1-2주  
**영향도**: 낮음 (관리 기능)

### 📝 **5단계: 댓글 시스템**
- [ ] **댓글 CRUD API** - 커뮤니티 기능
- [ ] **댓글 알림** - 실시간 알림
- [ ] **댓글 신고** - 콘텐츠 관리

**예상 개발 시간**: 1-2주  
**영향도**: 낮음 (부가 기능)

---

## 📊 구현 현황 체크리스트

### ✅ **이미 구현됨**
- [x] 사용자 인증 API (로그인, 회원가입, OAuth)
- [x] 기본 맛집 CRUD API (생성, 조회)
- [x] 기본 플레이리스트 CRUD API (생성, 조회)
- [x] 사용자 관리 API

### 🚧 **구현 필요**
- [ ] 챗봇/RAG API
- [ ] 맛집 상세 조회 API
- [ ] 플레이리스트-맛집 관계 API
- [ ] 인기 항목 API
- [ ] 고급 검색 API
- [ ] 댓글 시스템 API
- [ ] 필터 옵션 API

---

## 🔗 관련 파일들

### 프론트엔드 파일
- `src/pages/ChatPage.tsx` - 챗봇 페이지
- `src/pages/PlaceDetailPage.tsx` - 맛집 상세 페이지
- `src/services/places.service.ts` - 맛집 서비스
- `src/services/playlists.service.ts` - 플레이리스트 서비스
- `src/pages/PlacesPage.tsx` - 맛집 목록 페이지
- `src/pages/PlaylistsPage.tsx` - 플레이리스트 목록 페이지
- `src/components/common/FilterPanel.tsx` - 필터 패널

### 백엔드 구현 필요
- `src/chat/` - 챗봇 모듈
- `src/places/` - 맛집 모듈 (상세 조회, 수정, 삭제)
- `src/place-groups/` - 플레이리스트 모듈 (관계, 수정, 삭제)
- `src/comments/` - 댓글 모듈

---

## 📞 문의사항

API 구현 관련 문의사항이 있으시면:
- **이슈 등록**: GitHub Issues
- **문서 참조**: 백엔드 API 문서
- **개발팀 연락**: backend@nimatnaemat.com

---

*마지막 업데이트: 2024년 12월*
