-- ═══════════════════════════════════════════════════════════════
--  XERON ENGINE v7 — Complete Database Schema
-- ═══════════════════════════════════════════════════════════════

-- PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  username TEXT UNIQUE,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free','starter','pro','enterprise')),
  credits INT DEFAULT 10,
  purchased_credits INT DEFAULT 0,
  stripe_customer_id TEXT,
  discord_id TEXT UNIQUE,
  discord_credits_claimed BOOLEAN DEFAULT FALSE,
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES profiles(id),
  referral_count INT DEFAULT 0,
  affiliate_code TEXT UNIQUE,
  affiliate_earnings_eur DECIMAL(10,2) DEFAULT 0,
  streak_days INT DEFAULT 0,
  last_active_date DATE,
  total_generations INT DEFAULT 0,
  api_key TEXT UNIQUE,
  api_calls_this_month INT DEFAULT 0,
  newsletter_opted_in BOOLEAN DEFAULT FALSE,
  credits_reset_at TIMESTAMPTZ DEFAULT (NOW()+INTERVAL '1 month'),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  preferred_language TEXT DEFAULT 'en',
  social_credits_claimed JSONB DEFAULT '{}',
  promo_code_used TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROJECTS
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  prompt TEXT NOT NULL,
  mode TEXT DEFAULT 'game' CHECK (mode IN ('game','script','ui','fix','clean','diagnose')),
  game_type TEXT,
  quality TEXT DEFAULT 'standard',
  style_preset TEXT DEFAULT 'none',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','generating','done','error')),
  lua_output TEXT,
  summary TEXT,
  controls_info TEXT,
  script_description TEXT,
  diagnosis_result JSONB,
  minimap_data JSONB,
  version INT DEFAULT 1,
  parent_id UUID REFERENCES projects(id),
  is_public BOOLEAN DEFAULT FALSE,
  likes INT DEFAULT 0,
  view_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- GENERATIONS
CREATE TABLE IF NOT EXISTS generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  steps_json JSONB,
  tokens_used INT,
  cost_usd DECIMAL(10,6),
  ai_model TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CREDIT TRANSACTIONS
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('purchase','usage','reset','bonus','referral','streak','affiliate','api','promo','social_bonus','coupon')),
  amount INT NOT NULL,
  balance_after INT NOT NULL,
  description TEXT,
  stripe_payment_id TEXT,
  coupon_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- LEGAL CONSENTS
CREATE TABLE IF NOT EXISTS user_consents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL CHECK (consent_type IN (
    'cookie_essential','cookie_analytics','cookie_marketing',
    'withdrawal_waiver','terms_of_service','privacy_policy',
    'newsletter','age_confirmation'
  )),
  granted BOOLEAN NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  page_url TEXT,
  granted_at TIMESTAMPTZ DEFAULT NOW()
);

-- PURCHASE CONSENTS (per transaction)
CREATE TABLE IF NOT EXISTS purchase_consents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  stripe_payment_id TEXT,
  product_name TEXT,
  amount_eur DECIMAL(10,2),
  withdrawal_waiver_accepted BOOLEAN NOT NULL DEFAULT FALSE,
  waiver_text TEXT,
  terms_accepted BOOLEAN NOT NULL DEFAULT FALSE,
  ip_address TEXT,
  user_agent TEXT,
  accepted_at TIMESTAMPTZ DEFAULT NOW()
);

-- SOCIAL CREDIT REQUESTS
CREATE TABLE IF NOT EXISTS social_credit_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  platforms JSONB NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  credits_granted INT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT,
  title TEXT,
  message TEXT,
  action_url TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- ACTION HISTORY
CREATE TABLE IF NOT EXISTS action_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  action_type TEXT,
  project_id UUID,
  lua_snapshot TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI CHAT MESSAGES
