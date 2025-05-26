package com.example.forum.controller;

import com.example.forum.entity.User;
import com.example.forum.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.HashMap;
import java.util.Map;
import java.util.Date;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class UserController {
    @Autowired
    private UserService userService;
    @GetMapping("/login")
    public RedirectView handleGetLogin() {
        // 将GET请求重定向到登录页面
        return new RedirectView("/");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Map<String, Object> result = new HashMap<>();
        try {
            User user = userService.login(request.getUsername(), request.getPassword());
            
            // 确保用户对象包含id字段
            if (user.getId() == null) {
                throw new Exception("用户ID为空");
            }
            
            // 确保日期字段有值
            if (user.getCreateTime() == null) {
                user.setCreateTime(new Date());
            }
            if (user.getUpdateTime() == null) {
                user.setUpdateTime(new Date());
            }
            
            // 打印用户信息以便调试
            System.out.println("登录成功，用户信息: " + user);
            
            result.put("success", true);
            result.put("message", "登录成功");
            result.put("data", user);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(result);
        }
    }

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody User user) {
        Map<String, Object> result = new HashMap<>();
        try {
            // 设置创建时间和更新时间
            Date now = new Date();
            user.setCreateTime(now);
            user.setUpdateTime(now);
            
            User newUser = userService.register(user);
            result.put("success", true);
            result.put("message", "注册成功");
            result.put("data", newUser);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return result;
    }

    @GetMapping("/current")
    public Map<String, Object> getCurrentUser(@RequestParam Long userId) {
        Map<String, Object> result = new HashMap<>();
        try {
            User user = userService.findById(userId);
            result.put("success", true);
            result.put("message", "获取成功");
            result.put("data", user);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return result;
    }

    // LoginRequest 类定义
    public static class LoginRequest {
        private String username;
        private String password;
    
        // Getters 和 Setters
        public String getUsername() {
            return username;
        }
    
        public void setUsername(String username) {
            this.username = username;
        }
    
        public String getPassword() {
            return password;
        }
    
        public void setPassword(String password) {
            this.password = password;
        }
    }
}