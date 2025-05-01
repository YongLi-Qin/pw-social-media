package com.example.demo.repository;

import com.example.demo.model.UserFollow;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserFollowRepository extends JpaRepository<UserFollow, Long> {

    // 查询是否已关注
    boolean existsByFollowerIdAndFollowingId(Long followerId, Long followingId);

    // 删除关注关系（取消关注）
    void deleteByFollowerIdAndFollowingId(Long followerId, Long followingId);

    // 统计粉丝数量
    long countByFollowingId(Long followingId);

    // 统计关注数量
    long countByFollowerId(Long followerId);

    @Query("SELECT f.followingId FROM UserFollow f WHERE f.followerId = :followerId")
    List<Long> findFollowingIdsByFollowerId(Long followerId);

}
