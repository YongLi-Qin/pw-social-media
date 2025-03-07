package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class PwSocialMediaApplication {
    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.load(); // 加载 .env 文件
        System.setProperty("GOOGLE_CLIENT_ID", dotenv.get("GOOGLE_CLIENT_ID"));
        System.setProperty("GOOGLE_CLIENT_SECRET", dotenv.get("GOOGLE_CLIENT_SECRET"));

        SpringApplication.run(PwSocialMediaApplication.class, args);
    }
}