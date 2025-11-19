# Child Future - 아이의 미래 진로 탐색 🌟

AI 기반 아동 진로 탐색 웹 애플리케이션입니다. 부모와 선생님이 아이의 성향, 활동, 관심사를 입력하면 Google Gemini AI를 통해 직업군/직업/상담 가이드를 제공합니다.

## 🌟 주요 기능

- **다단계 정보 입력**: 온보딩 → 기본정보 → 상담내용 → 성향테스트 (24문항)
- **Gemini AI 분석**: 구글 Gemini 2.0 Flash를 통한 전문가 수준의 진로 분석
- **5개 직업군 추천**: 창의예술형 / 분석연구형 / 사람돌봄형 / 리더조직형 / 실무기술형
- **4가지 상담 모드**: 부모↔아이, 선생님↔아이, 선생님↔부모, 아이↔부모
- **결과 저장 및 비교**: localStorage 기반 이전 검사 결과 저장
- **IB 학습자상 연계**: 국제 바칼로레아 학습자 프로필 매핑
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 완벽 지원

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일에 Gemini API 키를 설정하세요:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

**Gemini API 키 발급**: https://aistudio.google.com/app/apikey

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 앱을 확인하세요.

### 4. 프로덕션 빌드

```bash
npm run build
npm start
```

## 📁 프로젝트 구조

```
child-future/
├── app/                        # Next.js App Router 페이지
│   ├── page.tsx               # 온보딩 페이지
│   ├── basic-info/            # 기본정보 입력
│   ├── consultation/          # 상담 피드백 입력
│   ├── assessment/            # 성향 테스트 (24문항)
│   ├── results/               # 결과 화면
│   └── api/analyze/           # Gemini API 엔드포인트
│
├── components/                 # React 컴포넌트
│   ├── ui/                    # 기본 UI 컴포넌트
│   ├── forms/                 # 폼 컴포넌트
│   └── results/               # 결과 화면 컴포넌트
│
├── lib/                        # 유틸리티 및 데이터
│   ├── types/                 # TypeScript 타입 정의
│   ├── data/                  # 정적 데이터 (문항, 직업, 전공, 상담 가이드)
│   └── utils/                 # 유틸리티 함수
│       ├── gemini.ts          # Gemini API 클라이언트
│       ├── storage.ts         # localStorage 관리
│       └── scoring.ts         # 점수 계산 로직
│
└── claudedocs/                 # 프로젝트 문서
    └── IMPLEMENTATION_WORKFLOW.md  # 구현 워크플로우
```

## 🎯 사용자 플로우

1. **온보딩** → 서비스 소개 및 [검사 시작하기] 버튼
2. **기본정보 입력** → 애칭, 나이, 성별, 활동, 취미, 관심사, 잘하는 과목, 수상 이력
3. **상담 피드백** → 학교/학원 상담에서 들은 피드백 입력
4. **성향 테스트** → 24개 문항 (5점 척도)
5. **결과 화면** → AI 분석, 직업군 점수, 직업/전공 추천, 상담 가이드, IB 학습자상

## 🛠️ 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **AI**: Google Gemini API (gemini-2.0-flash-exp)
- **Charts**: Recharts
- **Validation**: Zod
- **Storage**: localStorage (향후 DB 확장 가능)

## 📊 데이터 모델

### 5개 직업군

1. **창의·예술형** (Creative): 디자이너, 작가, 애니메이터, 건축가 등
2. **분석·연구형** (Analytical): 프로그래머, 데이터분석가, 과학자, 연구원 등
3. **사람·돌봄형** (Caring): 교사, 상담사, 간호사, 사회복지사 등
4. **리더·조직형** (Leadership): 기획자, 매니저, 창업가, 마케터 등
5. **실무·기술형** (Practical): 엔지니어, 운동선수, 요리사, 파일럿 등

### 24개 성향 검사 문항

각 직업군당 4-5개 문항, 5점 척도 응답:
- 전혀 그렇지 않다 (1점)
- 그렇지 않은 편이다 (2점)
- 보통이다 (3점)
- 그런 편이다 (4점)
- 매우 그렇다 (5점)

### 4가지 상담 모드

1. **부모 → 아이**: 따뜻하고 호기심 많은 질문
2. **선생님 → 아이**: 인정과 관찰 기반 제안
3. **선생님 → 부모**: 객관적 관찰과 방향 제시
4. **아이 → 부모**: 아이의 자기표현 지원

## 🔑 주요 API

### POST /api/analyze

Gemini AI를 통한 아동 프로필 분석

**Request Body:**
```typescript
{
  basicInfo: {
    nickname: string;
    age: number;
    // ...
  },
  consultation: {
    schoolFeedback: string;
    academyFeedback: string;
  },
  responses: QuestionResponse[];
  timestamp: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  data: {
    aiInsights: string;
    ibProfiles: IBProfile[];
    developmentTips: string;
  }
}
```

## 📚 문서

- [구현 워크플로우](claudedocs/IMPLEMENTATION_WORKFLOW.md) - 전체 프로젝트 구현 가이드

## ⚙️ 다음 단계

1. `.env.local`에 Gemini API 키 설정
2. `npm run dev`로 개발 서버 실행
3. http://localhost:3000에서 앱 테스트
4. Gemini API 키가 정상 작동하는지 확인

## 🔧 트러블슈팅

### Gemini API 오류
- API 키가 올바르게 설정되었는지 확인
- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- 개발 서버를 재시작

### 빌드 오류
```bash
rm -rf .next
npm install
npm run dev
```

## 📝 라이선스

MIT

## 🤝 기여

이슈와 PR을 환영합니다!

---

**Made with ❤️ for children's bright future**
