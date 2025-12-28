-- Child Future Complete Database Schema
-- Run this SQL in Supabase SQL Editor to set up the database

-- ============================================
-- 1. ENUM TYPES
-- ============================================

DO $$ BEGIN
  CREATE TYPE assessment_mode AS ENUM ('quick', 'full', 'extend');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE career_category AS ENUM ('creative', 'analytical', 'caring', 'leadership', 'practical');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE ib_profile AS ENUM (
    'Inquirer', 'Knowledgeable', 'Thinker', 'Communicator', 'Principled',
    'Open-minded', 'Caring', 'Risk-taker', 'Balanced', 'Reflective'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE goal_status AS ENUM ('active', 'completed', 'abandoned');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE mission_difficulty AS ENUM ('easy', 'medium', 'hard');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE badge_tier AS ENUM ('bronze', 'silver', 'gold');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE mission_status AS ENUM ('in_progress', 'completed', 'skipped');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE activity_level AS ENUM ('high', 'medium', 'low');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE weekly_mood AS ENUM ('great', 'good', 'okay', 'notgood', 'bad');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE conversation_situation AS ENUM ('meal', 'bedtime', 'travel', 'play', 'anytime');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE conversation_category AS ENUM ('question', 'activity', 'reflection');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE report_period_type AS ENUM ('monthly', 'quarterly', 'yearly');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE gender_type AS ENUM ('male', 'female', 'prefer-not-to-say');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================
-- 2. HELPER FUNCTIONS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 3. PROFILES TABLE (for auth.users)
-- ============================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255),
  display_name VARCHAR(100),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. FAMILIES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_code VARCHAR(8) UNIQUE NOT NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_families_code ON families(family_code);
CREATE INDEX IF NOT EXISTS idx_families_owner ON families(owner_id);

ALTER TABLE families ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read families by family_code (for child login lookup)
CREATE POLICY "Anyone can lookup family by code"
ON families FOR SELECT
USING (true);

CREATE POLICY "Users can create families"
ON families FOR INSERT
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own families"
ON families FOR UPDATE
USING (owner_id = auth.uid());

CREATE POLICY "Users can delete their own families"
ON families FOR DELETE
USING (owner_id = auth.uid());

DROP TRIGGER IF EXISTS update_families_updated_at ON families;
CREATE TRIGGER update_families_updated_at
BEFORE UPDATE ON families
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. CHILDREN TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  family_id UUID REFERENCES families(id) ON DELETE SET NULL,
  nickname VARCHAR(50) NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 1 AND age <= 20),
  grade VARCHAR(20),
  gender gender_type,
  activities TEXT[] DEFAULT '{}',
  hobbies TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  strong_subjects TEXT[] DEFAULT '{}',
  achievements TEXT[] DEFAULT '{}',
  likes TEXT[] DEFAULT '{}',
  dream_jobs TEXT[] DEFAULT '{}',
  dislikes TEXT[] DEFAULT '{}',
  avatar_url TEXT,
  pin_hash VARCHAR(255),
  pin_attempts INTEGER DEFAULT 0,
  pin_locked_until TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_children_user ON children(user_id);
CREATE INDEX IF NOT EXISTS idx_children_family ON children(family_id);

ALTER TABLE children ENABLE ROW LEVEL SECURITY;

-- Allow family lookup to see children (for child login)
CREATE POLICY "Anyone can view children by family"
ON children FOR SELECT
USING (true);

CREATE POLICY "Users can create children"
ON children FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their children"
ON children FOR UPDATE
USING (
  user_id = auth.uid() OR
  family_id IN (SELECT id FROM families WHERE owner_id = auth.uid())
);

CREATE POLICY "Users can delete their children"
ON children FOR DELETE
USING (user_id = auth.uid());

DROP TRIGGER IF EXISTS update_children_updated_at ON children;
CREATE TRIGGER update_children_updated_at
BEFORE UPDATE ON children
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. CHILD SESSIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS child_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  device_fingerprint VARCHAR(255),
  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_child_sessions_token ON child_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_child_sessions_child ON child_sessions(child_id);
