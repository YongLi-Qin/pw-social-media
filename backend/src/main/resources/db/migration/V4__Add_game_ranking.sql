-- 创建游戏排名表
CREATE TABLE IF NOT EXISTS game_rankings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    game_type VARCHAR(50) NOT NULL,
    ranking_name VARCHAR(50) NOT NULL,
    ranking_score INT,
    ranking_type VARCHAR(20) NOT NULL
);

-- League of Legends 排名
INSERT INTO game_rankings (game_type, ranking_name, ranking_score, ranking_type) VALUES
('LEAGUE_OF_LEGENDS', 'Iron', 0, 'TIER'),
('LEAGUE_OF_LEGENDS', 'Bronze', 400, 'TIER'),
('LEAGUE_OF_LEGENDS', 'Silver', 800, 'TIER'),
('LEAGUE_OF_LEGENDS', 'Gold', 1200, 'TIER'),
('LEAGUE_OF_LEGENDS', 'Platinum', 1600, 'TIER'),
('LEAGUE_OF_LEGENDS', 'Diamond', 2000, 'TIER'),
('LEAGUE_OF_LEGENDS', 'Master', 2400, 'TIER'),
('LEAGUE_OF_LEGENDS', 'Grandmaster', 2800, 'TIER'),
('LEAGUE_OF_LEGENDS', 'Challenger', 3200, 'TIER');

-- Valorant 排名
INSERT INTO game_rankings (game_type, ranking_name, ranking_score, ranking_type) VALUES
('VALORANT', 'Iron', 0, 'TIER'),
('VALORANT', 'Bronze', 300, 'TIER'),
('VALORANT', 'Silver', 600, 'TIER'),
('VALORANT', 'Gold', 900, 'TIER'),
('VALORANT', 'Platinum', 1200, 'TIER'),
('VALORANT', 'Diamond', 1500, 'TIER'),
('VALORANT', 'Ascendant', 1800, 'TIER'),
('VALORANT', 'Immortal', 2100, 'TIER'),
('VALORANT', 'Radiant', 2400, 'TIER');

-- 修改posts表添加ranking_id外键
ALTER TABLE posts ADD COLUMN ranking_id BIGINT;
ALTER TABLE posts ADD CONSTRAINT fk_post_ranking FOREIGN KEY (ranking_id) REFERENCES game_rankings(id); 