# 레시피 톡톡 - Frontend

## 📖 프로젝트 개요

**서비스명**: 레시피 톡톡: 레시피 및 식재료 활용 챗봇

사용자가 보유한 식재료를 기반으로 맞춤형 레시피를 추천하고, 영양 정보를 제공하는 대화형 AI 챗봇의 프론트엔드 애플리케이션입니다. Vue.js 기반의 반응형 웹 인터페이스를 통해 직관적이고 편리한 사용자 경험을 제공합니다.

### 배포된 서버
- [vercel.app 서버](https://front-repo-three.vercel.app/)

### 🎯 타겟 사용자
- 1인 가구, 자취생, 주부
- 건강 및 식단 관리에 관심이 많은 사용자
- 보유한 식재료를 효율적으로 활용하고자 하는 사용자

## 🛠 기술 스택

### Frontend Core
- **Vue.js 3.4.27**: 반응형 컴포넌트 기반 프레임워크
- **Parcel.js 2.15.4**: 빠른 번들링 및 개발 서버
- **Pinia 3.0.3**: Vue 3 전용 상태 관리 라이브러리
- **Web Speech API**: 브라우저 내장 음성 인식 기능

### 배포 & 인프라
- **컨테이너화**: Docker (멀티스테이지 빌드)
- **웹서버**: Nginx (정적 파일 서빙 + 리버스 프록시)
- **클라우드**: Vercel (개발), AWS EC2 (프로덕션)
- **보안**: 보안 헤더, CORS 설정

### 성능 최적화
- **빌드 최적화**: Parcel 번들링, Gzip 압축
- **캐싱**: 정적 자원 브라우저 캐싱 (1년)
- **이미지 최적화**: Alpine 기반 경량 컨테이너

## ✨ 주요 기능

### 사용자 인터페이스
- 💬 **실시간 채팅 UI**: 카카오톡 스타일의 직관적인 메시지 인터페이스
- 📱 **모바일 최적화**: 393px 너비의 스마트폰 친화적 반응형 디자인
- 🎨 **테마 디자인**: 깔끔한 색상 팔레트 (#4ED7F1 주요 컬러)

### 인터랙션 기능
- 🎙️ **음성 입력**: Web Speech API를 활용한 한국어 음성 인식
- ⌨️ **텍스트 입력**: 실시간 타이핑 및 엔터키 전송 지원
- 🔘 **버튼 인터랙션**: 옵션 버튼을 통한 간편한 기능 선택

### 콘텐츠 표시
- 📋 **레시피 카드**: 재료, 조리과정을 구조화된 카드 형태로 표시
- 📊 **영양 정보 카드**: 칼로리, 영양소 정보를 시각적으로 정리
- 🍽️ **추천 목록**: 페이지네이션을 통한 효율적인 추천 요리 표시
- ⚡ **로딩 상태**: 스피너 애니메이션으로 응답 대기 시간 표시

### 상태 관리
- 💾 **메시지 히스토리**: 대화 내용 실시간 저장 및 스크롤 자동 이동
- 🔄 **컨텍스트 유지**: 이전 요리 정보 기억 및 관련 기능 제공
- 📑 **추천 페이지네이션**: 대량 추천 목록의 효율적 표시

## 🏗 컴포넌트 구조

### Vue 컴포넌트 아키텍처

- **App.vue**: 메인 애플리케이션 컨테이너 (393px 고정 너비)
- **AppHeader.vue**: 상단 헤더 ('레시피 톡톡' 타이틀)
- **ChatView.vue**: 메시지 표시 영역 (자동 스크롤, 커스텀 스크롤바)
- **MessageBubble.vue**: 개별 메시지 렌더링 (7가지 메시지 타입 지원)
- **MessageInput.vue**: 사용자 입력 인터페이스 (텍스트 + 음성)

### 상태 관리 (Pinia Store)

```javascript
// chat.js - 주요 상태
- messages: 대화 메시지 배열
- lastRecipeTitle: 마지막 조회한 레시피명
- allRecommendations: 전체 추천 목록
- currentRecommendationIndex: 현재 페이지 인덱스
- isLoading: 로딩 상태
```

## 📁 프로젝트 구조

```
front_repo/
├── README.md
├── docs/
│   └── 보고서.txt          # 프로젝트 문서
└── vue-parcel-app/         # Vue.js 프론트엔드 애플리케이션
    ├── index.html          # 메인 HTML 파일
    ├── package.json        # 의존성 및 스크립트 정의
    ├── src/
    │   ├── App.vue         # 루트 컴포넌트 (레이아웃 설정)
    │   ├── main.js         # Vue 앱 초기화 및 마운트
    │   ├── components/     # 재사용 가능한 Vue 컴포넌트
    │   │   ├── AppHeader.vue      # 헤더 (레시피 톡톡 타이틀)
    │   │   ├── ChatView.vue       # 채팅 메시지 영역
    │   │   ├── MessageBubble.vue  # 개별 메시지 렌더링
    │   │   └── MessageInput.vue   # 입력 폼 (텍스트 + 음성)
    │   ├── stores/         # Pinia 상태 관리
    │   │   └── chat.js     # 채팅 관련 전역 상태
    │   └── assets/         # 정적 리소스
    │       ├── chatbot.png         # 봇 아바타 이미지
    │       ├── user.png            # 사용자 아바타 이미지
    │       └── ...
    └── ...
```

## 🚀 설치 및 실행

### 전제 조건
- **Node.js**: 14.0 이상 (권장: 18.0+)
- **npm**: Node.js와 함께 설치됨
- **Modern Browser**: Chrome, Firefox, Safari (Web Speech API 지원)
- **Docker**: 컨테이너 배포 시 필요

### 1. 개발 환경 설정

```bash
# 1. 프로젝트 클론
git clone [repository-url]
cd front_repo

# 2. 의존성 설치
cd vue-parcel-app
npm install

# 3. 환경변수 설정 (선택사항)
# .env 파일 생성하여 백엔드 API URL 설정
echo "VUE_APP_API_URL=http://127.0.0.1:8000/ask" > .env

# 4. 개발 서버 실행
npm run dev
# → http://localhost:1234 에서 확인

# 5. 프로덕션 빌드
npm run build
# → dist/ 폴더에 빌드 결과물 생성
```

### 2. Docker 배포

#### 개발용 Docker 실행
```bash
cd vue-parcel-app

# Docker 이미지 빌드
docker build -t recipe-chatbot-frontend .

# 컨테이너 실행
docker run -p 80:80 \
  -e VUE_APP_API_URL=http://localhost:8000/ask \
  recipe-chatbot-frontend
```

#### 프로덕션 Docker 실행 (Nginx)
```bash
cd vue-parcel-app

# 프로덕션 이미지 빌드 (API URL 설정)
docker build -t recipe-chatbot-frontend-prod \
  --build-arg VUE_APP_API_URL=/api .

# Nginx 컨테이너 실행
docker run -p 80:80 -p 443:443 \
  --name frontend-nginx \
  recipe-chatbot-frontend-prod
```

### 3. AWS 배포 (Docker Compose와 함께)

AWS 환경에서는 백엔드와 함께 docker-compose로 배포됩니다:

```bash
# 루트 디렉토리에서 (back_repo와 front_repo가 모두 있는 위치)
docker-compose up -d

# 프론트엔드만 재배포
docker-compose up -d --build frontend
```

### 4. 음성 인식 기능 사용
- **브라우저 권한**: 마이크 접근 권한 허용 필요
- **HTTPS 환경**: 프로덕션에서는 HTTPS 프로토콜 필요
- **지원 언어**: 한국어 (ko-KR) 설정됨

## 🔧 주요 기능 상세

### 메시지 타입별 UI 컴포넌트

1. **initial_options**: 시작 화면 옵션 버튼
2. **text**: 일반 텍스트 메시지
3. **loading**: 로딩 스피너 + 안내 메시지
4. **recipe_response**: 레시피 카드 (재료, 조리과정, 액션버튼)
5. **nutrition_response**: 영양정보 카드 (칼로리, 영양소 리스트)
6. **ingredients_response**: 추천 요리 목록 (페이지네이션)
7. **can_not_find**: 검색 실패 시 대안 제시

### 백엔드 통신

```javascript
// API 호출 구조
POST /ask
{
  "question": "사용자 질문"
}

// 응답 형태
{
  "author": "bot",
  "type": "response_type",
  "content": { /* 타입별 데이터 */ }
}
```

## 🎯 사용자 플로우

1. **진입**: 초기 3가지 옵션 제시
2. **선택**: 레시피 찾기 / 재료 활용 / 영양정보 검색
3. **입력**: 텍스트 또는 음성으로 질문 입력
4. **로딩**: 백엔드 처리 중 스피너 표시
5. **결과**: 타입별 카드 UI로 결과 표시
6. **액션**: 관련 기능 버튼으로 추가 인터랙션

## 🔧 Nginx 설정 상세

### 리버스 프록시 설정
- **API 경로**: `/api/*` → `http://backend:8000/*`
- **CORS 처리**: 모든 Origin 허용 (프로덕션에서는 제한 권장)
- **정적 파일**: Gzip 압축, 1년 캐시 설정

### 보안 헤더
- **X-Frame-Options**: Clickjacking 방지
- **X-Content-Type-Options**: MIME 타입 스니핑 방지
- **X-XSS-Protection**: XSS 공격 방지
- **Content-Security-Policy**: 콘텐츠 보안 정책

## 🔮 향후 개선 계획

- **PWA 지원**: 모바일 앱과 같은 경험 제공
- **다크모드**: 사용자 선호도에 따른 테마 전환
- **접근성 개선**: 스크린 리더 및 키보드 네비게이션 지원
- **오프라인 지원**: Service Worker를 통한 오프라인 기능
- **성능 최적화**: 코드 스플리팅 및 지연 로딩