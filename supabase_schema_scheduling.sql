-- 9. Scheduling Events Table
CREATE TABLE IF NOT EXISTS scheduling_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  guild_id TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Member Availabilities Table
CREATE TABLE IF NOT EXISTS member_availabilities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES scheduling_events(id) ON DELETE CASCADE,
  discord_id TEXT NOT NULL,
  username TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE scheduling_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_availabilities ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view events & availabilities
CREATE POLICY "Everyone can view scheduling events" ON scheduling_events FOR SELECT USING (true);
CREATE POLICY "Everyone can view member availabilities" ON member_availabilities FOR SELECT USING (true);

-- Allow users to create events & availabilities
CREATE POLICY "Authenticated users can create scheduling events" ON scheduling_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Everyone can insert member availabilities" ON member_availabilities FOR INSERT WITH CHECK (true);
