-- Seed Data for Every Nation Rewards Tracker (Idempotent)

-- Initial Activities
INSERT INTO activities (name, points, day_of_week, limit_per_week, reference_image_path, description) VALUES
('Breaking Army (Saturday)', 5, 'Saturday', 1, '/references/Breaking Army.png', 'Participate in the Breaking Army event on Saturday.'),
('Breaking Army (Sunday)', 5, 'Sunday', 1, '/references/Breaking Army.png', 'Participate in the Breaking Army event on Sunday.'),
('Guild Heroes Realm', 5, NULL, 1, '/references/Guild Heroe''s Realm.png', 'Participate in Guild Heroes Realm once per week.'),
('Guild Party', 5, NULL, 1, '/references/Guild Party.png', 'Participate in Guild Party once per week.'),
('Guild War (Saturday)', 5, 'Saturday', 1, '/references/Guild War.png', 'Participate in the Guild War on Saturday.'),
('Guild War (Sunday)', 5, 'Sunday', 1, '/references/Guild War.png', 'Participate in the Guild War on Sunday.'),
('Reach 2,000 Weekly Activity', 10, NULL, 1, '/references/Weekly Activity Points.png', 'Reach 2,000 weekly activity points in the guild.')
ON CONFLICT DO NOTHING;

-- Initial Rewards
INSERT INTO rewards (name, description, cost, image_url) VALUES
('Monthly Pass', 'In-game Monthly Pass', 300, NULL),
('Battle Pass', 'In-game Battle Pass', 500, NULL),
('Premium Battle Pass', 'In-game Premium Battle Pass', 1000, NULL)
ON CONFLICT DO NOTHING;

-- Initial Settings
INSERT INTO settings (key, value) VALUES
('min_redemption_amount', '300'),
('referral_bonus', '50'),
('program_status', '"active"')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
