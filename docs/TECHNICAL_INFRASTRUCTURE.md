# 기술 인프라 설계서

> **문서 버전:** 1.0
> **작성일:** 2024-12-23
> **기술 스택:** Next.js 15 + Supabase + Vercel

---

## 1. 기술 스택 개요

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend                           │
│  Next.js 15 (App Router) + TypeScript + Tailwind CSS   │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                      Backend                            │
│           Supabase (PostgreSQL + Auth + Storage)        │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                      AI Services                        │
│                   Google Gemini API                     │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                      Deployment                         │
│                       Vercel                            │
└─────────────────────────────────────────────────────────┘
```

### 1.1 주요 기술

| 영역 | 기술 | 용도 |
|------|------|------|
| Frontend | Next.js 15 (App Router) | SSR/SSG, 라우팅 |
| Styling | Tailwind CSS + shadcn/ui | UI 컴포넌트 |
| Database | Supabase (PostgreSQL) | 데이터 저장 |
| Auth | Supabase Auth | 사용자 인증 |
| Storage | Supabase Storage | 이미지 저장 |
| AI | Google Gemini API | 분석/추천 |
| Deployment | Vercel | 호스팅/CI/CD |
| Charts | Recharts | 데이터 시각화 |
| PDF | html2canvas + jsPDF | PDF 생성 |

---

## 2. Supabase 데이터베이스 스키마

### 2.1 ERD (Entity Relationship Diagram)

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    users     │       │   children   │       │  assessments │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │──────<│ id (PK)      │──────<│ id (PK)      │
│ email        │       │ user_id (FK) │       │ child_id(FK) │
│ created_at   │       │ nickname     │       │ mode         │
│ updated_at   │       │ age          │       │ scores       │
└──────────────┘       │ gender       │       │ ib_profiles  │
                       │ created_at   │       │ ai_insights  │
                       └──────────────┘       │ created_at   │
                              │               └──────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    goals     │       │   missions   │       │   check_ins  │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │       │ id (PK)      │       │ id (PK)      │
│ child_id(FK) │       │ child_id(FK) │       │ child_id(FK) │
│ title        │       │ mission_id   │       │ week_start   │
│ ib_profile   │       │ status       │       │ child_eval   │
│ status       │       │ completed_at │       │ parent_obs   │
│ progress     │       │ reflection   │       │ created_at   │
└──────────────┘       └──────────────┘       └──────────────┘
        │                     │
        │                     ▼
        │               ┌──────────────┐
        │               │    badges    │
        │               ├──────────────┤
        │               │ id (PK)      │
        │               │ child_id(FK) │
        │               │ mission_id   │
        │               │ name         │
        │               │ tier         │
        │               │ earned_at    │
        │               └──────────────┘
        │
        ▼
┌──────────────┐       ┌──────────────┐
│ diary_entries│       │   reports    │
├──────────────┤       ├──────────────┤
│ id (PK)      │       │ id (PK)      │
│ child_id(FK) │       │ child_id(FK) │
│ goal_id (FK) │       │ period_type  │
│ title        │       │ period_start │
│ photos       │       │ ai_analysis  │
│ reflection   │       │ generated_at │
│ created_at   │       └──────────────┘
└──────────────┘
```

### 2.2 SQL 스키마 정의