CREATE TABLE IF NOT EXISTS ai_chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  role TEXT CHECK (role IN ('user','assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AFFILIATE REFERRALS
CREATE TABLE IF NOT EXISTS affiliate_referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID REFERENCES profiles(id),
  referred_user_id UUID REFERENCES profiles(id),
  stripe_payment_id TEXT,
  commission_eur DECIMAL(10,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','paid','cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- API USAGE
CREATE TABLE IF NOT EXISTS api_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  endpoint TEXT,
  credits_used INT,
  ai_model TEXT,
  tokens_used INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RATE LIMITS
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT,
  user_id UUID,
  action TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS rate_limits_ip_idx ON rate_limits(ip_address, created_at);

-- CHANGELOG
CREATE TABLE IF NOT EXISTS changelog (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  version TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  changes JSONB,
  published_at TIMESTAMPTZ DEFAULT NOW()
);

-- STATUS CHECKS
CREATE TABLE IF NOT EXISTS status_checks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service TEXT NOT NULL,
  status TEXT CHECK (status IN ('operational','degraded','down')),
  message TEXT,
  checked_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ ROW LEVEL SECURITY ═══════════════════════════════════════

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_credit_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE changelog ENABLE ROW LEVEL SECURITY;
ALTER TABLE status_checks ENABLE ROW LEVEL SECURITY;

-- Profiles: own row only
CREATE POLICY "profiles_own" ON profiles FOR ALL USING (auth.uid() = id);

-- Projects: own rows + public projects readable by all
CREATE POLICY "projects_own" ON projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "projects_public_read" ON projects FOR SELECT USING (is_public = TRUE);

-- Credit transactions: own rows
CREATE POLICY "credit_tx_own" ON credit_transactions FOR ALL USING (auth.uid() = user_id);

-- Consents: own rows
CREATE POLICY "consents_own" ON user_consents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "purchase_consents_own" ON purchase_consents FOR ALL USING (auth.uid() = user_id);

-- Social credit requests: own rows
CREATE POLICY "social_requests_own" ON social_credit_requests FOR ALL USING (auth.uid() = user_id);

-- Notifications: own rows
CREATE POLICY "notifications_own" ON notifications FOR ALL USING (auth.uid() = user_id);

-- Achievements: own rows
CREATE POLICY "achievements_own" ON achievements FOR ALL USING (auth.uid() = user_id);

-- Action history: own rows
CREATE POLICY "action_history_own" ON action_history FOR ALL USING (auth.uid() = user_id);

-- AI chat: own rows
CREATE POLICY "ai_chat_own" ON ai_chat_messages FOR ALL USING (auth.uid() = user_id);

-- Affiliate: own rows
CREATE POLICY "affiliate_own" ON affiliate_referrals FOR ALL USING (auth.uid() = affiliate_id OR auth.uid() = referred_user_id);

-- API usage: own rows
CREATE POLICY "api_usage_own" ON api_usage FOR ALL USING (auth.uid() = user_id);

-- Public readable tables
CREATE POLICY "changelog_public" ON changelog FOR SELECT USING (TRUE);
CREATE POLICY "status_public" ON status_checks FOR SELECT USING (TRUE);

-- ═══ TRIGGERS ═════════════════════════════════════════════════

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  ref_code TEXT;
  aff_code TEXT;
BEGIN
  ref_code := 'XR' || upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 8));
  aff_code := 'XA' || upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 8));
  INSERT INTO profiles (id, email, referral_code, affiliate_code)
  VALUES (NEW.id, NEW.email, ref_code, aff_code);
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ═══ SEED DATA ════════════════════════════════════════════════

INSERT INTO changelog (version, title, description, changes) VALUES
('v7.0.0', 'XERON Engine v7 — Ultra-Luxury Edition', 'Complete redesign with Apple Liquid Glass aesthetic, 7-language support, improved AI routing and new credit system.', '["Apple Liquid Glass design system", "7 language support with auto-detection", "New credit system with packs", "Improved AI routing per plan", "Legal compliance (DSGVO, §356 BGB)", "Affiliate & social credit programs"]'),
('v6.5.0', 'High-End Graphics Mode', 'New Pro-exclusive High-End Graphics generation using Claude Sonnet for stunning visual results.', '["High-End Graphics mode for Pro+", "Claude Sonnet integration for premium quality", "Atmospheric lighting system", "Weather & particle effects"]'),
('v6.0.0', 'Multi-Language Support', 'Platform now available in 7 languages with automatic browser language detection.', '["7 language support (EN, DE, FR, ES, PT, JA, ZH)", "Auto browser language detection", "Language preference saved to profile", "Full UI translation"]')
ON CONFLICT DO NOTHING;

INSERT INTO status_checks (service, status, message) VALUES
('API', 'operational', 'All API endpoints responding normally'),
('AI Generation', 'operational', 'Claude and Gemini models fully operational'),
('Stripe Payments', 'operational', 'Payment processing normal'),
('Supabase Database', 'operational', 'Database responding normally'),
('CDN', 'operational', 'Content delivery normal'),
('Roblox Plugin Sync', 'operational', 'Plugin sync service operational')
ON CONFLICT DO NOTHING;
