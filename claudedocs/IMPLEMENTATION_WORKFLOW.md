# 🎯 Child Future - 아이 진로 탐색 웹 앱 구현 워크플로우

## 📊 프로젝트 개요

**목적:** 부모와 선생님이 아이의 성향, 활동, 관심사를 입력하면 Gemini AI를 통해 직업군/직업/상담 가이드를 제공하는 웹 애플리케이션

**기술 스택:**
- Frontend: Next.js 15 (App Router) + React 19
- AI: Google Gemini API (gemini-2.0-flash-exp)
- Storage: localStorage (1차), 추후 DB 확장 가능
- Styling: Tailwind CSS 4
- Charts: recharts
- Validation: zod
- Icons: lucide-react

**핵심 기능:**
1. 다단계 정보 입력 (온보딩 → 기본정보 → 상담내용 → 성향테스트)
2. Gemini API 기반 AI 분석 및 결과 생성
3. 5개 직업군별 맞춤 추천 (창의예술/분석연구/사람돌봄/리더조직/실무기술)
4. 4가지 상담 모드별 가이드 제공
5. 결과 저장 및 이전 검사와 비교
6. IB 학습자상 연계
7. 반응형 웹 디자인

---

## 🏗️ 프로젝트 구조

```
app/
├── page.tsx                    # 온보딩/랜딩 페이지
├── layout.tsx                  # 루트 레이아웃
├── globals.css                 # 전역 스타일
├── basic-info/
│   └── page.tsx               # Step 1: 기본정보 입력
├── consultation/
│   └── page.tsx               # Step 2: 상담 피드백 입력
├── assessment/
│   └── page.tsx               # Step 3: 성향 테스트
├── results/
│   └── page.tsx               # Step 4: 결과 화면
├── history/
│   └── page.tsx               # 이전 결과 비교
└── api/
    └── analyze/
        └── route.ts           # Gemini API 엔드포인트

lib/
├── types/                     # TypeScript 타입 정의
│   ├── assessment.ts          # 검사 관련 타입
│   ├── career.ts              # 직업/직업군 타입
│   └── result.ts              # 결과 타입
├── data/                      # 정적 데이터
│   ├── questions.ts           # 성향 검사 문항 (20-24개)
│   ├── careers.ts             # 직업군별 직업 데이터베이스
│   ├── majors.ts              # 직업군별 전공 매핑
│   └── consultation.ts        # 상담 모드별 가이드 템플릿
├── utils/                     # 유틸리티 함수
│   ├── gemini.ts              # Gemini API 클라이언트
│   ├── storage.ts             # localStorage 관리
│   ├── scoring.ts             # 점수 계산 로직
│   └── validation.ts          # 폼 유효성 검증
└── constants/                 # 상수
    └── index.ts               # 앱 전역 상수

components/
├── ui/                        # 재사용 가능한 UI 컴포넌트
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── TextArea.tsx
│   ├── Card.tsx
│   ├── Progress.tsx
│   └── RadioGroup.tsx         # 5점 척도 선택
├── forms/                     # 폼 컴포넌트
│   ├── BasicInfoForm.tsx
│   ├── ConsultationForm.tsx
│   └── AssessmentQuestion.tsx
├── results/                   # 결과 화면 컴포넌트
│   ├── CareerCard.tsx         # 직업군 카드
│   ├── ScoreChart.tsx         # 점수 차트 (recharts)
│   ├── ConsultationGuide.tsx  # 상담 가이드
│   └── IBProfile.tsx          # IB 학습자상
└── layout/                    # 레이아웃 컴포넌트
    ├── Header.tsx
    ├── StepIndicator.tsx      # 진행 단계 표시
    └── Container.tsx
```

---

## 📅 Phase별 구현 계획

### Phase 1: Foundation Setup (1-2시간)

#### 1.1 의존성 설치
```bash
npm install @google/generative-ai recharts zod date-fns lucide-react
```

**패키지 설명:**
- `@google/generative-ai`: Gemini AI SDK
- `recharts`: 점수 비교 차트 라이브러리
- `zod`: 런타임 타입 검증
- `date-fns`: 날짜 포맷팅
- `lucide-react`: 아이콘 라이브러리

