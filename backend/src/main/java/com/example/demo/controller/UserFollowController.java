package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.model.UserFollow;
import com.example.demo.repository.UserFollowRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.AuthService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/follow")
@RequiredArgsConstructor
public class UserFollowController {

    private final UserRepository userRepository;
    private final UserFollowRepository userFollowRepository;
    private final AuthService authService;

    // ✅ 1. 关注用户
    @PostMapping("/{targetId}")
    public ResponseEntity<?> followUser(@PathVariable Long targetId, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        User currentUser = authService.getCurrentUser(token);

        if (Objects.equals(currentUser.getId(), targetId)) {
            return ResponseEntity.badRequest().body("You cannot follow yourself.");
        }

        if (userFollowRepository.existsByFollowerIdAndFollowingId(currentUser.getId(), targetId)) {
            return ResponseEntity.badRequest().body("Already following.");
        }

        UserFollow follow = new UserFollow();
        follow.setFollowerId(currentUser.getId());
        follow.setFollowingId(targetId);
        userFollowRepository.save(follow);

        return ResponseEntity.ok("Followed successfully");
    }

    // ✅ 2. 取消关注
    @DeleteMapping("/{targetId}")
    @Transactional
    public ResponseEntity<?> unfollowUser(@PathVariable Long targetId, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        User currentUser = authService.getCurrentUser(token);

        userFollowRepository.deleteByFollowerIdAndFollowingId(currentUser.getId(), targetId);
        return ResponseEntity.ok("Unfollowed successfully");
    }

    // ✅ 3. 获取粉丝数量
    @GetMapping("/{userId}/followers/count")
    public ResponseEntity<?> getFollowerCount(@PathVariable Long userId) {
        long count = userFollowRepository.countByFollowingId(userId);
        return ResponseEntity.ok(Map.of("followers", count));
    }

    // ✅ 4. 获取关注数量
    @GetMapping("/{userId}/following/count")
    public ResponseEntity<?> getFollowingCount(@PathVariable Long userId) {
        long count = userFollowRepository.countByFollowerId(userId);
        return ResponseEntity.ok(Map.of("following", count));
    }

    // ✅ 5. 查询当前用户是否关注某人
    @GetMapping("/is-following/{targetId}")
    public ResponseEntity<?> isFollowing(@PathVariable Long targetId, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        User currentUser = authService.getCurrentUser(token);

        boolean isFollowing = userFollowRepository.existsByFollowerIdAndFollowingId(currentUser.getId(), targetId);
        return ResponseEntity.ok(Map.of("isFollowing", isFollowing));
    }

    // ✅ 6. 获取关注列表（返回用户信息）
    @GetMapping("/{userId}/following")
    public ResponseEntity<?> getFollowingList(@PathVariable Long userId) {
        List<User> users = userRepository.findUsersByFollowerId(userId);
        return ResponseEntity.ok(users);
    }

    // ✅ 7. 获取粉丝列表（返回用户信息）
    @GetMapping("/{userId}/followers")
    public ResponseEntity<?> getFollowersList(@PathVariable Long userId) {
        List<User> users = userRepository.findUsersByFollowingId(userId);
        return ResponseEntity.ok(users);
    }
}
