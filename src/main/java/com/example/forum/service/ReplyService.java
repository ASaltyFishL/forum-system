package com.example.forum.service;

import com.example.forum.entity.Reply;

import java.util.List;

public interface ReplyService {

    List<Reply> findByTopicId(Long topicId);

    Reply create(Reply reply, Long userId);
}
    