```sql
-- =====================================================
-- 1. USERS 테이블 (Supabase Auth 확장)
-- =====================================================
-- Supabase Auth의 auth.users를 사용하므로 별도 테이블 불필요
-- 필요 시 public.profiles로 확장

CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 정책
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- =====================================================
-- 2. CHILDREN 테이블 (아이 프로필)
-- =====================================================
CREATE TABLE public.children (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nickname TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 1 AND age <= 20),
  grade TEXT,
  gender TEXT CHECK (gender IN ('male', 'female', 'prefer-not-to-say')),
  activities TEXT[] DEFAULT '{}',
  hobbies TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  strong_subjects TEXT[] DEFAULT '{}',
  achievements TEXT[] DEFAULT '{}',
  likes TEXT[] DEFAULT '{}',
  dream_jobs TEXT[] DEFAULT '{}',
  dislikes TEXT[] DEFAULT '{}',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_children_user_id ON public.children(user_id);

-- RLS 정책
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own children"
  ON public.children FOR ALL
  USING (auth.uid() = user_id);

-- =====================================================
-- 3. ASSESSMENTS 테이블 (검사 결과)
-- =====================================================
CREATE TYPE assessment_mode AS ENUM ('quick', 'full', 'extend');
CREATE TYPE career_category AS ENUM ('creative', 'analytical', 'caring', 'leadership', 'practical');
CREATE TYPE ib_profile AS ENUM (
  'Inquirer', 'Knowledgeable', 'Thinker', 'Communicator', 'Principled',
  'Open-minded', 'Caring', 'Risk-taker', 'Balanced', 'Reflective'
);

CREATE TABLE public.assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
  mode assessment_mode NOT NULL,

  -- 점수 (JSONB로 저장)
  scores JSONB NOT NULL DEFAULT '{
    "creative": 0,
    "analytical": 0,
    "caring": 0,
    "leadership": 0,
    "practical": 0
  }',

  -- 상위 카테고리
  top_categories career_category[] NOT NULL DEFAULT '{}',

  -- IB 학습자상
  ib_profiles ib_profile[] NOT NULL DEFAULT '{}',
  ib_profile_analysis TEXT,

  -- AI 분석 결과
  ai_insights TEXT,
  development_tips TEXT,

  -- 상담 피드백 원본
  consultation_feedback JSONB,

  -- 응답 원본 (선택적 저장)
  responses JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_assessments_child_id ON public.assessments(child_id);
CREATE INDEX idx_assessments_created_at ON public.assessments(created_at DESC);

-- RLS 정책
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own children assessments"
  ON public.assessments FOR ALL
  USING (
    child_id IN (
      SELECT id FROM public.children WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- 4. GOALS 테이블 (성장 목표)
-- =====================================================
CREATE TYPE goal_status AS ENUM ('active', 'completed', 'abandoned');

CREATE TABLE public.goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  target_ib_profile ib_profile,
  target_category career_category,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  recommended_activities TEXT[] DEFAULT '{}',
  status goal_status DEFAULT 'active',
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_goals_child_id ON public.goals(child_id);
CREATE INDEX idx_goals_status ON public.goals(status);

-- RLS 정책
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own children goals"
  ON public.goals FOR ALL
  USING (
    child_id IN (
      SELECT id FROM public.children WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- 5. MISSION_TEMPLATES 테이블 (미션 템플릿 - 시스템 데이터)
-- =====================================================
CREATE TYPE mission_difficulty AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE badge_tier AS ENUM ('bronze', 'silver', 'gold');

CREATE TABLE public.mission_templates (
  id TEXT PRIMARY KEY,  -- 예: 'inq-001'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  target_ib_profile ib_profile NOT NULL,
  target_category career_category NOT NULL,
  difficulty mission_difficulty DEFAULT 'easy',
  estimated_time TEXT,
  badge_name TEXT NOT NULL,
  badge_icon TEXT NOT NULL,
  badge_tier badge_tier DEFAULT 'bronze',
  age_min INTEGER DEFAULT 6,
  age_max INTEGER DEFAULT 12,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 시스템 테이블이므로 RLS 불필요, 읽기만 허용
ALTER TABLE public.mission_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read mission templates"
  ON public.mission_templates FOR SELECT
  USING (TRUE);

-- =====================================================
-- 6. MISSION_PROGRESS 테이블 (미션 진행 상황)
-- =====================================================
CREATE TYPE mission_status AS ENUM ('in_progress', 'completed', 'skipped');

CREATE TABLE public.mission_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
  mission_id TEXT REFERENCES public.mission_templates(id) NOT NULL,
  status mission_status DEFAULT 'in_progress',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  reflection TEXT,
  parent_verified BOOLEAN DEFAULT FALSE,

  UNIQUE(child_id, mission_id)  -- 한 아이당 미션 하나씩
);

-- 인덱스
CREATE INDEX idx_mission_progress_child_id ON public.mission_progress(child_id);
CREATE INDEX idx_mission_progress_status ON public.mission_progress(status);

-- RLS 정책
ALTER TABLE public.mission_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own children mission progress"
  ON public.mission_progress FOR ALL
  USING (
    child_id IN (
      SELECT id FROM public.children WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- 7. BADGES 테이블 (획득한 배지)
-- =====================================================
CREATE TABLE public.badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
  mission_id TEXT REFERENCES public.mission_templates(id),
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  tier badge_tier NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_badges_child_id ON public.badges(child_id);

-- RLS 정책
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own children badges"
  ON public.badges FOR ALL
  USING (
    child_id IN (
      SELECT id FROM public.children WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- 8. CHECK_INS 테이블 (주간 체크인)
-- =====================================================
CREATE TYPE activity_level AS ENUM ('high', 'medium', 'low');
CREATE TYPE weekly_mood AS ENUM ('great', 'good', 'okay', 'notgood', 'bad');

CREATE TABLE public.check_ins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,

  -- 아이 자기평가
  child_activity_level activity_level,
  child_favorite_activity TEXT,
  child_weekly_mood weekly_mood,
  child_free_note TEXT,

  -- 부모 관찰기록
  parent_noticeable_changes TEXT,
  parent_completed_activities TEXT[] DEFAULT '{}',
  parent_special_episode TEXT,
  parent_photos TEXT[] DEFAULT '{}',  -- Storage URL 배열

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(child_id, week_start)  -- 주당 하나의 체크인
);

-- 인덱스
CREATE INDEX idx_check_ins_child_id ON public.check_ins(child_id);
CREATE INDEX idx_check_ins_week_start ON public.check_ins(week_start DESC);

-- RLS 정책
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own children check-ins"
  ON public.check_ins FOR ALL
  USING (
    child_id IN (
      SELECT id FROM public.children WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- 9. DIARY_ENTRIES 테이블 (성장 다이어리)
-- =====================================================
CREATE TABLE public.diary_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,

  -- 활동 기록
  activity_title TEXT NOT NULL,
  activity_description TEXT,
  activity_photos TEXT[] DEFAULT '{}',  -- Storage URL 배열

  -- 소감
  child_reflection TEXT,
  parent_note TEXT,

  -- 연결 정보
  related_mission_id TEXT REFERENCES public.mission_templates(id),
  related_goal_id UUID REFERENCES public.goals(id) ON DELETE SET NULL,
  ib_profile ib_profile,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_diary_entries_child_id ON public.diary_entries(child_id);
CREATE INDEX idx_diary_entries_date ON public.diary_entries(date DESC);

-- RLS 정책
ALTER TABLE public.diary_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own children diary entries"
  ON public.diary_entries FOR ALL
  USING (
    child_id IN (
      SELECT id FROM public.children WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- 10. CONVERSATION_CARDS 테이블 (대화 카드 - 시스템 데이터)
-- =====================================================
CREATE TYPE conversation_situation AS ENUM ('meal', 'bedtime', 'travel', 'play', 'anytime');
CREATE TYPE conversation_category AS ENUM ('question', 'activity', 'reflection');

CREATE TABLE public.conversation_cards (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  situation conversation_situation NOT NULL,
  target_ib_profile ib_profile NOT NULL,
  follow_up_tips TEXT[] DEFAULT '{}',
  age_min INTEGER DEFAULT 6,
  age_max INTEGER DEFAULT 12,
  category conversation_category DEFAULT 'question',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 정책
ALTER TABLE public.conversation_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read conversation cards"
  ON public.conversation_cards FOR SELECT
  USING (TRUE);

-- =====================================================
-- 11. CONVERSATION_HISTORY 테이블 (대화 카드 사용 기록)
-- =====================================================
CREATE TABLE public.conversation_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
  card_id TEXT REFERENCES public.conversation_cards(id) NOT NULL,
  used_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

-- 인덱스
CREATE INDEX idx_conversation_history_child_id ON public.conversation_history(child_id);

-- RLS 정책
ALTER TABLE public.conversation_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own children conversation history"
  ON public.conversation_history FOR ALL
  USING (
    child_id IN (
      SELECT id FROM public.children WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- 12. REPORTS 테이블 (AI 성장 리포트)
-- =====================================================
CREATE TYPE report_period_type AS ENUM ('monthly', 'quarterly', 'yearly');

CREATE TABLE public.reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
  period_type report_period_type NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,

  -- 검사 비교 (JSONB)
  assessment_comparison JSONB,

  -- 활동 통계 (JSONB)
  activity_stats JSONB,

  -- AI 분석 (JSONB)
  ai_analysis JSONB NOT NULL,

  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_reports_child_id ON public.reports(child_id);
CREATE INDEX idx_reports_period ON public.reports(period_start DESC);

-- RLS 정책
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own children reports"
  ON public.reports FOR ALL
  USING (
    child_id IN (
      SELECT id FROM public.children WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- 13. HELPER FUNCTIONS
-- =====================================================

-- 자동 updated_at 갱신 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 적용
CREATE TRIGGER update_children_updated_at
  BEFORE UPDATE ON public.children
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at
  BEFORE UPDATE ON public.goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_check_ins_updated_at
  BEFORE UPDATE ON public.check_ins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_diary_entries_updated_at
  BEFORE UPDATE ON public.diary_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 프로필 자동 생성 트리거 (회원가입 시)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### 2.3 Supabase Storage 버킷 설정

```sql
-- Storage 버킷 생성 (Supabase Dashboard 또는 API)

