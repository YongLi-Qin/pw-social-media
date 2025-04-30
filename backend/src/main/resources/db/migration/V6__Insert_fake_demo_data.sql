USE social_media;

-- Insert Users (新的头像链接，指向S3)
INSERT INTO users (email, password, name, avatar) VALUES
                                                      ('alice@example.com', 'password', 'Alice', 'https://pw-social-media.s3.ap-southeast-2.amazonaws.com/example1.jpg'),
                                                      ('bob@example.com', 'password', 'Bob', 'https://pw-social-media.s3.ap-southeast-2.amazonaws.com/example2.jpg'),
                                                      ('charlie@example.com', 'password', 'Charlie', 'https://pw-social-media.s3.ap-southeast-2.amazonaws.com/example3.jpg'),
                                                      ('david@example.com', 'password', 'David', 'https://pw-social-media.s3.ap-southeast-2.amazonaws.com/example4.jpg'),
                                                      ('eve@example.com', 'password', 'Eve', 'https://pw-social-media.s3.ap-southeast-2.amazonaws.com/example5.jpg');

-- Insert Posts (图片你也可以根据 S3 更新，当然可以先不改)
INSERT INTO posts (content, image_url, user_id, ranking_id, game_type) VALUES
                                                                           ('First post about League!', 'https://pw-social-media.s3.ap-southeast-2.amazonaws.com/example6.jpg', 1, 1, 'LEAGUE_OF_LEGENDS'),
                                                                           ('Loving Valorant gameplay!', 'https://pw-social-media.s3.ap-southeast-2.amazonaws.com/example7.jpg', 2, 15, 'VALORANT'),
                                                                           ('Ranked up today!', 'https://pw-social-media.s3.ap-southeast-2.amazonaws.com/example8.jpg', 3, 20, 'VALORANT'),
                                                                           ('My best match so far!', 'https://pw-social-media.s3.ap-southeast-2.amazonaws.com/example9.jpg', 4, 4, 'LEAGUE_OF_LEGENDS'),
                                                                           ('Reached Diamond!', 'https://pw-social-media.s3.ap-southeast-2.amazonaws.com/example10.jpg', 5, 17, 'VALORANT'),
                                                                           ('Any team looking for players?', 'https://pw-social-media.s3.ap-southeast-2.amazonaws.com/example11.jpg', 1, 23, 'VALORANT'),
                                                                           ('Check out this insane play!', NULL, 2, 5, 'LEAGUE_OF_LEGENDS'),
                                                                           ('How to improve fast?', NULL, 3, 8, 'LEAGUE_OF_LEGENDS'),
                                                                           ('Looking for duo queue', NULL, 4, 9, 'LEAGUE_OF_LEGENDS'),
                                                                           ('New montage video uploaded!', NULL, 5, 24, 'VALORANT');

-- Insert Comments (不变)
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
