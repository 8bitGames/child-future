-- Family Authentication System Migration
-- Creates tables for family accounts and child PIN-based authentication

-- 1. Create families table
CREATE TABLE IF NOT EXISTS families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_code VARCHAR(8) UNIQUE NOT NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add family-related columns to children table
ALTER TABLE children
ADD COLUMN IF NOT EXISTS family_id UUID REFERENCES families(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS pin_hash VARCHAR(255),
ADD COLUMN IF NOT EXISTS pin_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS pin_locked_until TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;

-- 3. Create child_sessions table for child device authentication
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

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_families_code ON families(family_code);
CREATE INDEX IF NOT EXISTS idx_families_owner ON families(owner_id);
CREATE INDEX IF NOT EXISTS idx_children_family ON children(family_id);
CREATE INDEX IF NOT EXISTS idx_child_sessions_token ON child_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_child_sessions_child ON child_sessions(child_id);
CREATE INDEX IF NOT EXISTS idx_child_sessions_expires ON child_sessions(expires_at);

-- 5. Enable Row Level Security
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_sessions ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for families table
CREATE POLICY "Users can view their own families"
ON families FOR SELECT
USING (owner_id = auth.uid());

CREATE POLICY "Users can create families"
ON families FOR INSERT
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own families"
ON families FOR UPDATE
USING (owner_id = auth.uid());

CREATE POLICY "Users can delete their own families"
ON families FOR DELETE
USING (owner_id = auth.uid());

-- 7. RLS Policies for child_sessions (allow anonymous access for child login)
CREATE POLICY "Anyone can create child sessions"
ON child_sessions FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view child sessions by token"
ON child_sessions FOR SELECT
USING (true);

CREATE POLICY "Anyone can update child sessions"
ON child_sessions FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete child sessions"
ON child_sessions FOR DELETE
USING (true);

-- 8. Update children RLS to include family-based access
DROP POLICY IF EXISTS "Family members can manage children" ON children;

CREATE POLICY "Users can manage children in their family"
ON children FOR ALL
USING (
  user_id = auth.uid() OR
  family_id IN (SELECT id FROM families WHERE owner_id = auth.uid())
);

-- 9. Function to clean expired sessions (can be called by cron)
CREATE OR REPLACE FUNCTION cleanup_expired_child_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM child_sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 11. Trigger for families updated_at
DROP TRIGGER IF EXISTS update_families_updated_at ON families;
CREATE TRIGGER update_families_updated_at
BEFORE UPDATE ON families
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
