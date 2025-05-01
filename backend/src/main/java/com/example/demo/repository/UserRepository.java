package com.example.demo.repository;

import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    // ✅ 获取当前用户关注的所有用户（Following）
    @Query("SELECT u FROM User u WHERE u.id IN (SELECT f.followingId FROM UserFollow f WHERE f.followerId = :userId)")
    List<User> findUsersByFollowerId(Long userId);

    // ✅ 获取关注当前用户的所有用户（Followers）
    @Query("SELECT u FROM User u WHERE u.id IN (SELECT f.followerId FROM UserFollow f WHERE f.followingId = :userId)")
    List<User> findUsersByFollowingId(Long userId);
}
