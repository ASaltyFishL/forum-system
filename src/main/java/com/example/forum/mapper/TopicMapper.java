package com.example.forum.mapper;

import com.example.forum.entity.Topic;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TopicMapper {

    List<Topic> findAll();

    Topic findById(@Param("id") Long id);

    int insert(Topic topic);

    int update(Topic topic);

    int delete(@Param("id") Long id);
}
    