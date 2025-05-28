package com.example.demo.controller;

import com.example.demo.dto.CommentDto;
import com.example.demo.dto.CommentRequest;
import com.example.demo.model.User;
import com.example.demo.service.AuthService;
import com.example.demo.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;
    private final AuthService authService;

    @PostMapping
    public ResponseEntity<CommentDto> createComment(
            @Valid @RequestBody CommentRequest request,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7); // 去掉 "Bearer "
        User currentUser = authService.getCurrentUser(token); // ✅ 解析用户

        CommentDto comment = commentService.createComment(
                request.getContent(),
                request.getPostId(),
                currentUser
        );

        return ResponseEntity.ok(comment);
    }
    
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentDto>> getCommentsByPostId(@PathVariable Long postId) {
        List<CommentDto> comments = commentService.getCommentsByPostId(postId);
        return ResponseEntity.ok(comments);
    }
    
    @PutMapping("/{commentId}")
    public ResponseEntity<CommentDto> updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody CommentRequest request,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        User currentUser = authService.getCurrentUser(token);
        
        CommentDto updatedComment = commentService.updateComment(
                commentId,
                request.getContent(),
                currentUser.getId()
        );
        
        return ResponseEntity.ok(updatedComment);
    }
    
    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(
            @PathVariable Long commentId,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        User currentUser = authService.getCurrentUser(token);
        
        commentService.deleteComment(commentId, currentUser.getId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        return ResponseEntity.ok("Comment API is working!");
    }
}