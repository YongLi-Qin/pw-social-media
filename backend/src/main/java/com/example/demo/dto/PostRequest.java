package com.example.demo.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import com.example.demo.model.GameType;

@Data
public class PostRequest {
    @NotBlank(message = "Content cannot be empty")
    private String content;

    private String imageUrl;  // 可选的图片 URL

    private GameType gameType = GameType.GENERAL;  // 设置默认值

    private Long rankingId; // 可以为null, 对应GameRanking的ID
}
