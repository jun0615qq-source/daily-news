# 데일리 뉴스 (Daily News)

RSS 피드 기반 카드 뉴스 앱 — 요약, 출처, 증빙 사진 제공

## 기술 스택

| 구분 | 기술 | 비용 |
|---|---|---|
| 프론트엔드 | React 18 + Vite + Tailwind CSS | 무료 |
| 백엔드 | Node.js + Express | 무료 |
| 인증/DB | Firebase (Spark 플랜) | 무료 |
| 뉴스 소스 | RSS 피드 (동아일보, 한국경제, BBC 등) | 무료 |
| 광고 수익 | Google AdSense | 무료 (수익 발생) |
| 프론트 배포 | Vercel | 무료 |
| 백엔드 배포 | Render.com | 무료 |

---

## 빠른 시작

### 1. Firebase 프로젝트 설정

1. [Firebase 콘솔](https://console.firebase.google.com) 접속 → 새 프로젝트 생성
2. **Authentication** → 로그인 방법 → 이메일/비밀번호, Google 활성화
3. **Firestore Database** → 데이터베이스 만들기 (테스트 모드)
4. **프로젝트 설정** → 일반 → 앱 추가 (웹) → 설정값 복사

### 2. 환경 변수 설정

```bash
# 백엔드
cd backend
cp .env.example .env
# .env 파일을 열어 Firebase 서비스 계정 정보 입력
# (Firebase 콘솔 > 프로젝트 설정 > 서비스 계정 > 새 비공개 키 생성)

# 프론트엔드
cd frontend
cp .env.example .env
# .env 파일을 열어 Firebase 웹 앱 설정값 입력
```

### 3. 패키지 설치 및 실행

```bash
# 백엔드
cd backend
npm install
npm run dev        # http://localhost:3001

# 프론트엔드 (새 터미널)
cd frontend
npm install
npm run dev        # http://localhost:5173
```

---

## 배포 방법 (무료)

### 프론트엔드 → Vercel

```bash
npm install -g vercel
cd frontend
vercel
# 환경 변수를 Vercel 대시보드에서 설정
```

### 백엔드 → Render.com

1. [render.com](https://render.com) 회원가입
2. New → Web Service → GitHub 저장소 연결
3. Root Directory: `backend`
4. Build Command: `npm install`
5. Start Command: `npm start`
6. 환경 변수 추가 (`.env` 내용 동일하게)

---

## 광고 수익화 (Google AdSense)

1. [Google AdSense](https://adsense.google.com) 회원가입
2. 사이트 등록 및 승인 대기 (1~2주)
3. 승인 후 `frontend/.env`에 `VITE_ADSENSE_CLIENT=ca-pub-XXXXXXXX` 입력
4. `frontend/index.html`에서 AdSense 스크립트 주석 해제
5. 재배포

> 광고 수익은 월 방문자 수에 따라 다르며, 일반적으로 1,000 PV당 500~2,000원 수준입니다.

---

## 주요 기능

- **카드 뉴스**: 이미지 + 제목 + 3줄 요약 + 출처 표시
- **카테고리**: 전체 / 정치 / 경제 / 사회 / 국제 / IT·과학 / 스포츠 / 연예 / 건강
- **테마**: 베이지+화이트 (라이트) / 네이비 (다크) 토글
- **로그인**: 이메일+비밀번호, Google OAuth, 비밀번호 재설정, 이메일 인증
- **보안**: Firebase Auth JWT, Rate Limiting, Helmet, CORS, Input Validation
- **무한 스크롤**: 자동 페이지네이션
- **광고**: AdSense 배너 (상단, 피드 내, 하단)
- **캐싱**: 서버 사이드 5분 캐시 (RSS 부하 절감)

---

## 보안 체크리스트

- [x] Firebase Authentication (JWT 기반)
- [x] 비밀번호 강도 검사 (8자+대문자+숫자)
- [x] 이메일 인증 필수
- [x] Rate Limiting (IP당 15분 100회)
- [x] Helmet.js HTTP 보안 헤더
- [x] CORS 화이트리스트
- [x] 요청 크기 제한 (10KB)
- [x] Input Validation (express-validator)
- [x] 환경 변수로 민감 정보 분리

---

## 뉴스 출처

| 언론사 | 카테고리 |
|---|---|
| 동아일보 | 정치, 경제, 사회, 국제, 스포츠, 연예, 건강 |
| 조선일보 | 정치, 사회, 연예 |
| 한국경제 | 경제 |
| 전자신문 | IT/과학 |
| BBC World | 국제, 건강, 스포츠 |
| Reuters | 경제, 국제 |
| TechCrunch | IT/과학 |
| The Verge | IT/과학 |

> 모든 뉴스는 각 언론사의 공개 RSS 피드를 통해 제공됩니다.
> 저작권은 각 언론사에 있으며, 클릭 시 원문으로 이동합니다.
