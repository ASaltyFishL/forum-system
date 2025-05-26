package com.example.forum.service;

import com.example.forum.entity.Topic;

import java.util.List;

public interface TopicService {

    List<Topic> findAll();

    Topic findById(Long id);

    Topic create(Topic topic, Long userId);

    Topic update(Topic topic, Long userId);

    void delete(Long id, Long userId);
}
    