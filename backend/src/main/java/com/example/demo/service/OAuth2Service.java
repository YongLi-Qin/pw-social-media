package com.example.demo.service;

import com.example.demo.model.OAuth2UserInfo;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OAuth2Service {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public String processOAuthLogin(Map<String, Object> attributes) {
        OAuth2UserInfo oAuth2UserInfo = new OAuth2UserInfo(attributes);
        
        Optional<User> existingUser = userRepository.findByEmail(oAuth2UserInfo.getEmail());
        
        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
            // Update existing user with any new information
            user.setName(oAuth2UserInfo.getName());
            user.setProvider("google");
            user.setProviderId(oAuth2UserInfo.getId());
        } else {
            // Create new user
            user = new User();
            user.setEmail(oAuth2UserInfo.getEmail());
            user.setName(oAuth2UserInfo.getName());
            user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            user.setProvider("google");
            user.setProviderId(oAuth2UserInfo.getId());
        }
        
        userRepository.save(user);
        
        return tokenProvider.generateToken(user);
    }
} 