CREATE INDEX IF NOT EXISTS idx_child_sessions_expires ON child_sessions(expires_at);

ALTER TABLE child_sessions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous access for child login flow
CREATE POLICY "Anyone can manage child sessions"
ON child_sessions FOR ALL
USING (true)
WITH CHECK (true);

-- Function to clean expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_child_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM child_sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 7. ASSESSMENTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  mode assessment_mode NOT NULL,
  scores JSONB NOT NULL DEFAULT '{}',
  top_categories career_category[] DEFAULT '{}',
  ib_profiles ib_profile[] DEFAULT '{}',
  ib_profile_analysis TEXT,
  ai_insights TEXT,
  development_tips TEXT,
  consultation_feedback JSONB,
  responses JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assessments_child ON assessments(child_id);
CREATE INDEX IF NOT EXISTS idx_assessments_created ON assessments(created_at DESC);

ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view assessments for their children"
ON assessments FOR SELECT
USING (
  child_id IN (SELECT id FROM children WHERE user_id = auth.uid()) OR
  child_id IN (SELECT c.id FROM children c JOIN families f ON c.family_id = f.id WHERE f.owner_id = auth.uid())
);

CREATE POLICY "Users can create assessments for their children"
ON assessments FOR INSERT
WITH CHECK (
  child_id IN (SELECT id FROM children WHERE user_id = auth.uid()) OR
  child_id IN (SELECT c.id FROM children c JOIN families f ON c.family_id = f.id WHERE f.owner_id = auth.uid())
);

-- ============================================
-- 8. GOALS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
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

CREATE INDEX IF NOT EXISTS idx_goals_child ON goals(child_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON goals(status);

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage goals for their children"
ON goals FOR ALL
USING (
  child_id IN (SELECT id FROM children WHERE user_id = auth.uid()) OR
  child_id IN (SELECT c.id FROM children c JOIN families f ON c.family_id = f.id WHERE f.owner_id = auth.uid())
);

DROP TRIGGER IF EXISTS update_goals_updated_at ON goals;
CREATE TRIGGER update_goals_updated_at
BEFORE UPDATE ON goals
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 9. MISSION TEMPLATES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS mission_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  target_ib_profile ib_profile NOT NULL,
  target_category career_category NOT NULL,
  difficulty mission_difficulty DEFAULT 'medium',
  estimated_time VARCHAR(50),
  badge_name VARCHAR(100) NOT NULL,
  badge_icon VARCHAR(50) NOT NULL,
  badge_tier badge_tier DEFAULT 'bronze',
  age_min INTEGER DEFAULT 5,
  age_max INTEGER DEFAULT 15,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mission_templates_active ON mission_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_mission_templates_profile ON mission_templates(target_ib_profile);

ALTER TABLE mission_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active mission templates"
ON mission_templates FOR SELECT
USING (is_active = true);

-- ============================================
-- 10. MISSION PROGRESS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS mission_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  mission_id UUID REFERENCES mission_templates(id) ON DELETE CASCADE,
  status mission_status DEFAULT 'in_progress',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  reflection TEXT,
  parent_verified BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_mission_progress_child ON mission_progress(child_id);
CREATE INDEX IF NOT EXISTS idx_mission_progress_status ON mission_progress(status);

ALTER TABLE mission_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage mission progress for their children"
ON mission_progress FOR ALL
USING (
  child_id IN (SELECT id FROM children WHERE user_id = auth.uid()) OR
  child_id IN (SELECT c.id FROM children c JOIN families f ON c.family_id = f.id WHERE f.owner_id = auth.uid())
);

-- ============================================
-- 11. BADGES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  mission_id UUID REFERENCES mission_templates(id) ON DELETE SET NULL,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50) NOT NULL,
  tier badge_tier NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_badges_child ON badges(child_id);

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage badges for their children"
ON badges FOR ALL
USING (
  child_id IN (SELECT id FROM children WHERE user_id = auth.uid()) OR
  child_id IN (SELECT c.id FROM children c JOIN families f ON c.family_id = f.id WHERE f.owner_id = auth.uid())
);