-- 1. 다이어리/체크인 이미지용 버킷
INSERT INTO storage.buckets (id, name, public)
VALUES ('diary-images', 'diary-images', true);

-- 2. 아이 아바타용 버킷
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- Storage RLS 정책
CREATE POLICY "Users can upload diary images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'diary-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view diary images"
ON storage.objects FOR SELECT
USING (bucket_id = 'diary-images');

CREATE POLICY "Users can delete own diary images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'diary-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## 3. Supabase 클라이언트 설정

### 3.1 환경 변수

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # 서버 사이드용

# Gemini API
GEMINI_API_KEY=your-gemini-api-key

# Vercel (자동 주입)
VERCEL_URL=
```

### 3.2 Supabase 클라이언트 설정

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

```typescript
// lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component에서는 무시
          }
        },
      },
    }
  );
}
```

```typescript
// lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 세션 갱신
  await supabase.auth.getUser();

  return supabaseResponse;
}
```

### 3.3 TypeScript 타입 생성

```bash
# Supabase CLI로 타입 자동 생성
npx supabase gen types typescript --project-id your-project-id > lib/supabase/database.types.ts
```

```typescript
// lib/supabase/database.types.ts (자동 생성 예시)
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      children: {
        Row: {
          id: string;
          user_id: string;
          nickname: string;
          age: number;
          gender: 'male' | 'female' | 'prefer-not-to-say' | null;
          activities: string[];
          hobbies: string[];
          interests: string[];
          strong_subjects: string[];
          achievements: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          nickname: string;
          age: number;
          gender?: 'male' | 'female' | 'prefer-not-to-say' | null;
          // ... 생략
        };
        Update: {
          nickname?: string;
          age?: number;
          // ... 생략
        };
      };
      // ... 다른 테이블들
    };
    Enums: {
      assessment_mode: 'quick' | 'full' | 'extend';
      career_category: 'creative' | 'analytical' | 'caring' | 'leadership' | 'practical';
      ib_profile: 'Inquirer' | 'Knowledgeable' | 'Thinker' | /* ... */;
      // ... 다른 enum들
    };
  };
}
```

---

## 4. 인증 플로우

### 4.1 지원 인증 방식

```typescript
// 1. 이메일/비밀번호 (기본)
// 2. 소셜 로그인 (Google, Kakao - 선택적)
// 3. Magic Link (비밀번호 없이 이메일 링크)

