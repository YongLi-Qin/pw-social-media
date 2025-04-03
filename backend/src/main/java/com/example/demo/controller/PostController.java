package com.example.demo.controller;

import com.example.demo.dto.PostDto;
import com.example.demo.dto.PostRequest;
import com.example.demo.model.GameRanking;
import com.example.demo.model.GameType;
import com.example.demo.model.Post;
import com.example.demo.model.User;
import com.example.demo.repository.GameRankingRepository;
import com.example.demo.repository.PostRepository;
import com.example.demo.service.AuthService;
import com.example.demo.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.dto.CommentDto;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class PostController {
    private final AuthService authService;
    private final PostService postService;
    private final PostRepository postRepository;
    private final GameRankingRepository gameRankingRepository;

    @PostMapping
    public ResponseEntity<PostDto> createPost(@RequestBody PostRequest request, 
                                          @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);  // 移除 "Bearer " 前缀
        User currentUser = authService.getCurrentUser(token);
        
        Post post = new Post();
        post.setContent(request.getContent());
        post.setUser(currentUser);
        post.setGameType(request.getGameType());  // 使用请求中的游戏类型
        
        // 处理排名ID
        if (request.getRankingId() != null) {
            gameRankingRepository.findById(request.getRankingId())
                .ifPresent(post::setGameRanking);
        }
        
        Post savedPost = postRepository.save(post);
        return ResponseEntity.ok(convertToDto(savedPost));
    }

    @GetMapping("/user")
    public ResponseEntity<List<Post>> getUserPosts(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        User currentUser = authService.getCurrentUser(token);
        return ResponseEntity.ok(postService.getPostsByUser(currentUser.getId()));
    }

    @GetMapping
    public ResponseEntity<List<PostDto>> getAllPosts() {
        List<Post> posts = postService.getAllPosts();
        List<PostDto> postDtos = posts.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(postDtos);
    }

    @PutMapping("/{postId}")
    public ResponseEntity<?> updatePost(
            @PathVariable Long postId,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody PostRequest request) {
        String token = authHeader.substring(7);
        User currentUser = authService.getCurrentUser(token);

        Post updatedPost = postService.updatePost(postId, request.getContent(), currentUser.getId());
        return ResponseEntity.ok(updatedPost);
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<?> deletePost(
            @PathVariable Long postId,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        User currentUser = authService.getCurrentUser(token);

        postService.deletePost(postId, currentUser.getId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/game/{gameType}")
    public ResponseEntity<List<Post>> getPostsByGameType(@PathVariable GameType gameType) {
        // 不需要验证用户身份
        return ResponseEntity.ok(postService.getPostsByGameType(gameType));
    }

    // 添加从Post到PostDto的转换方法
    private PostDto convertToDto(Post post) {
        PostDto dto = new PostDto();
        dto.setId(post.getId());
        dto.setContent(post.getContent());
        dto.setImageUrl(post.getImageUrl());
        
        // 将 LocalDateTime 转换为字符串
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        dto.setCreatedAt(post.getCreatedAt().format(formatter));
        dto.setUpdatedAt(post.getUpdatedAt().format(formatter));
        
        dto.setGameType(post.getGameType());
        
        // 设置用户信息
        if (post.getUser() != null) {
            PostDto.UserDto userDto = new PostDto.UserDto();
            userDto.setId(post.getUser().getId());
            userDto.setName(post.getUser().getName());
            userDto.setEmail(post.getUser().getEmail());
            dto.setUser(userDto);
        }
        
        // 设置排名信息
        if (post.getGameRanking() != null) {
            PostDto.GameRankingDto rankingDto = new PostDto.GameRankingDto();
            rankingDto.setId(post.getGameRanking().getId());
            rankingDto.setGameType(post.getGameRanking().getGameType());
            rankingDto.setRankingName(post.getGameRanking().getRankingName());
            rankingDto.setRankingScore(post.getGameRanking().getRankingScore());
            dto.setGameRanking(rankingDto);
        }
        
        // 添加评论数量
        dto.setCommentCount(post.getCommentCount());
        
        // 添加最近的3条评论
        if (post.getComments() != null && !post.getComments().isEmpty()) {
            List<CommentDto> recentComments = post.getComments().stream()
                    .sorted((c1, c2) -> c2.getCreatedAt().compareTo(c1.getCreatedAt())) // 按时间降序排序
                    .limit(3) // 只取前3条
                    .map(comment -> {
                        CommentDto commentDto = new CommentDto();
                        commentDto.setId(comment.getId());
                        commentDto.setContent(comment.getContent());
                        
                        // 使用已定义的 formatter 格式化日期时间
                        String formattedDate = comment.getCreatedAt().format(formatter);
                        commentDto.setCreatedAt(formattedDate);
                        
                        // 设置用户信息
                        CommentDto.UserDto userDto = new CommentDto.UserDto();
                        userDto.setId(comment.getUser().getId());
                        userDto.setName(comment.getUser().getName());
                        userDto.setEmail(comment.getUser().getEmail());
                        commentDto.setUser(userDto);
                        
                        commentDto.setPostId(post.getId());
                        return commentDto;
                    })
                    .collect(Collectors.toList());
            
            dto.setRecentComments(recentComments);
        }
        
        return dto;
    }
}