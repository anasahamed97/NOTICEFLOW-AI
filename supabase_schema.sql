-- ====================================================================
-- NOTICEFLOW AI - SUPABASE (POSTGRESQL) DATABASE SCHEMA
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ====================================================================

-- 1. NOTICES TABLE (Stores uploaded circulars and multilingual summaries)
CREATE TABLE IF NOT EXISTS public.notices (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    thumbnail TEXT,
    events_count INT DEFAULT 0,
    summary TEXT,
    kannada_summary TEXT,
    hindi_summary TEXT,
    status TEXT DEFAULT 'confirmed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. EVENTS TABLE (Stores extracted academic events, dates, cutoffs)
CREATE TABLE IF NOT EXISTS public.events (
    id TEXT PRIMARY KEY,
    notice_id TEXT REFERENCES public.notices(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    event_type TEXT DEFAULT 'Other', -- 'Exam', 'Assignment', 'Registration', 'Event', 'Other'
    date TEXT NOT NULL,              -- YYYY-MM-DD
    time TEXT,                       -- HH:MM or NULL
    deadline TEXT,                   -- YYYY-MM-DD or NULL
    venue TEXT,                      -- Exam hall, link, etc.
    priority TEXT DEFAULT 'Normal',  -- 'Urgent', 'Important', 'Normal'
    reminder_days JSONB DEFAULT '[7, 3, 1]'::jsonb,
    source_text TEXT,
    is_uncertain BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ACTIVITIES TABLE (Audit feed of system events)
CREATE TABLE IF NOT EXISTS public.activities (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create helpful query indexes
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);
CREATE INDEX IF NOT EXISTS idx_events_deadline ON public.events(deadline);
CREATE INDEX IF NOT EXISTS idx_events_notice_id ON public.events(notice_id);
CREATE INDEX IF NOT EXISTS idx_notices_uploaded_at ON public.notices(uploaded_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Allow Public/Anon access for MVP operation (Read, Insert, Update, Delete)
CREATE POLICY "Allow public read access on notices" ON public.notices FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on notices" ON public.notices FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on notices" ON public.notices FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on notices" ON public.notices FOR DELETE USING (true);

CREATE POLICY "Allow public read access on events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on events" ON public.events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on events" ON public.events FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on events" ON public.events FOR DELETE USING (true);

CREATE POLICY "Allow public read access on activities" ON public.activities FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on activities" ON public.activities FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete access on activities" ON public.activities FOR DELETE USING (true);