const AUTH_PROVIDERS = {
  email: true,
  google: true,    // 선택적
  kakao: true,     // 선택적 (한국 사용자용)
};
```

### 4.2 인증 페이지 구조

```
/auth
├── /login          - 로그인
├── /signup         - 회원가입
├── /forgot-password - 비밀번호 찾기
├── /reset-password  - 비밀번호 재설정
└── /callback       - OAuth 콜백
```

### 4.3 미들웨어 보호

```typescript
// middleware.ts
import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * 다음 경로 제외:
     * - _next/static
     * - _next/image
     * - favicon.ico
     * - 공개 페이지 (/, /auth/*)
     */
    '/((?!_next/static|_next/image|favicon.ico|auth|$).*)',
  ],
};
```

### 4.4 보호된 라우트

```typescript
// app/(protected)/layout.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  return <>{children}</>;
}
```

---

## 5. API 라우트 구조

### 5.1 API 엔드포인트

```
/api
├── /auth
│   ├── /callback     - OAuth 콜백 처리
│   └── /signout      - 로그아웃
│
├── /children
│   ├── GET           - 아이 목록 조회
│   ├── POST          - 아이 추가
│   └── /[id]
│       ├── GET       - 아이 상세 조회
│       ├── PUT       - 아이 정보 수정
│       └── DELETE    - 아이 삭제
│
├── /assessments
│   ├── POST          - 검사 결과 저장
│   └── /[childId]
│       └── GET       - 검사 결과 목록
│
├── /goals
│   ├── POST          - 목표 생성
│   └── /[id]
│       ├── PUT       - 목표 수정
│       └── DELETE    - 목표 삭제
│
├── /missions
│   └── /[childId]
│       ├── GET       - 추천 미션
│       └── /progress
│           ├── POST  - 미션 시작
│           └── PUT   - 미션 완료
│
├── /check-ins
│   └── /[childId]
│       ├── GET       - 체크인 목록
│       └── POST      - 체크인 저장
│
├── /diary
│   └── /[childId]
│       ├── GET       - 다이어리 목록
│       └── POST      - 다이어리 저장
│
├── /reports
│   └── /[childId]
│       └── /generate
│           └── POST  - AI 리포트 생성
│
├── /analyze          - Gemini AI 분석 (기존)
├── /generate-questions - 질문 생성 (기존)
└── /upload
    └── POST          - 이미지 업로드
