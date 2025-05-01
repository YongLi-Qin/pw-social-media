package com.example.demo.repository;

import com.example.demo.model.Post;
import com.example.demo.model.GameType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByUserId(Long userId);  // Fetch posts by user
    List<Post> findAllByOrderByCreatedAtDesc();
    List<Post> findByGameTypeOrderByCreatedAtDesc(GameType gameType);
    @Query("SELECT p FROM Post p LEFT JOIN FETCH p.comments c LEFT JOIN FETCH p.user ORDER BY p.createdAt DESC")
    List<Post> findAllWithCommentsOrderByCreatedAtDesc();
    List<Post> findByUserIdInOrderByCreatedAtDesc(List<Long> userIds);

}
