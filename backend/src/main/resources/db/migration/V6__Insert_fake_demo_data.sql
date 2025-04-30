USE social_media;

-- Insert Users
INSERT INTO users (email, password, name, avatar) VALUES
                                                      ('alice@example.com', 'password', 'Alice', 'avatar1.png'),
                                                      ('bob@example.com', 'password', 'Bob', 'avatar2.png'),
                                                      ('charlie@example.com', 'password', 'Charlie', 'avatar3.png'),
                                                      ('david@example.com', 'password', 'David', 'avatar4.png'),
                                                      ('eve@example.com', 'password', 'Eve', 'avatar5.png');

-- Insert Posts
INSERT INTO posts (content, image_url, user_id, ranking_id, game_type) VALUES
                                                                           ('First post about League!', 'image1.png', 1, 1, 'LEAGUE_OF_LEGENDS'),
                                                                           ('Loving Valorant gameplay!', 'image2.png', 2, 15, 'VALORANT'),
                                                                           ('Ranked up today!', 'image3.png', 3, 20, 'VALORANT'),
                                                                           ('My best match so far!', 'image4.png', 4, 4, 'LEAGUE_OF_LEGENDS'),
                                                                           ('Reached Diamond!', 'image5.png', 5, 17, 'VALORANT'),
                                                                           ('Any team looking for players?', 'image6.png', 1, 23, 'VALORANT'),
                                                                           ('Check out this insane play!', 'image7.png', 2, 5, 'LEAGUE_OF_LEGENDS'),
                                                                           ('How to improve fast?', 'image8.png', 3, 8, 'LEAGUE_OF_LEGENDS'),
                                                                           ('Looking for duo queue', 'image9.png', 4, 9, 'LEAGUE_OF_LEGENDS'),
                                                                           ('New montage video uploaded!', 'image10.png', 5, 24, 'VALORANT');

-- Insert Comments
INSERT INTO comments (content, user_id, post_id) VALUES
                                                     ('Nice play!', 1, 1),
                                                     ('Congrats on ranking up!', 2, 2),
                                                     ('Awesome, keep going!', 3, 2),
                                                     ('Which agent do you main?', 4, 3),
                                                     ('That was clean!', 5, 4),
                                                     ('Any tips for climbing?', 1, 5),
                                                     ('I just dropped a rank lol', 2, 6),
                                                     ('Lets duo queue?', 3, 7),
                                                     ('Which server?', 4, 8),
                                                     ('What settings do you use?', 5, 9),
                                                     ('Awesome montage!', 1, 10);
