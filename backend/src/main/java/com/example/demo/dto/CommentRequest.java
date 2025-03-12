package com.example.demo.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class CommentRequest {
    @NotBlank(message = "Comment content cannot be empty")
    private String content;
    
    @NotNull(message = "Post ID is required")
    private Long postId;
}