```

### 5.2 API 라우트 예시

```typescript
// app/api/children/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('children')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from('children')
    .insert({
      ...body,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
```

---

## 6. Vercel 배포 설정

### 6.1 vercel.json

```json
{
  "framework": "nextjs",
  "regions": ["icn1"],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase-service-role-key",
    "GEMINI_API_KEY": "@gemini-api-key"
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-store, max-age=0"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/login",
      "destination": "/auth/login",
      "permanent": true
    }
  ]
}
```

### 6.2 환경 변수 설정

```bash
# Vercel CLI로 환경 변수 설정
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add GEMINI_API_KEY
```

### 6.3 빌드 설정

```json
// package.json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "db:types": "npx supabase gen types typescript --project-id $SUPABASE_PROJECT_ID > lib/supabase/database.types.ts"
  }
}
```

### 6.4 배포 프로세스

```
1. GitHub 연동
   - Vercel Dashboard → Import Git Repository
   - main 브랜치 자동 배포 설정

2. 환경 변수 설정
   - Project Settings → Environment Variables
   - Production / Preview / Development 각각 설정

3. 도메인 설정 (선택)
   - Project Settings → Domains
   - 커스텀 도메인 추가

4. 배포 확인
   - Deployments 탭에서 빌드 로그 확인
   - Preview URL로 테스트
```

---

## 7. 마이그레이션 전략

### 7.1 localStorage → Supabase 마이그레이션

```typescript
// lib/utils/migration.ts
import { createClient } from '@/lib/supabase/client';