-- ============================================
-- 12. CHECK-INS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  child_activity_level activity_level,
  child_favorite_activity TEXT,
  child_weekly_mood weekly_mood,
  child_free_note TEXT,
  parent_noticeable_changes TEXT,
  parent_completed_activities TEXT[] DEFAULT '{}',
  parent_special_episode TEXT,
  parent_photos TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_check_ins_child ON check_ins(child_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_week ON check_ins(week_start);

ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage check-ins for their children"
ON check_ins FOR ALL
USING (
  child_id IN (SELECT id FROM children WHERE user_id = auth.uid()) OR
  child_id IN (SELECT c.id FROM children c JOIN families f ON c.family_id = f.id WHERE f.owner_id = auth.uid())
);

DROP TRIGGER IF EXISTS update_check_ins_updated_at ON check_ins;
CREATE TRIGGER update_check_ins_updated_at
BEFORE UPDATE ON check_ins
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 13. DIARY ENTRIES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS diary_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  activity_title VARCHAR(200) NOT NULL,
  activity_description TEXT,
  activity_photos TEXT[] DEFAULT '{}',
  child_reflection TEXT,
  parent_note TEXT,
  related_mission_id UUID REFERENCES mission_templates(id) ON DELETE SET NULL,
  related_goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
  ib_profile ib_profile,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_diary_entries_child ON diary_entries(child_id);
CREATE INDEX IF NOT EXISTS idx_diary_entries_date ON diary_entries(date DESC);

ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage diary entries for their children"
ON diary_entries FOR ALL
USING (
  child_id IN (SELECT id FROM children WHERE user_id = auth.uid()) OR
  child_id IN (SELECT c.id FROM children c JOIN families f ON c.family_id = f.id WHERE f.owner_id = auth.uid())
);

DROP TRIGGER IF EXISTS update_diary_entries_updated_at ON diary_entries;
CREATE TRIGGER update_diary_entries_updated_at
BEFORE UPDATE ON diary_entries
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 14. CONVERSATION CARDS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS conversation_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  situation conversation_situation NOT NULL,
  target_ib_profile ib_profile NOT NULL,
  follow_up_tips TEXT[] DEFAULT '{}',
  age_min INTEGER DEFAULT 5,
  age_max INTEGER DEFAULT 15,
  category conversation_category DEFAULT 'question',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversation_cards_active ON conversation_cards(is_active);
CREATE INDEX IF NOT EXISTS idx_conversation_cards_situation ON conversation_cards(situation);

ALTER TABLE conversation_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active conversation cards"
ON conversation_cards FOR SELECT
USING (is_active = true);

-- ============================================
-- 15. CONVERSATION HISTORY TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS conversation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  card_id UUID REFERENCES conversation_cards(id) ON DELETE CASCADE,
  used_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_conversation_history_child ON conversation_history(child_id);

ALTER TABLE conversation_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage conversation history for their children"
ON conversation_history FOR ALL
USING (
  child_id IN (SELECT id FROM children WHERE user_id = auth.uid()) OR
  child_id IN (SELECT c.id FROM children c JOIN families f ON c.family_id = f.id WHERE f.owner_id = auth.uid())
);

-- ============================================
-- 16. REPORTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  period_type report_period_type NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  assessment_comparison JSONB,
  activity_stats JSONB,
  ai_analysis JSONB NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_child ON reports(child_id);
CREATE INDEX IF NOT EXISTS idx_reports_period ON reports(period_start DESC);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage reports for their children"
ON reports FOR ALL
USING (
  child_id IN (SELECT id FROM children WHERE user_id = auth.uid()) OR
  child_id IN (SELECT c.id FROM children c JOIN families f ON c.family_id = f.id WHERE f.owner_id = auth.uid())
);

-- ============================================
-- 17. AUTO-CREATE PROFILE ON USER SIGNUP
-- ============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();

-- ============================================
-- COMPLETE!
-- ============================================
