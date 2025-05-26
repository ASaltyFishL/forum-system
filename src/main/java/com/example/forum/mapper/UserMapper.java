package com.example.forum.mapper;

import com.example.forum.entity.User;
import org.apache.ibatis.annotations.Mapper;


@Mapper
public interface UserMapper {

    User findByUsername(String username);

    int insert(User user);
    // 添加这个方法
    User selectById(Long id);
}
