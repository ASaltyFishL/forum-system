package com.example.forum.mapper;

import com.example.forum.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserMapper {

    User findByUsername(String username);

    int insert(User user);
    
    User selectById(Long id);
    
    List<User> findAll();
    
    int update(User user);
    
    int delete(@Param("id") Long id);
}
