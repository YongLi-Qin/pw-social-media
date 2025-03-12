package com.example.demo.dto;

import com.example.demo.model.GameType;
import lombok.Data;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.List;

@Data
public class PostDto {
    private Long id;
    private String content;
    private String imageUrl;
    private String createdAt;
    private String updatedAt;
    private GameType gameType;
    private UserDto user;
    private GameRankingDto gameRanking;
    private int commentCount;
    private List<CommentDto> recentComments;

    @Data
    public static class UserDto {
        private Long id;
        private String name;
        private String email;
    }

    @Data
    public static class GameRankingDto {
        private Long id;
        private GameType gameType;
        private String rankingName;
        private Integer rankingScore;
    }
}
