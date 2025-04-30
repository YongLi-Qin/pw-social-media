USE social_media;

CREATE TABLE IF NOT EXISTS game_rankings (
                                             id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                             game_type VARCHAR(50) NOT NULL,
    ranking_name VARCHAR(50) NOT NULL,
    ranking_score INT,
    ranking_type VARCHAR(20) NOT NULL
    );

-- Insert League of Legends Rankings
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

-- Insert Valorant Subdivided Rankings (直接插细分)
INSERT INTO game_rankings (game_type, ranking_name, ranking_score, ranking_type) VALUES
                                                                                     ('VALORANT', 'Iron 1', 0, 'TIER'),
                                                                                     ('VALORANT', 'Iron 2', 100, 'TIER'),
                                                                                     ('VALORANT', 'Iron 3', 200, 'TIER'),
                                                                                     ('VALORANT', 'Bronze 1', 300, 'TIER'),
                                                                                     ('VALORANT', 'Bronze 2', 400, 'TIER'),
                                                                                     ('VALORANT', 'Bronze 3', 500, 'TIER'),
                                                                                     ('VALORANT', 'Silver 1', 600, 'TIER'),
                                                                                     ('VALORANT', 'Silver 2', 700, 'TIER'),
                                                                                     ('VALORANT', 'Silver 3', 800, 'TIER'),
                                                                                     ('VALORANT', 'Gold 1', 900, 'TIER'),
                                                                                     ('VALORANT', 'Gold 2', 1000, 'TIER'),
                                                                                     ('VALORANT', 'Gold 3', 1100, 'TIER'),
                                                                                     ('VALORANT', 'Platinum 1', 1200, 'TIER'),
                                                                                     ('VALORANT', 'Platinum 2', 1300, 'TIER'),
                                                                                     ('VALORANT', 'Platinum 3', 1400, 'TIER'),
                                                                                     ('VALORANT', 'Diamond 1', 1500, 'TIER'),
                                                                                     ('VALORANT', 'Diamond 2', 1600, 'TIER'),
                                                                                     ('VALORANT', 'Diamond 3', 1700, 'TIER'),
                                                                                     ('VALORANT', 'Ascendant 1', 1800, 'TIER'),
                                                                                     ('VALORANT', 'Ascendant 2', 1900, 'TIER'),
                                                                                     ('VALORANT', 'Ascendant 3', 2000, 'TIER'),
                                                                                     ('VALORANT', 'Immortal 1', 2100, 'TIER'),
                                                                                     ('VALORANT', 'Immortal 2', 2200, 'TIER'),
                                                                                     ('VALORANT', 'Immortal 3', 2300, 'TIER'),
                                                                                     ('VALORANT', 'Radiant', 2400, 'TIER');



ALTER TABLE posts ADD COLUMN ranking_id BIGINT;
ALTER TABLE posts ADD CONSTRAINT fk_post_ranking FOREIGN KEY (ranking_id) REFERENCES game_rankings(id);