#### 1.2 환경 설정
`.env.local` 파일 생성:
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

#### 1.3 디렉토리 구조 생성
```bash
mkdir -p lib/{types,data,utils,constants}
mkdir -p components/{ui,forms,results,layout}
mkdir -p app/{basic-info,consultation,assessment,results,history,api/analyze}
```

---

### Phase 2: 데이터 모델링 & 타입 정의 (30-45분)

#### 2.1 핵심 타입 정의

**lib/types/assessment.ts**
```typescript
// 5개 직업군 타입
export type CareerCategory = 'creative' | 'analytical' | 'caring' | 'leadership' | 'practical';

// 성향 검사 문항
export interface Question {
  id: string;
  text: string;
  category: CareerCategory[];
  weights: Record<CareerCategory, number>;
}

// 사용자 응답 (1-5 척도)
export interface QuestionResponse {
  questionId: string;
  value: 1 | 2 | 3 | 4 | 5;
}

// 기본 정보
export interface BasicInfo {
  nickname: string;
  age: number;
  grade?: string;
  gender?: 'male' | 'female' | 'prefer-not-to-say';
  activities: string[];      // 학원, 방과후
  hobbies: string[];         // 취미 활동
  interests: string[];       // 관심사
  strongSubjects: string[];  // 잘하는 과목
  achievements: string[];    // 상 받은 이력
}

// 상담 피드백
export interface ConsultationFeedback {
  schoolFeedback: string;   // 학교 상담에서 들은 말
  academyFeedback: string;  // 학원 상담에서 들은 말
}

// 완전한 검사 데이터
export interface AssessmentData {
  basicInfo: BasicInfo;
  consultation: ConsultationFeedback;
  responses: QuestionResponse[];
  timestamp: string;
}
```

**lib/types/result.ts**
```typescript
import { CareerCategory, BasicInfo } from './assessment';

// 직업군별 점수
export interface CategoryScores {
  creative: number;
  analytical: number;
  caring: number;
  leadership: number;
  practical: number;
}

// 직업 추천
export interface JobRecommendation {
  title: string;
  category: CareerCategory;
  description: string;
  icon?: string;
}

// 전공 추천
export interface MajorRecommendation {
  name: string;
  category: CareerCategory;
  universities?: string[];
}

// IB 학습자상 10가지
export type IBProfile =
  | 'Inquirer'      // 탐구하는 사람
  | 'Knowledgeable' // 지식이 풍부한 사람
  | 'Thinker'       // 사고하는 사람
  | 'Communicator'  // 소통하는 사람
  | 'Principled'    // 원칙을 지키는 사람
  | 'Open-minded'   // 열린 마음을 가진 사람
  | 'Caring'        // 배려하는 사람
  | 'Risk-taker'    // 도전하는 사람
  | 'Balanced'      // 균형잡힌 사람
  | 'Reflective';   // 성찰하는 사람

// 상담 모드 4가지
export type ConsultationMode =
  | 'parent-to-child'      // 부모 → 아이
  | 'teacher-to-child'     // 선생님 → 아이
  | 'teacher-to-parent'    // 선생님 → 부모
  | 'child-to-parent';     // 아이 → 부모

// 상담 가이드
export interface ConsultationGuide {
  mode: ConsultationMode;
  tips: string[];
  exampleQuestions: string[];
}

// 최종 결과
export interface AssessmentResult {
  id: string;
  timestamp: string;
  basicInfo: BasicInfo;
  scores: CategoryScores;
  topCategories: CareerCategory[];
  jobs: JobRecommendation[];
  majors: MajorRecommendation[];
  ibProfiles: IBProfile[];
  aiInsights?: string;
  developmentTips?: string;
}
```

#### 2.2 정적 데이터 파일

**lib/data/questions.ts**
- 20-24개 성향 검사 문항
- 각 문항은 1개 이상의 직업군에 가중치로 연결
- 5개 영역: 관심사/몰입, 사고방식, 사람관계, 활동스타일, 정서/태도

**lib/data/careers.ts**
- 5개 직업군별 대표 직업 리스트
- 각 직업에 대한 간단한 설명

