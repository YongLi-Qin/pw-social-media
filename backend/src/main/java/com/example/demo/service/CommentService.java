package com.example.demo.service;

import com.example.demo.dto.CommentDto;
import com.example.demo.model.Comment;
import com.example.demo.model.Post;
import com.example.demo.model.User;
import com.example.demo.repository.CommentRepository;
import com.example.demo.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    
    public CommentDto createComment(String content, Long postId, User currentUser) {
        System.out.println("=== CommentService.createComment ===");
        System.out.println("Content: " + content);
        System.out.println("PostId: " + postId);
        System.out.println("User: " + currentUser.getName() + ", ID: " + currentUser.getId());
        
        try {
            Post post = postRepository.findById(postId)
                    .orElseThrow(() -> new RuntimeException("Post not found"));
            System.out.println("Post found: " + post.getId());
            
            // 使用构造函数创建 Comment
            Comment comment = new Comment(content, currentUser, post);
            System.out.println("Comment object created");
            
            // 使用Post的辅助方法添加评论
            post.addComment(comment);
            System.out.println("Comment added to post");
            
            Comment savedComment = commentRepository.save(comment);
            System.out.println("Comment saved to database: " + savedComment.getId());
            
            return convertToDto(savedComment);
        } catch (Exception e) {
            System.err.println("ERROR in CommentService.createComment: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    public List<CommentDto> getCommentsByPostId(Long postId) {
        List<Comment> comments = commentRepository.findByPostIdOrderByCreatedAtDesc(postId);
        return comments.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public CommentDto updateComment(Long commentId, String content, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        if (!comment.getUser().getId().equals(userId)) {
            throw new RuntimeException("You can only update your own comments");
        }
        
        comment.setContent(content);
        Comment updatedComment = commentRepository.save(comment);
        return convertToDto(updatedComment);
    }
    
    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        if (!comment.getUser().getId().equals(userId)) {
            throw new RuntimeException("You can only delete your own comments");
        }
        
        // 使用Post的辅助方法移除评论
        Post post = comment.getPost();
        post.removeComment(comment);
        
        commentRepository.delete(comment);
    }
    
    private CommentDto convertToDto(Comment comment) {
        CommentDto dto = new CommentDto();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUpdatedAt(comment.getUpdatedAt());
        dto.setPostId(comment.getPost().getId());
        
        if (comment.getUser() != null) {
            CommentDto.UserDto userDto = new CommentDto.UserDto();
            userDto.setId(comment.getUser().getId());
            userDto.setName(comment.getUser().getName());
            userDto.setEmail(comment.getUser().getEmail());
            dto.setUser(userDto);
        }
        
        return dto;
    }
}