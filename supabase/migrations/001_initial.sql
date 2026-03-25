-- ============================================================
-- XERON ENGINE — Initiale Datenbankstruktur
-- ============================================================

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE profiles (
  id          UUID REFERENCES auth.users(id) PRIMARY KEY,
  email       TEXT NOT NULL,
  plan        TEXT NOT NULL DEFAULT 'free'
                CHECK (plan IN ('free', 'starter', 'pro', 'enterprise')),
  credits     INTEGER NOT NULL DEFAULT 10,
  stripe_customer_id TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PROJECTS
-- ============================================================
CREATE TABLE projects (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  prompt       TEXT NOT NULL,
  game_type    TEXT DEFAULT 'custom',
  quality      TEXT DEFAULT 'standard'
                 CHECK (quality IN ('standard', 'highend')),
  status       TEXT DEFAULT 'pending'
                 CHECK (status IN ('pending', 'generating', 'done', 'error')),
  lua_output   TEXT,
  summary      TEXT,
  controls_info TEXT,
  is_public    BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- GENERATIONS
-- ============================================================
CREATE TABLE generations (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id   UUID REFERENCES projects(id) ON DELETE CASCADE,
  steps_json   JSONB,
  tokens_used  INTEGER,
  cost_usd     DECIMAL(10, 6),
  ai_model     TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CREDIT TRANSACTIONS
-- ============================================================
CREATE TABLE credit_transactions (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type             TEXT CHECK (type IN ('purchase', 'usage', 'monthly_reset', 'bonus')),
  amount           INTEGER NOT NULL,
  balance_after    INTEGER NOT NULL,
  description      TEXT,
  stripe_payment_id TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PLUGIN SESSIONS
-- ============================================================
CREATE TABLE plugin_sessions (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  last_ping     TIMESTAMPTZ DEFAULT NOW(),
  expires_at    TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days'
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects           ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations        ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE plugin_sessions    ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- POLICIES
-- ============================================================

-- Profiles: nur eigenes Profil
CREATE POLICY "own_profile" ON profiles
  FOR ALL USING (auth.uid() = id);

-- Projects: nur eigene Projekte
CREATE POLICY "own_projects" ON projects
  FOR ALL USING (auth.uid() = user_id);

-- Projects: öffentliche Projekte lesbar
CREATE POLICY "public_projects" ON projects
  FOR SELECT USING (is_public = TRUE);

-- Generations: nur eigene (via project)
CREATE POLICY "own_generations" ON generations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = generations.project_id
        AND projects.user_id = auth.uid()
    )
  );

-- Credit Transactions: nur eigene
CREATE POLICY "own_credits" ON credit_transactions
  FOR ALL USING (auth.uid() = user_id);

-- Plugin Sessions: nur eigene
CREATE POLICY "own_plugin_sessions" ON plugin_sessions
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- TRIGGER: Neues Auth-User -> Profile anlegen
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, email, plan, credits)
  VALUES (
    NEW.id,
    NEW.email,
    'free',
    10
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- TRIGGER: Credit-Kauf -> Transaktion loggen
-- ============================================================
CREATE OR REPLACE FUNCTION log_credit_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Nur loggen wenn sich credits geändert haben
  IF OLD.credits IS DISTINCT FROM NEW.credits THEN
    INSERT INTO credit_transactions (
      user_id,
      type,
      amount,
      balance_after,
      description
    ) VALUES (
      NEW.id,
      CASE
        WHEN NEW.credits > OLD.credits THEN 'purchase'
        ELSE 'usage'
      END,
      NEW.credits - OLD.credits,
      NEW.credits,
      'Automatisch geloggt'
    );
  END IF;
  RETURN NEW;
END;
$$;

-- ============================================================
-- INDIZES für Performance
-- ============================================================
CREATE INDEX idx_projects_user_id    ON projects(user_id);
CREATE INDEX idx_projects_status     ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_generations_project ON generations(project_id);
CREATE INDEX idx_credits_user_id     ON credit_transactions(user_id);
CREATE INDEX idx_credits_created_at  ON credit_transactions(created_at DESC);
CREATE INDEX idx_plugin_sessions_token ON plugin_sessions(session_token);
CREATE INDEX idx_plugin_sessions_user  ON plugin_sessions(user_id);
