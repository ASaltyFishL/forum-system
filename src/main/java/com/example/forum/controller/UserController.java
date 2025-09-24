package com.example.forum.controller;

import com.example.forum.common.Result;
import com.example.forum.entity.User;
import com.example.forum.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import javax.validation.Valid;
import java.util.Date;

/**
 * 用户控制器
 */
@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/login")
    public RedirectView handleGetLogin() {
        return new RedirectView("/");
    }

    @PostMapping("/login")
    public Result<User> login(@Valid @RequestBody LoginRequest request) {
        User user = userService.login(request.getUsername(), request.getPassword());
        return Result.success("登录成功", user);
    }

    @PostMapping("/register")
    public Result<User> register(@Valid @RequestBody User user) {
        // 设置创建时间和更新时间
        Date now = new Date();
        user.setCreateTime(now);
        user.setUpdateTime(now);
        
        User newUser = userService.register(user);
        return Result.success("注册成功", newUser);
    }

    @GetMapping("/current")
    public Result<User> getCurrentUser(@RequestParam Long userId) {
        User user = userService.findById(userId);
        return Result.success("获取成功", user);
    }

    @PutMapping("/{id}")
    public Result<User> updateUser(@PathVariable Long id, @Valid @RequestBody User user) {
        user.setId(id);
        User updatedUser = userService.update(user);
        return Result.success("更新成功", updatedUser);
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return Result.success("删除成功", null);
    }

    @PostMapping("/{id}/change-password")
    public Result<Void> changePassword(@PathVariable Long id, @RequestBody ChangePasswordRequest request) {
        boolean success = userService.changePassword(id, request.getOldPassword(), request.getNewPassword());
        if (success) {
            return Result.success("密码修改成功", null);
        } else {
            return Result.error("原密码错误");
        }
    }

    /**
     * 登录请求类
     */
    public static class LoginRequest {
        private String username;
        private String password;
    
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

    /**
     * 修改密码请求类
     */
    public static class ChangePasswordRequest {
        private String oldPassword;
        private String newPassword;

        public String getOldPassword() {
            return oldPassword;
        }

        public void setOldPassword(String oldPassword) {
            this.oldPassword = oldPassword;
        }

        public String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }
}