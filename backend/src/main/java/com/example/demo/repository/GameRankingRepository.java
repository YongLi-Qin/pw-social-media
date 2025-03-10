package com.example.demo.repository;

import com.example.demo.model.GameRanking;
import com.example.demo.model.GameType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameRankingRepository extends JpaRepository<GameRanking, Long> {
    List<GameRanking> findByGameType(GameType gameType);
} 