
package com.example.forum.service;

import com.example.forum.entity.User;
import java.util.List;

public interface UserService {
    // 用户登录
    User login(String username, String password);
    
    // 用户注册
    User register(User user);

    // 根据ID查询用户
    User findById(Long userId);
    
    // 查询所有用户
    List<User> findAll();
    
    // 更新用户信息
    User update(User user);
    
    // 删除用户
    void delete(Long userId);
    
    // 更改密码
    boolean changePassword(Long userId, String oldPassword, String newPassword);
}