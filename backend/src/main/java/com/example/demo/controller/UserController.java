package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

import lombok.RequiredArgsConstructor;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.AuthService;
import com.example.demo.dto.UpdateAvatarRequest;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserRepository userRepository;
    private final AuthService authService;

    @PutMapping("/avatar")
    public ResponseEntity<?> updateAvatar(
            @RequestBody UpdateAvatarRequest request,
            @RequestHeader("Authorization") String authHeader) {
        
        String token = authHeader.substring(7);
        User currentUser = authService.getCurrentUser(token);
        
        currentUser.setAvatar(request.getAvatarUrl());
        userRepository.save(currentUser);
        
        return ResponseEntity.ok(Map.of(
            "message", "Avatar updated successfully",
            "avatarUrl", currentUser.getAvatar()
        ));
    }
    
    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(
            @RequestHeader("Authorization") String authHeader) {
        
        String token = authHeader.substring(7);
        User currentUser = authService.getCurrentUser(token);
        
        Map<String, Object> profile = new HashMap<>();
        profile.put("id", currentUser.getId());
        profile.put("name", currentUser.getName());
        profile.put("email", currentUser.getEmail());
        profile.put("avatar", currentUser.getAvatar());
        
        return ResponseEntity.ok(profile);
    }
} 