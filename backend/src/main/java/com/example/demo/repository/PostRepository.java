package com.example.demo.repository;

import com.example.demo.model.Post;
import com.example.demo.model.GameType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByUserId(Long userId);  // Fetch posts by user
    List<Post> findAllByOrderByCreatedAtDesc();
    List<Post> findByGameTypeOrderByCreatedAtDesc(GameType gameType);
}
