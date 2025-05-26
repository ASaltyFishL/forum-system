package com.example.forum.mapper;

import com.example.forum.entity.Reply;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ReplyMapper {

    List<Reply> findByTopicId(@Param("topicId") Long topicId);

    int insert(Reply reply);
}
    