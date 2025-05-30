package com.example.demo.service;

import com.example.demo.dto.AuthResponse;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.SignupRequest;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setAvatar(""); // 这里你可以改成默认的头像 URL

        user = userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user);
        return new AuthResponse(token, user.getName(), user.getEmail(), user.getAvatar(), user.getIsAdmin() != null && user.getIsAdmin());
    }

    public AuthResponse login(LoginRequest request) {
        // 先从数据库获取用户
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 打印调试信息
        System.out.println("🧪 email: " + request.getEmail());
        System.out.println("🧪 raw password: " + request.getPassword());
        System.out.println("🧪 stored password: " + user.getPassword());
        System.out.println("🧪 password match: " + passwordEncoder.matches(request.getPassword(), user.getPassword()));

        // 继续认证流程（必须保留）
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = jwtTokenProvider.generateToken(user);
        return new AuthResponse(token, user.getName(), user.getEmail(), user.getAvatar(), user.getIsAdmin() != null && user.getIsAdmin());
    }



    public User getCurrentUser(String token) {
        Long userId = jwtTokenProvider.getUserIdFromToken(token);
        return userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
} 