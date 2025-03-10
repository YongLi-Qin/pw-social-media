package com.example.demo.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PostDto {
    private Long id;
    private String content;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String gameType;
    private UserDto user;
    private GameRankingDto gameRanking;

    @Data
    public static class UserDto {
        private Long id;
        private String name;
        private String email;
    }

    @Data
    public static class GameRankingDto {
        private Long id;
        private String gameType;
        private String rankingName;
        private Integer rankingScore;
    }
}
