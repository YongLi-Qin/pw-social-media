package com.example.demo.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CommentDto {
    private Long id;
    private String content;
    private String createdAt;
    private String updatedAt;
    private UserDto user;
    private Long postId;
    
    @Data
    public static class UserDto {
        private Long id;
        private String name;
        private String email;
    }
}