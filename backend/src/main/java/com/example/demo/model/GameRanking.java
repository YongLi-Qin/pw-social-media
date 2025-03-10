package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "game_rankings")
@Getter
@Setter
@NoArgsConstructor
public class GameRanking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private GameType gameType;  // 关联游戏类型

    private String rankingName; // 用于存储段位名，例如 "Bronze", "Gold"

    private Integer rankingScore; // 用于存储数值分数，例如 1000, 2000

    @Enumerated(EnumType.STRING)
    private RankingType rankingType; // 标识该 ranking 是分数还是段位

    public GameRanking(GameType gameType, String rankingName, Integer rankingScore, RankingType rankingType) {
        this.gameType = gameType;
        this.rankingName = rankingName;
        this.rankingScore = rankingScore;
        this.rankingType = rankingType;
    }
} 