interface LegacyResult {
  id: string;
  timestamp: string;
  basicInfo: {
    nickname: string;
    age: number;
    // ...
  };
  scores: Record<string, number>;
  // ...
}

export async function migrateLocalStorageToSupabase(userId: string) {
  const supabase = createClient();

  // 1. localStorage에서 기존 데이터 읽기
  const legacyResults = localStorage.getItem('child-future-results');
  if (!legacyResults) return { migrated: 0 };

  const results: LegacyResult[] = JSON.parse(legacyResults);

  // 2. 닉네임별로 아이 생성
  const childMap = new Map<string, string>(); // nickname → child_id

  for (const result of results) {
    const nickname = result.basicInfo.nickname;

    if (!childMap.has(nickname)) {
      // 아이 프로필 생성
      const { data: child } = await supabase
        .from('children')
        .insert({
          user_id: userId,
          nickname,
          age: result.basicInfo.age,
          activities: result.basicInfo.activities || [],
          hobbies: result.basicInfo.hobbies || [],
          // ...
        })
        .select()
        .single();

      if (child) {
        childMap.set(nickname, child.id);
      }
    }
  }

  // 3. 검사 결과 마이그레이션
  let migrated = 0;
  for (const result of results) {
    const childId = childMap.get(result.basicInfo.nickname);
    if (!childId) continue;

    const { error } = await supabase
      .from('assessments')
      .insert({
        child_id: childId,
        mode: 'full', // 기존 데이터는 기본값
        scores: result.scores,
        top_categories: result.topCategories,
        ib_profiles: result.ibProfiles,
        ai_insights: result.aiInsights,
        created_at: result.timestamp,
      });

    if (!error) migrated++;
  }

  // 4. 마이그레이션 완료 후 localStorage 백업 표시
  localStorage.setItem('child-future-results-migrated', 'true');

  return { migrated, total: results.length };
}
```

### 7.2 마이그레이션 UI

```typescript
// app/migration/page.tsx
'use client';

import { useState } from 'react';
import { migrateLocalStorageToSupabase } from '@/lib/utils/migration';

export default function MigrationPage() {
  const [status, setStatus] = useState<'idle' | 'migrating' | 'done' | 'error'>('idle');
  const [result, setResult] = useState<{ migrated: number; total: number } | null>(null);

  const handleMigrate = async () => {
    setStatus('migrating');
    try {
      // 현재 사용자 ID 가져오기
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('로그인이 필요합니다');

      const result = await migrateLocalStorageToSupabase(user.id);
      setResult(result);
      setStatus('done');
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">데이터 마이그레이션</h1>

      {status === 'idle' && (
        <button onClick={handleMigrate} className="btn btn-primary">
          기존 데이터 가져오기
        </button>
      )}

      {status === 'migrating' && <p>마이그레이션 중...</p>}

      {status === 'done' && result && (
        <p className="text-green-600">
          {result.total}개 중 {result.migrated}개 마이그레이션 완료!
        </p>
      )}
    </div>
  );
}
```

---

## 8. 보안 체크리스트

### 8.1 Supabase RLS

- [x] 모든 테이블에 RLS 활성화
- [x] 사용자별 데이터 격리 정책
- [x] 시스템 테이블 읽기 전용 정책

### 8.2 API 보안

- [ ] Rate limiting 설정 (Vercel Edge Config)
- [ ] API 키 환경 변수 분리
- [ ] CORS 설정

### 8.3 인증 보안

- [ ] 비밀번호 정책 설정
- [ ] 세션 만료 시간 설정
- [ ] OAuth 프로바이더 설정

### 8.4 데이터 보안

- [ ] 민감 데이터 암호화
- [ ] 이미지 업로드 크기 제한
- [ ] SQL Injection 방지 (Supabase 자체 처리)

---

## 9. 성능 최적화

### 9.1 데이터베이스

```sql
-- 자주 사용되는 쿼리용 복합 인덱스
CREATE INDEX idx_assessments_child_created
  ON public.assessments(child_id, created_at DESC);

CREATE INDEX idx_diary_child_date
  ON public.diary_entries(child_id, date DESC);

-- 통계 쿼리용 Materialized View (선택적)
CREATE MATERIALIZED VIEW child_stats AS
SELECT
  child_id,
  COUNT(DISTINCT a.id) as assessment_count,
  COUNT(DISTINCT b.id) as badge_count,
  COUNT(DISTINCT d.id) as diary_count
FROM children c
LEFT JOIN assessments a ON a.child_id = c.id
LEFT JOIN badges b ON b.child_id = c.id
LEFT JOIN diary_entries d ON d.child_id = c.id
GROUP BY child_id;
```

### 9.2 Vercel Edge Functions

```typescript
// API Route를 Edge로 최적화
export const runtime = 'edge';
export const preferredRegion = 'icn1'; // 서울 리전
```

### 9.3 이미지 최적화

```typescript
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};
```

---

## 10. 개발 환경 설정

### 10.1 필요한 패키지

```bash
# Supabase
npm install @supabase/supabase-js @supabase/ssr

