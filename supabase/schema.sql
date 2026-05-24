-- ============================================================
-- Montage Pro Course Platform - Supabase Schema
-- Run this in Supabase SQL Editor
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── TOKENS ──────────────────────────────────────────────────
CREATE TABLE tokens (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  token         VARCHAR(128) UNIQUE NOT NULL,
  student_name  VARCHAR(255) NOT NULL,
  student_email VARCHAR(255),
  is_active     BOOLEAN DEFAULT true,
  max_sessions  INTEGER DEFAULT 1,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  expires_at    TIMESTAMPTZ,
  notes         TEXT
);

CREATE INDEX idx_tokens_token ON tokens(token);
CREATE INDEX idx_tokens_is_active ON tokens(is_active);

-- ── SESSIONS ────────────────────────────────────────────────
CREATE TABLE sessions (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  token_id     UUID REFERENCES tokens(id) ON DELETE CASCADE,
  session_key  VARCHAR(128) NOT NULL UNIQUE,
  ip_address   VARCHAR(45),
  user_agent   TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  last_active  TIMESTAMPTZ DEFAULT NOW(),
  is_active    BOOLEAN DEFAULT true
);

CREATE INDEX idx_sessions_token_id ON sessions(token_id);
CREATE INDEX idx_sessions_is_active ON sessions(is_active);
CREATE INDEX idx_sessions_last_active ON sessions(last_active);

-- ── ACCESS LOGS ─────────────────────────────────────────────
CREATE TABLE access_logs (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  token_id    UUID REFERENCES tokens(id) ON DELETE SET NULL,
  event_type  VARCHAR(50) NOT NULL,
  ip_address  VARCHAR(45),
  user_agent  TEXT,
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_access_logs_token_id ON access_logs(token_id);
CREATE INDEX idx_access_logs_created_at ON access_logs(created_at DESC);
CREATE INDEX idx_access_logs_event_type ON access_logs(event_type);

-- ── ROW LEVEL SECURITY ──────────────────────────────────────
-- All access goes through service_role key via API routes
-- Direct client access is not permitted

ALTER TABLE tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_logs ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS by default
-- No public policies needed since we use service_role key in API routes

-- ── AUTO-CLEANUP OLD SESSIONS (optional cron) ───────────────
-- You can schedule this in Supabase dashboard (pg_cron extension):
-- SELECT cron.schedule('cleanup-sessions', '*/30 * * * *',
--   $$UPDATE sessions SET is_active = false
--     WHERE is_active = true
--     AND last_active < NOW() - INTERVAL '10 minutes'$$);

-- ── SAMPLE DATA (optional - remove in production) ───────────
-- INSERT INTO tokens (token, student_name, student_email, max_sessions)
-- VALUES ('TEST_TOKEN_REPLACE_ME', 'طالب تجريبي', 'test@example.com', 1);
