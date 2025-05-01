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
    private final com.example.demo.repository.UserFollowRepository userFollowRepository;


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

    @GetMapping("/following")
    public ResponseEntity<List<PostDto>> getFollowingPosts(@RequestHeader("Authorization") String authHeader) {
        User currentUser = authService.getCurrentUser(authHeader.substring(7));
        List<Long> followingIds = userFollowRepository.findFollowingIdsByFollowerId(currentUser.getId());

        List<Post> posts = postRepository.findByUserIdInOrderByCreatedAtDesc(followingIds);
        List<PostDto> postDtos = posts.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(postDtos);
    }


    @GetMapping("/user")
    public ResponseEntity<List<PostDto>> getUserPosts(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        User currentUser = authService.getCurrentUser(token);
        List<Post> posts = postService.getPostsByUser(currentUser.getId());

        List<PostDto> postDtos = posts.stream()
                .map(this::convertToDto)  // ✅ 用和 /api/posts一样的 convertToDto
                .collect(Collectors.toList());
        return ResponseEntity.ok(postDtos);
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
    public ResponseEntity<?> getPostsByGameType(@PathVariable String gameType) {
        List<Post> posts = postService.getPostsByGameType(GameType.valueOf(gameType));
        List<PostDto> postDtos = posts.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(postDtos);
    }

    // 添加从Post到PostDto的转换方法
    private PostDto convertToDto(Post post) {
        PostDto dto = new PostDto();
        dto.setId(post.getId());
        dto.setContent(post.getContent());
        dto.setImageUrl(post.getImageUrl());
        dto.setCreatedAt(post.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        dto.setUpdatedAt(post.getUpdatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        dto.setGameType(post.getGameType());

        // 设置用户信息
        if (post.getUser() != null) {
            PostDto.UserDto userDto = new PostDto.UserDto();
            userDto.setId(post.getUser().getId());
            userDto.setName(post.getUser().getName());
            userDto.setEmail(post.getUser().getEmail());
            userDto.setPicture(post.getUser().getAvatar());  // ✅ 关键：设置头像字段
            dto.setUser(userDto);
        } else {
            PostDto.UserDto userDto = new PostDto.UserDto();
            userDto.setId(0L);
            userDto.setName("Unknown User");
            userDto.setEmail("unknown@example.com");
            userDto.setPicture(null);
            dto.setUser(userDto);
        }

        // 设置游戏排名信息
        if (post.getGameRanking() != null) {
            PostDto.GameRankingDto rankingDto = new PostDto.GameRankingDto();
            rankingDto.setId(post.getGameRanking().getId());
            rankingDto.setGameType(post.getGameRanking().getGameType());
            rankingDto.setRankingName(post.getGameRanking().getRankingName());
            rankingDto.setRankingScore(post.getGameRanking().getRankingScore());
            dto.setGameRanking(rankingDto);
        }

        // 设置评论数量
        dto.setCommentCount(post.getComments().size());

        // 添加最近的3条评论
        if (post.getComments() != null && !post.getComments().isEmpty()) {
            List<CommentDto> recentComments = post.getComments().stream()
                    .sorted((c1, c2) -> c2.getCreatedAt().compareTo(c1.getCreatedAt()))
                    .limit(3)
                    .map(comment -> {
                        CommentDto commentDto = new CommentDto();
                        commentDto.setId(comment.getId());
                        commentDto.setContent(comment.getContent());
                        commentDto.setCreatedAt(comment.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

                        CommentDto.UserDto commentUserDto = new CommentDto.UserDto();
                        commentUserDto.setId(comment.getUser().getId());
                        commentUserDto.setName(comment.getUser().getName());
                        commentUserDto.setEmail(comment.getUser().getEmail());
                        commentDto.setUser(commentUserDto);

                        commentDto.setPostId(post.getId());
                        return commentDto;
                    })
                    .collect(Collectors.toList());

            dto.setRecentComments(recentComments);
        }

        return dto;
    }

}