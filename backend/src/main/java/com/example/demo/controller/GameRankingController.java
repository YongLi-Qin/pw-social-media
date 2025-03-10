package com.example.demo.controller;

import com.example.demo.model.GameRanking;
import com.example.demo.model.GameType;
import com.example.demo.repository.GameRankingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rankings")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class GameRankingController {
    
    private final GameRankingRepository gameRankingRepository;
    
    @GetMapping
    public ResponseEntity<List<GameRanking>> getAllRankings() {
        return ResponseEntity.ok(gameRankingRepository.findAll());
    }
    
    @GetMapping("/game/{gameType}")
    public ResponseEntity<List<GameRanking>> getRankingsByGameType(@PathVariable GameType gameType) {
        List<GameRanking> rankings = gameRankingRepository.findByGameType(gameType);
        return ResponseEntity.ok(rankings);
    }
} 