package com.example.demo.controller;

import com.example.demo.dto.PostRequest;
import com.example.demo.model.Post;
import com.example.demo.model.User;
import com.example.demo.model.GameType;
import com.example.demo.service.AuthService;
import com.example.demo.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {
    private final AuthService authService;
    private final PostService postService;

    @PostMapping
    public ResponseEntity<?> createPost(@RequestHeader("Authorization") String authHeader, @RequestBody PostRequest request) {
        String token = authHeader.substring(7);  // 移除 "Bearer " 前缀
        User currentUser = authService.getCurrentUser(token);

        // 使用获取到的用户信息
        Post post = Post.builder()
                .content(request.getContent())
                .imageUrl(request.getImageUrl())
                .user(currentUser)
                .build();

        return ResponseEntity.ok(postService.createPost(post));
    }

    @GetMapping("/user")
    public ResponseEntity<List<Post>> getUserPosts(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        User currentUser = authService.getCurrentUser(token);
        return ResponseEntity.ok(postService.getPostsByUser(currentUser.getId()));
    }

    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
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
        return ResponseEntity.ok(postService.getPostsByGameType(gameType));
    }
}