package com.example.forum.controller;

import com.example.forum.entity.Comment;
import com.example.forum.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    
    private static final Logger logger = LoggerFactory.getLogger(CommentController.class);
    
    @Autowired
    private CommentService commentService;
    
    @GetMapping("/blog/{blogId}")
    public Map<String, Object> listByBlogId(@PathVariable Long blogId) {
        Map<String, Object> result = new HashMap<>();
        try {
            result.put("success", true);
            result.put("message", "获取成功");
            result.put("data", commentService.findByBlogId(blogId));
        } catch (Exception e) {
            logger.error("获取评论列表失败: {}", e.getMessage());
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return result;
    }

    @GetMapping("/pending")
    public Map<String, Object> listPending() {
        Map<String, Object> result = new HashMap<>();
        try {
            result.put("success", true);
            result.put("message", "获取成功");
            result.put("data", commentService.findByApprovedFalse());
        } catch (Exception e) {
            logger.error("获取待审核评论列表失败: {}", e.getMessage());
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return result;
    }

    @PostMapping
    public Map<String, Object> create(@RequestBody Comment comment) {
        Map<String, Object> result = new HashMap<>();
        try {
            Comment createdComment = commentService.create(comment);
            logger.info("保存评论成功: {}", comment);
            result.put("success", true);
            result.put("message", "创建成功");
            result.put("data", createdComment);
        } catch (Exception e) {
            logger.error("保存评论失败: {}", e.getMessage());
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return result;
    }

    @PutMapping("/{id}/approve")
    public Map<String, Object> approve(@PathVariable Long id, @RequestParam Boolean approved) {
        Map<String, Object> result = new HashMap<>();
        try {
            Comment updatedComment = commentService.updateApprovalStatus(id, approved);
            logger.info("更新评论审核状态成功: {}, 审核状态: {}", id, approved);
            result.put("success", true);
            result.put("message", "更新成功");
            result.put("data", updatedComment);
        } catch (Exception e) {
            logger.error("更新评论审核状态失败: {}", e.getMessage());
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return result;
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable Long id) {
        Map<String, Object> result = new HashMap<>();
        try {
            commentService.delete(id);
            logger.info("删除评论成功: {}", id);
            result.put("success", true);
            result.put("message", "删除成功");
        } catch (Exception e) {
            logger.error("删除评论失败: {}", e.getMessage());
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return result;
    }
}
    