# 개발 도구
npm install -D supabase
```

### 10.2 로컬 개발

```bash
# Supabase 로컬 실행 (선택적)
npx supabase start

# 개발 서버
npm run dev
```

### 10.3 테스트 데이터 시드

```sql
-- seed.sql
-- 미션 템플릿 시드 데이터
INSERT INTO public.mission_templates (id, title, description, target_ib_profile, target_category, difficulty, badge_name, badge_icon, badge_tier)
VALUES
  ('inq-001', '궁금한 거 3가지 질문하기', '오늘 하루 동안 "왜?"라고 3번 이상 질문해보세요', 'Inquirer', 'analytical', 'easy', '호기심 탐험가', '🔍', 'bronze'),
  ('inq-002', '실험 관찰 일지 작성', '간단한 실험을 하고 결과를 기록해보세요', 'Inquirer', 'analytical', 'medium', '꼬마 과학자', '🔬', 'silver'),
  ('risk-001', '처음 해보는 것 도전하기', '한 번도 해보지 않은 새로운 활동에 도전해보세요', 'Risk-taker', 'leadership', 'medium', '용감한 도전자', '🚀', 'bronze'),
  ('care-001', '친구에게 친절하게 대하기', '오늘 친구 한 명에게 도움을 주거나 친절하게 대해보세요', 'Caring', 'caring', 'easy', '따뜻한 마음', '❤️', 'bronze'),
  ('ref-001', '오늘의 일기 쓰기', '오늘 있었던 일과 내 기분을 일기로 써보세요', 'Reflective', 'analytical', 'easy', '생각 기록가', '📝', 'bronze');

-- 대화 카드 시드 데이터
INSERT INTO public.conversation_cards (id, question, situation, target_ib_profile, follow_up_tips, category)
VALUES
  ('meal-inq-001', '오늘 학교에서 제일 궁금했던 건 뭐야?', 'meal', 'Inquirer', ARRAY['그래서 어떻게 됐어?', '선생님한테 물어봤어?'], 'question'),
  ('bed-ref-001', '오늘 하루 중 제일 뿌듯했던 순간은?', 'bedtime', 'Reflective', ARRAY['왜 그게 뿌듯했어?', '내일도 그런 기분 느끼고 싶으면 뭘 하면 좋을까?'], 'reflection'),
  ('travel-think-001', '저기 있는 건물은 왜 저렇게 생겼을까?', 'travel', 'Thinker', ARRAY['다르게 만들면 어떨 것 같아?', '네가 만든다면 어떻게 만들겠어?'], 'question'),
  ('play-risk-001', '새로운 놀이 방법을 만들어볼까?', 'play', 'Risk-taker', ARRAY['규칙을 바꿔볼까?', '다른 도구를 써보면 어떨까?'], 'activity');
```

---

## 문서 끝

이 문서는 Supabase + Vercel 기반 기술 인프라 설계서입니다.
실제 구현 시 Supabase Dashboard에서 SQL을 실행하여 스키마를 생성합니다.
