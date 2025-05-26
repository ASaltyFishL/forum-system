package com.example.forum.service.impl;

import com.example.forum.entity.User;
import com.example.forum.mapper.UserMapper;
import com.example.forum.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Date;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper; // 您已有的MyBatis Mapper接口
    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);
    
    @Override
    public User login(String username, String password) {
        User user = userMapper.findByUsername(username);
        // 记录查询结果
        logger.info("根据用户名 {} 查询用户，结果: {}", username, user);
        
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        
        if (!password.equals(user.getPassword())) {
            throw new RuntimeException("密码错误");
        }
        
        // 确保用户对象有ID和日期字段
        if (user.getId() == null) {
            logger.error("用户ID为null: {}", user);
            throw new RuntimeException("用户数据不完整，ID为空");
        }
        
        // 确保日期字段不为空
        if (user.getCreateTime() == null) {
            user.setCreateTime(new Date());
        }
        
        if (user.getUpdateTime() == null) {
            user.setUpdateTime(new Date());
        }
        
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
        return user;
    }
}
    