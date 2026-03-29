-- ============================================================
-- XERON v7 — Multi-Platform Migration
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- ── 1. Add platform columns to profiles ──────────────────────
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS active_platform TEXT DEFAULT 'roblox'
    CHECK (active_platform IN ('roblox','unity','godot','unreal','mobile')),
  ADD COLUMN IF NOT EXISTS api_key_roblox  TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS api_key_unity   TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS api_key_godot   TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS api_key_unreal  TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS api_key_mobile  TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS avatar_url      TEXT,
  ADD COLUMN IF NOT EXISTS username        TEXT,
  ADD COLUMN IF NOT EXISTS streak_days     INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_generations INT DEFAULT 0;

-- ── 2. Add platform columns to projects ──────────────────────
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS platform TEXT DEFAULT 'roblox'
    CHECK (platform IN ('roblox','unity','godot','unreal','mobile')),
  ADD COLUMN IF NOT EXISTS output_language  TEXT DEFAULT 'lua',
  ADD COLUMN IF NOT EXISTS code_output      TEXT,
  ADD COLUMN IF NOT EXISTS image_references TEXT[];

-- ── 3. Platform revenue tracking ─────────────────────────────
CREATE TABLE IF NOT EXISTS platform_stats (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform          TEXT NOT NULL,
  date              DATE DEFAULT CURRENT_DATE,
  generations_count INT DEFAULT 0,
  credits_consumed  INT DEFAULT 0,
  active_users      INT DEFAULT 0,
  revenue_eur       DECIMAL(10,2) DEFAULT 0,
  UNIQUE(platform, date)
);

-- ── 4. Image uploads tracking ────────────────────────────────
CREATE TABLE IF NOT EXISTS user_uploads (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          UUID REFERENCES profiles(id) ON DELETE CASCADE,
  project_id       UUID REFERENCES projects(id)  ON DELETE CASCADE,
  storage_path     TEXT NOT NULL,
  public_url       TEXT NOT NULL,
  file_type        TEXT, -- 'reference', 'screenshot', 'asset', 'avatar'
  file_size_bytes  INT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── 5. Plugin session codes (6-char connection code flow) ────
CREATE TABLE IF NOT EXISTS plugin_connection_codes (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  code        TEXT NOT NULL UNIQUE,   -- e.g. 'XR-7K3M'
  platform    TEXT NOT NULL,
  connected   BOOLEAN DEFAULT FALSE,
  session_token TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  expires_at  TIMESTAMPTZ DEFAULT NOW() + INTERVAL '10 minutes'
);

-- ── 6. Pending code insertions (plugin polling) ──────────────
CREATE TABLE IF NOT EXISTS pending_insertions (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_token TEXT,
  code          TEXT NOT NULL,
  language      TEXT NOT NULL,
  project_name  TEXT,
  status        TEXT DEFAULT 'pending',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  expires_at    TIMESTAMPTZ DEFAULT NOW() + INTERVAL '5 minutes'
);

-- ── 7. Purchase consents (Stripe waiver) ─────────────────────
CREATE TABLE IF NOT EXISTS purchase_consents (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  amount_eur   DECIMAL(10,2),
  waiver_text  TEXT NOT NULL,
  terms_accepted BOOLEAN DEFAULT TRUE,
  ip_address   TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── 8. RLS Policies ──────────────────────────────────────────
ALTER TABLE platform_stats       ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_uploads         ENABLE ROW LEVEL SECURITY;
ALTER TABLE plugin_connection_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_insertions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_consents    ENABLE ROW LEVEL SECURITY;

-- Users can only see their own uploads
CREATE POLICY IF NOT EXISTS "own uploads"
  ON user_uploads FOR ALL
  USING (auth.uid() = user_id);

-- Users can only see their own connection codes
CREATE POLICY IF NOT EXISTS "own connection codes"
  ON plugin_connection_codes FOR ALL
  USING (auth.uid() = user_id);

-- Users can only see their own consents
CREATE POLICY IF NOT EXISTS "own consents"
  ON purchase_consents FOR ALL
  USING (auth.uid() = user_id);

-- Platform stats: read-only for authenticated users
CREATE POLICY IF NOT EXISTS "platform stats read"
  ON platform_stats FOR SELECT
  USING (auth.role() = 'authenticated');

-- ── 9. Helper function: increment platform stats ─────────────
CREATE OR REPLACE FUNCTION increment_platform_stats(
  p_platform TEXT,
  p_credits  INT DEFAULT 1
) RETURNS VOID AS $$
BEGIN
  INSERT INTO platform_stats (platform, date, generations_count, credits_consumed)
  VALUES (p_platform, CURRENT_DATE, 1, p_credits)
  ON CONFLICT (platform, date)
  DO UPDATE SET
    generations_count = platform_stats.generations_count + 1,
    credits_consumed  = platform_stats.credits_consumed  + p_credits;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
