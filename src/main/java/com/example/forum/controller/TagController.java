package com.example.forum.controller;

import com.example.forum.entity.Tag;
import com.example.forum.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tags")
public class TagController {
    
    private static final Logger logger = LoggerFactory.getLogger(TagController.class);
    
    @Autowired
    private TagService tagService;

    @GetMapping
    public Map<String, Object> list() {
        Map<String, Object> result = new HashMap<>();
        try {
            List<Tag> tags = tagService.findAll();
            result.put("success", true);
            result.put("message", "获取成功");
            result.put("data", tags);
        } catch (Exception e) {
            logger.error("获取标签列表失败: {}", e.getMessage());
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return result;
    }

    @GetMapping("/{id}")
    public Map<String, Object> get(@PathVariable Long id) {
        Map<String, Object> result = new HashMap<>();
        try {
            Tag tag = tagService.findById(id);
            result.put("success", true);
            result.put("message", "获取成功");
            result.put("data", tag);
        } catch (Exception e) {
            logger.error("获取标签详情失败: {}", e.getMessage());
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return result;
    }

    @GetMapping("/blog/{blogId}")
    public Map<String, Object> listByBlogId(@PathVariable Long blogId) {
        Map<String, Object> result = new HashMap<>();
        try {
            List<Tag> tags = tagService.findByBlogId(blogId);
            result.put("success", true);
            result.put("message", "获取成功");
            result.put("data", tags);
        } catch (Exception e) {
            logger.error("获取博客标签列表失败: {}", e.getMessage());
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return result;
    }

    @PostMapping
    public Map<String, Object> create(@RequestBody Tag tag) {
        Map<String, Object> result = new HashMap<>();
        try {
            Tag createdTag = tagService.create(tag);
            logger.info("创建标签成功: {}", tag);
            result.put("success", true);
            result.put("message", "创建成功");
            result.put("data", createdTag);
        } catch (Exception e) {
            logger.error("创建标签失败: {}", e.getMessage());
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return result;
    }

    @PutMapping("/{id}")
    public Map<String, Object> update(@PathVariable Long id, @RequestBody Tag tag) {
        Map<String, Object> result = new HashMap<>();
        try {
            tag.setId(id);
            Tag updatedTag = tagService.update(tag);
            logger.info("更新标签成功: {}", tag);
            result.put("success", true);
            result.put("message", "更新成功");
            result.put("data", updatedTag);
        } catch (Exception e) {
            logger.error("更新标签失败: {}", e.getMessage());
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return result;
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable Long id) {
        Map<String, Object> result = new HashMap<>();
        try {
            tagService.delete(id);
            logger.info("删除标签成功: {}", id);
            result.put("success", true);
            result.put("message", "删除成功");
        } catch (Exception e) {
            logger.error("删除标签失败: {}", e.getMessage());
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return result;
    }
}