**lib/data/majors.ts**
- 직업군별 추천 대학 전공
- 전공명과 관련 대학 예시

**lib/data/consultation.ts**
- 4가지 상담 모드별 템플릿
- 각 모드별 팁과 예시 질문

---

### Phase 3: Gemini AI 통합 (1시간)

#### 3.1 Gemini 클라이언트 설정

**lib/utils/gemini.ts**
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AssessmentData, AssessmentResult } from '@/lib/types/result';
import { calculateScores } from './scoring';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function analyzeChildProfile(
  data: AssessmentData
): Promise<Partial<AssessmentResult>> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const scores = calculateScores(data.responses);

  const prompt = `
당신은 아동 진로 상담 전문가입니다. 다음 정보를 바탕으로 아이의 성향과 추천 직업을 분석해주세요.

## 아이 정보
- 애칭: ${data.basicInfo.nickname}
- 나이: ${data.basicInfo.age}세
- 성별: ${data.basicInfo.gender || '미선택'}
- 활동: ${data.basicInfo.activities.join(', ')}
- 취미: ${data.basicInfo.hobbies.join(', ')}
- 관심사: ${data.basicInfo.interests.join(', ')}
- 잘하는 과목: ${data.basicInfo.strongSubjects.join(', ')}
- 받은 상: ${data.basicInfo.achievements.join(', ')}

## 상담 피드백
- 학교 상담: ${data.consultation.schoolFeedback}
- 학원 상담: ${data.consultation.academyFeedback}

## 성향 검사 점수
- 창의·예술형: ${scores.creative}
- 분석·연구형: ${scores.analytical}
- 사람·돌봄형: ${scores.caring}
- 리더·조직형: ${scores.leadership}
- 실무·기술형: ${scores.practical}

다음 형식의 JSON으로 응답해주세요:
{
  "aiInsights": "아이의 전반적인 성향과 강점에 대한 2-3문장 요약",
  "jobRecommendations": ["추천 직업 1", "추천 직업 2", "추천 직업 3"],
  "majorRecommendations": ["추천 전공 1", "추천 전공 2"],
  "ibProfiles": ["해당하는 IB 프로필 1", "IB 프로필 2"],
  "developmentTips": "이 아이의 재능을 키우기 위한 구체적인 제안 2-3가지"
}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  // JSON 추출
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  return {};
}
```

#### 3.2 API Route 생성

**app/api/analyze/route.ts**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { analyzeChildProfile } from '@/lib/utils/gemini';
import { AssessmentData } from '@/lib/types/assessment';

export async function POST(request: NextRequest) {
  try {
    const data: AssessmentData = await request.json();

    // 데이터 검증
    if (!data.basicInfo || !data.responses || data.responses.length === 0) {
      return NextResponse.json(
        { error: 'Invalid assessment data' },
        { status: 400 }
      );
    }

    // Gemini API 호출
    const analysis = await analyzeChildProfile(data);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Analysis failed', details: error.message },
      { status: 500 }
    );
  }
}
```

---

### Phase 4: 유틸리티 함수 (30분)

#### 4.1 점수 계산

**lib/utils/scoring.ts**
```typescript
import { QuestionResponse, CareerCategory } from '@/lib/types/assessment';
import { CategoryScores } from '@/lib/types/result';
import { ASSESSMENT_QUESTIONS } from '@/lib/data/questions';

export function calculateScores(responses: QuestionResponse[]): CategoryScores {
  const scores: CategoryScores = {
    creative: 0,
    analytical: 0,
    caring: 0,
    leadership: 0,
    practical: 0
  };

  responses.forEach(response => {
    const question = ASSESSMENT_QUESTIONS.find(q => q.id === response.questionId);
    if (!question) return;

    Object.entries(question.weights).forEach(([category, weight]) => {
      scores[category as keyof CategoryScores] += response.value * weight;
    });
  });

  return scores;
}

