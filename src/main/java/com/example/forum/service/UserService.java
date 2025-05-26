
package com.example.forum.service;

import com.example.forum.entity.User;

public interface UserService {
    User login(String username, String password);
    User register(User user);

    // 添加这个方法
    User findById(Long userId);
}