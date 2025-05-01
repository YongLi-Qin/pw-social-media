CREATE TABLE user_followers (
                                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                follower_id BIGINT NOT NULL,
                                following_id BIGINT NOT NULL,
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                                FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
                                FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,

                                UNIQUE (follower_id, following_id)  -- 防止重复关注
);
