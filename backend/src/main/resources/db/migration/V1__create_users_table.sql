CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    avatar VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO users (email, password, name) VALUES
('test@example.com', '$2a$10$ZvqDxBWh9hL.YJ.UZD3wz.vC.TqRzHGNqGVx2t9T8HF9qYzxJOzWi', 'Test User'),
('admin@example.com', '$2a$10$ZvqDxBWh9hL.YJ.UZD3wz.vC.TqRzHGNqGVx2t9T8HF9qYzxJOzWi', 'Admin User'); 