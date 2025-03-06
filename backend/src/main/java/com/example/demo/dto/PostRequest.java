package com.example.demo.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class PostRequest {
    @NotBlank(message = "Content cannot be empty")
    private String content;

    private String imageUrl;  // 可选的图片 URL
}