export function getTopCategories(
  scores: CategoryScores,
  count: number = 2
): CareerCategory[] {
  return (Object.entries(scores) as [CareerCategory, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([category]) => category);
}

export function normalizeScores(scores: CategoryScores): CategoryScores {
  const max = Math.max(...Object.values(scores));
  if (max === 0) return scores;

  return Object.entries(scores).reduce((acc, [key, value]) => {
    acc[key as keyof CategoryScores] = Math.round((value / max) * 100);
    return acc;
  }, {} as CategoryScores);
}
```

#### 4.2 localStorage 관리

**lib/utils/storage.ts**
```typescript
import { AssessmentResult } from '@/lib/types/result';

const STORAGE_KEY = 'child-future-results';

export function saveResult(result: AssessmentResult): void {
  if (typeof window === 'undefined') return;

  const existing = getResults();
  existing.push(result);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export function getResults(): AssessmentResult[] {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function getLatestResult(): AssessmentResult | null {
  const results = getResults();
  return results.length > 0 ? results[results.length - 1] : null;
}

export function getResultById(id: string): AssessmentResult | null {
  const results = getResults();
  return results.find(r => r.id === id) || null;
}

export function compareResults(currentId: string, previousId: string) {
  const results = getResults();
  const current = results.find(r => r.id === currentId);
  const previous = results.find(r => r.id === previousId);

  if (!current || !previous) return null;

  return {
    current,
    previous,
    scoreDifferences: Object.entries(current.scores).reduce((acc, [key, value]) => {
      acc[key] = value - previous.scores[key as keyof CategoryScores];
      return acc;
    }, {} as Record<string, number>)
  };
}
```

---

### Phase 5: UI 컴포넌트 개발 (2-3시간)

#### 5.1 기본 UI 컴포넌트

**components/ui/Button.tsx**
**components/ui/Input.tsx**
**components/ui/TextArea.tsx**
**components/ui/Card.tsx**
**components/ui/Progress.tsx**
**components/ui/RadioGroup.tsx**

#### 5.2 폼 컴포넌트

**components/forms/BasicInfoForm.tsx**
- 애칭, 나이, 성별 입력
- 활동, 취미, 관심사 (동적 입력 필드)
- 잘하는 과목, 받은 상

**components/forms/ConsultationForm.tsx**
- 학교 상담 피드백
- 학원 상담 피드백

**components/forms/AssessmentQuestion.tsx**
- 5점 척도 라디오 버튼
- 문항별 표시

#### 5.3 결과 화면 컴포넌트

**components/results/CareerCard.tsx**
- 직업군 카드 (순위 표시)
- 대표 직업 리스트
- 관련 전공 표시

**components/results/ScoreChart.tsx**
- recharts 막대 그래프
- 5개 직업군 점수 시각화

**components/results/ConsultationGuide.tsx**
- 4개 모드 탭 또는 버튼
- 모드별 팁과 예시 문장

**components/results/IBProfile.tsx**
- IB 학습자상 연계 텍스트

---

### Phase 6: 페이지 구현 (2-3시간)

#### 6.1 온보딩 페이지
**app/page.tsx**
- 서비스 소개
- [검사 시작하기] 버튼

#### 6.2 입력 페이지들
**app/basic-info/page.tsx**
**app/consultation/page.tsx**
**app/assessment/page.tsx**

각 페이지:
- 진행 단계 표시 (StepIndicator)
- 폼 컴포넌트
- 다음/이전 버튼
- sessionStorage에 데이터 임시 저장

#### 6.3 결과 페이지
**app/results/page.tsx**
- sessionStorage에서 데이터 수집
- API 호출 (Gemini 분석)
- 결과 표시
- localStorage에 저장

#### 6.4 히스토리 페이지
**app/history/page.tsx**
- 저장된 결과 목록
- 이전 결과와 비교

---

### Phase 7: 테스트 & 검증 (1시간)

#### 7.1 테스트 체크리스트
- [ ] 폼 유효성 검증
- [ ] 다단계 네비게이션
- [ ] Gemini API 응답 처리
- [ ] 점수 계산 정확도
- [ ] localStorage 저장/불러오기
- [ ] 차트 렌더링
- [ ] 반응형 디자인
- [ ] 에러 핸들링
- [ ] 로딩 상태

#### 7.2 수동 테스트
1. 전체 사용자 여정 완주
2. 다양한 입력 조합 테스트
3. 결과 히스토리 및 비교 확인
4. 모든 상담 모드 확인
5. 다양한 기기/브라우저 테스트

---

## 📅 구현 일정

**Day 1 (4-5시간):**
1. ✅ 의존성 설치
2. ✅ 환경 변수 설정
3. ✅ 타입 정의 작성
4. ✅ 정적 데이터 파일 (questions, careers, majors)
5. ✅ Gemini 통합
6. ✅ 유틸리티 함수 (scoring, storage)

**Day 2 (4-5시간):**
7. ✅ 기본 UI 컴포넌트
8. ✅ 폼 컴포넌트
9. ✅ 랜딩 페이지
10. ✅ basic-info, consultation 페이지

**Day 3 (3-4시간):**
11. ✅ assessment 페이지 (문항 플로우)
12. ✅ results 페이지 (전체 시각화)
13. ✅ 상담 가이드 추가
14. ✅ history/비교 기능

**Day 4 (2-3시간):**
15. ✅ 테스트 및 버그 수정
16. ✅ 모바일 반응형 최적화
17. ✅ 성능 최적화
18. ✅ 최종 검증

---

## 🚀 빠른 시작

```bash
# 1. 의존성 설치
npm install @google/generative-ai recharts zod date-fns lucide-react

# 2. 환경 변수 설정
echo "NEXT_PUBLIC_GEMINI_API_KEY=your_key" > .env.local

# 3. 개발 서버 실행
npm run dev

# 4. 프로덕션 빌드
npm run build

# 5. 프로덕션 서버 시작
npm start
```

---

## 📈 성공 지표

- ✅ 7단계 사용자 플로우 완료
- ✅ Gemini API 응답 시간 < 5초
- ✅ localStorage 저장 성공
- ✅ 차트 정확한 렌더링
- ✅ 모바일 반응형 (≥ 375px)
- ✅ 접근성 (키보드 네비게이션, ARIA)
- ✅ Lighthouse 성능 점수 > 90

---

## 🔧 주요 기술 결정

### Gemini API 선택 이유
- 한국어 자연어 처리 우수
- 빠른 응답 속도 (gemini-2.0-flash-exp)
- 구조화된 JSON 응답 지원
- 무료 티어로 개발 가능

### localStorage 사용 이유
- 간단한 구현으로 빠른 MVP
- 별도 백엔드 불필요
- 추후 DB 마이그레이션 용이

### 5개 직업군 선택
- 아동 진로 교육 연구 기반
- 명확한 구분과 이해 용이
- IB 학습자상과 연계 가능

---

## 📝 추후 확장 계획

### v1.0 (현재)
- ✅ 기본 검사 및 결과
- ✅ Gemini AI 분석
- ✅ localStorage 저장
- ✅ 4가지 상담 모드

### v1.5 (2단계)
- [ ] 회원가입/로그인 (Firebase Auth)
- [ ] 데이터베이스 저장 (Firestore)
- [ ] PDF 리포트 생성
- [ ] 이메일 공유 기능

### v2.0 (3단계)
- [ ] 선생님용 대시보드
- [ ] 반별 그룹 관리
- [ ] 학급 전체 통계
- [ ] 개별 상담 메모

### v3.0 (4단계)
- [ ] 성장 추적 그래프 (월별/년별)
- [ ] AI 챗봇 상담
- [ ] 추천 활동/책/영상
- [ ] 커뮤니티 기능

---

## 🛠️ 트러블슈팅

### Gemini API 오류
```typescript
// 재시도 로직 추가
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

### localStorage 용량 초과
```typescript
// 오래된 결과 자동 삭제
function cleanupOldResults(maxCount = 10) {
  const results = getResults();
  if (results.length > maxCount) {
    const recent = results.slice(-maxCount);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
  }
}
```

---

## 📚 참고 자료

- [Next.js App Router 문서](https://nextjs.org/docs/app)
- [Gemini API 문서](https://ai.google.dev/docs)
- [Recharts 문서](https://recharts.org/)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [IB Learner Profile](https://www.ibo.org/benefits/learner-profile/)

---

**작성일:** 2025-11-19
**최종 수정:** 2025-11-19
**버전:** 1.0.0
