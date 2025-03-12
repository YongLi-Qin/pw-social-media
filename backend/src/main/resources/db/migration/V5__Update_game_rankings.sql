-- First, delete existing VALORANT rankings
DELETE FROM game_rankings WHERE game_type = 'VALORANT';

-- Then insert the new subdivided rankings for VALORANT
INSERT INTO game_rankings (game_type, ranking_name, ranking_score, ranking_type) VALUES
-- Iron ranks
('VALORANT', 'Iron 1', 0, 'TIER'),
('VALORANT', 'Iron 2', 100, 'TIER'),
('VALORANT', 'Iron 3', 200, 'TIER'),

-- Bronze ranks
('VALORANT', 'Bronze 1', 300, 'TIER'),
('VALORANT', 'Bronze 2', 400, 'TIER'),
('VALORANT', 'Bronze 3', 500, 'TIER'),

-- Silver ranks
('VALORANT', 'Silver 1', 600, 'TIER'),
('VALORANT', 'Silver 2', 700, 'TIER'),
('VALORANT', 'Silver 3', 800, 'TIER'),

-- Gold ranks
('VALORANT', 'Gold 1', 900, 'TIER'),
('VALORANT', 'Gold 2', 1000, 'TIER'),
('VALORANT', 'Gold 3', 1100, 'TIER'),

-- Platinum ranks
('VALORANT', 'Platinum 1', 1200, 'TIER'),
('VALORANT', 'Platinum 2', 1300, 'TIER'),
('VALORANT', 'Platinum 3', 1400, 'TIER'),

-- Diamond ranks
('VALORANT', 'Diamond 1', 1500, 'TIER'),
('VALORANT', 'Diamond 2', 1600, 'TIER'),
('VALORANT', 'Diamond 3', 1700, 'TIER'),

-- Ascendant ranks
('VALORANT', 'Ascendant 1', 1800, 'TIER'),
('VALORANT', 'Ascendant 2', 1900, 'TIER'),
('VALORANT', 'Ascendant 3', 2000, 'TIER'),

-- Immortal ranks
('VALORANT', 'Immortal 1', 2100, 'TIER'),
('VALORANT', 'Immortal 2', 2200, 'TIER'),
('VALORANT', 'Immortal 3', 2300, 'TIER'),

-- Radiant (single rank)
('VALORANT', 'Radiant', 2400, 'TIER'); 