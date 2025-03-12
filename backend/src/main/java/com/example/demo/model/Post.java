package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import com.example.demo.model.GameType;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "posts")
@Data
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 1000)
    private String content;

    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password"})
    private User user;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private GameType gameType = GameType.GENERAL;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ranking_id")
    private GameRanking gameRanking;

    public GameRanking getGameRanking() {
        return gameRanking;
    }

    public void setGameRanking(GameRanking gameRanking) {
        this.gameRanking = gameRanking;
    }

    // 在 Post 类中添加
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @OrderBy("createdAt DESC") // 按创建时间降序排序
    private List<Comment> comments = new ArrayList<>();

    // 辅助方法，获取评论数量
    public int getCommentCount() {
        return comments.size();
    }

    // 辅助方法，添加评论
    public void addComment(Comment comment) {
        comments.add(comment);
        comment.setPost(this);
    }

    // 辅助方法，移除评论
    public void removeComment(Comment comment) {
        comments.remove(comment);
        comment.setPost(null);
    }
}
