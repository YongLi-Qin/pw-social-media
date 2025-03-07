package com.example.pw_social_media;  // ✅ 确保包名正确

import com.example.demo.PwSocialMediaApplication;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(classes = PwSocialMediaApplication.class)  // ✅ 确保这里使用正确的主类
public class PwSocialMediaApplicationTests {

    @Test
    void contextLoads() {  // ✅ 确保方法名称无误
    }
}
