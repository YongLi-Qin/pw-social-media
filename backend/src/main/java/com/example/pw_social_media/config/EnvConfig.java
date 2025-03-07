package com.example.pw_social_media.config;

import io.github.cdimascio.dotenv.Dotenv;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EnvConfig {

    @PostConstruct
    public void init() {
        try {
            Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
            
            // 设置Google OAuth环境变量
            if (System.getProperty("GOOGLE_CLIENT_ID") == null && dotenv.get("GOOGLE_CLIENT_ID") != null) {
                System.setProperty("GOOGLE_CLIENT_ID", dotenv.get("GOOGLE_CLIENT_ID"));
            }
            
            if (System.getProperty("GOOGLE_CLIENT_SECRET") == null && dotenv.get("GOOGLE_CLIENT_SECRET") != null) {
                System.setProperty("GOOGLE_CLIENT_SECRET", dotenv.get("GOOGLE_CLIENT_SECRET"));
            }
            
            // 设置JWT密钥
            if (System.getProperty("JWT_SECRET") == null && dotenv.get("JWT_SECRET") != null) {
                System.setProperty("JWT_SECRET", dotenv.get("JWT_SECRET"));
            }
        } catch (Exception e) {
            System.err.println("无法加载.env文件: " + e.getMessage());
        }
    }
} 