-- Migration 009: Experiment Event Tracking
-- Purpose: Persist A/B funnel events for conversion decisioning.

CREATE TABLE IF NOT EXISTS experiment_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experiment_key TEXT NOT NULL,
    event_name TEXT NOT NULL,
    variant TEXT NOT NULL,
    locale TEXT,
    template_id TEXT,
    intent TEXT,
    session_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_experiment_events_key_variant
    ON experiment_events (experiment_key, variant);

CREATE INDEX IF NOT EXISTS idx_experiment_events_created_at
    ON experiment_events (created_at DESC);

ALTER TABLE experiment_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert experiment events"
ON experiment_events FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated read experiment events"
ON experiment_events FOR SELECT
TO authenticated
USING (true);
