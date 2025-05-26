package com.example.forum.controller;

import com.example.forum.entity.Topic;
import com.example.forum.service.TopicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/topics")
public class TopicController {

    @Autowired
    private TopicService topicService;

    @GetMapping
    public Map<String, Object> list() {
        Map<String, Object> result = new HashMap<>();
        try {
            List<Topic> topics = topicService.findAll();
            // 确保每个帖子都有有效的createTime
            for (Topic topic : topics) {
                if (topic.getCreateTime() == null) {
                    topic.setCreateTime(new java.util.Date());
                }
                if (topic.getUpdateTime() == null) {
                    topic.setUpdateTime(new java.util.Date());
                }
                
                // 打印日志以便调试
                System.out.println("帖子ID: " + topic.getId() + ", 用户ID: " + topic.getUserId() + ", 用户名: " + topic.getUsername());
            }
            result.put("success", true);
            result.put("message", "获取成功");
            result.put("data", topics);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return result;
    }

    @GetMapping("/{id}")
    public Map<String, Object> get(@PathVariable Long id) {
        Map<String, Object> result = new HashMap<>();
        try {
            Topic topic = topicService.findById(id);
            // 确保帖子有有效的创建时间
            if (topic.getCreateTime() == null) {
                topic.setCreateTime(new java.util.Date());
            }
            if (topic.getUpdateTime() == null) {
                topic.setUpdateTime(new java.util.Date());
            }
            
            // 打印日志以便调试
            System.out.println("获取帖子详情 - 帖子ID: " + topic.getId() + ", 用户ID: " + topic.getUserId() + ", 用户名: " + topic.getUsername());
            
            result.put("success", true);
            result.put("message", "获取成功");
            result.put("data", topic);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return result;
    }

    @PostMapping
    public Map<String, Object> create(@RequestBody Topic topic, @RequestParam Long userId) {
        Map<String, Object> result = new HashMap<>();
        try {
            Topic createdTopic = topicService.create(topic, userId);
            result.put("success", true);
            result.put("message", "创建成功");
            result.put("data", createdTopic);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return result;
    }

    @PutMapping("/{id}")
    public Map<String, Object> update(@PathVariable Long id, @RequestBody Topic topic, @RequestParam Long userId) {
        Map<String, Object> result = new HashMap<>();
        try {
            topic.setId(id);
            Topic updatedTopic = topicService.update(topic, userId);
            result.put("success", true);
            result.put("message", "更新成功");
            result.put("data", updatedTopic);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return result;
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable Long id, @RequestParam Long userId) {
        Map<String, Object> result = new HashMap<>();
        try {
            topicService.delete(id, userId);
            result.put("success", true);
            result.put("message", "删除成功");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return result;
    }
}
    