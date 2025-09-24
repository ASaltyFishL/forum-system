package com.example.forum.service.impl;

import com.example.forum.entity.User;
import com.example.forum.mapper.UserMapper;
import com.example.forum.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Date;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;
    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);
    
    @Override
    public User login(String username, String password) {
        User user = userMapper.findByUsername(username);
        logger.info("根据用户名 {} 查询用户，结果: {}", username, user);
        
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        
        if (!password.equals(user.getPassword())) {
            throw new RuntimeException("密码错误");
        }
        
        // 确保用户对象有完整的数据
        ensureUserHasCompleteData(user);
        
        return user;
    }

    @Override
    public User register(User user) {
        // 检查用户名是否已存在
        User existingUser = userMapper.findByUsername(user.getUsername());
        if (existingUser != null) {
            throw new RuntimeException("用户名已存在");
        }
        
        // 确保日期字段有值
        Date now = new Date();
        if (user.getCreateTime() == null) {
            user.setCreateTime(now);
        }
        if (user.getUpdateTime() == null) {
            user.setUpdateTime(now);
        }
        userMapper.insert(user);
        
        // 确保新用户对象有ID
        User newUser = userMapper.findByUsername(user.getUsername());
        if (newUser == null || newUser.getId() == null) {
            throw new RuntimeException("注册用户失败，无法获取用户ID");
        }
        
        return newUser;
    }

    @Override
    public User findById(Long userId) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        ensureUserHasCompleteData(user);
        return user;
    }

    @Override
    public List<User> findAll() {
        List<User> users = userMapper.findAll();
        for (User user : users) {
            ensureUserHasCompleteData(user);
        }
        return users;
    }

    @Override
    public User update(User user) {
        // 检查用户是否存在
        User existingUser = userMapper.selectById(user.getId());
        if (existingUser == null) {
            throw new RuntimeException("用户不存在");
        }
        
        // 更新用户信息
        existingUser.setNickname(user.getNickname());
        existingUser.setAvatar(user.getAvatar());
        existingUser.setEmail(user.getEmail());
        existingUser.setBio(user.getBio());
        existingUser.setUpdateTime(new Date());
        
        userMapper.update(existingUser);
        return existingUser;
    }

    @Override
    public void delete(Long userId) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        userMapper.delete(userId);
    }

    @Override
    public boolean changePassword(Long userId, String oldPassword, String newPassword) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        
        if (!oldPassword.equals(user.getPassword())) {
            return false;
        }
        
        user.setPassword(newPassword);
        user.setUpdateTime(new Date());
        userMapper.update(user);
        return true;
    }
    
    // 确保用户对象有完整的数据
    private void ensureUserHasCompleteData(User user) {
        if (user.getId() == null) {
            logger.error("用户ID为null: {}", user);
            throw new RuntimeException("用户数据不完整，ID为空");
        }
        
        if (user.getCreateTime() == null) {
            user.setCreateTime(new Date());
        }
        
        if (user.getUpdateTime() == null) {
            user.setUpdateTime(new Date());
        }
    }
}
    