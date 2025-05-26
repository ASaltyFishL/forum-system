package com.example.forum.service.impl;

import com.example.forum.entity.Topic;
import com.example.forum.mapper.TopicMapper;
import com.example.forum.service.TopicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class TopicServiceImpl implements TopicService {

    @Autowired
    private TopicMapper topicMapper;

    @Override
    public List<Topic> findAll() {
        return topicMapper.findAll();
    }

    @Override
    public Topic findById(Long id) {
        return topicMapper.findById(id);
    }

    @Override
    public Topic create(Topic topic, Long userId) {
        // 设置用户ID
        topic.setUserId(userId);
        
        // 设置创建时间和更新时间
        Date now = new Date();
        topic.setCreateTime(now);
        topic.setUpdateTime(now);
        
        // 插入帖子
        topicMapper.insert(topic);
        
        return topic;
    }

    @Override
    public Topic update(Topic topic, Long userId) {
        // 检查帖子是否存在
        Topic existingTopic = topicMapper.findById(topic.getId());
        if (existingTopic == null) {
            throw new RuntimeException("帖子不存在");
        }
        
        // 检查是否为帖子作者
        if (!existingTopic.getUserId().equals(userId)) {
            throw new RuntimeException("无权限修改此帖子");
        }
        
        // 更新帖子内容
        existingTopic.setTitle(topic.getTitle());
        existingTopic.setContent(topic.getContent());
        existingTopic.setUpdateTime(new Date());
        
        // 更新帖子
        topicMapper.update(existingTopic);
        
        return existingTopic;
    }

    @Override
    public void delete(Long id, Long userId) {
        // 检查帖子是否存在
        Topic existingTopic = topicMapper.findById(id);
        if (existingTopic == null) {
            throw new RuntimeException("帖子不存在");
        }
        
        // 检查是否为帖子作者
        if (!existingTopic.getUserId().equals(userId)) {
            throw new RuntimeException("无权限删除此帖子");
        }
        
        // 删除帖子
        topicMapper.delete(id);
    }
}
    