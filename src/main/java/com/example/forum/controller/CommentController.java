package com.example.forum.controller;

import com.example.forum.common.Result;
import com.example.forum.entity.Comment;
import com.example.forum.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.validation.Valid;
import java.util.List;

/**
 * 评论控制器
 */
@RestController
@RequestMapping("/api/comments")
public class CommentController {
    
    private static final Logger logger = LoggerFactory.getLogger(CommentController.class);
    
    @Autowired
    private CommentService commentService;
    
    @GetMapping("/blog/{blogId}")
    public Result<List<Comment>> listByBlogId(@PathVariable Long blogId) {
        List<Comment> comments = commentService.findByBlogId(blogId);
        return Result.success("获取成功", comments);
    }

    @GetMapping("/pending")
    public Result<List<Comment>> listPending() {
        List<Comment> comments = commentService.findByApprovedFalse();
        return Result.success("获取成功", comments);
    }

    @PostMapping
    public Result<Comment> create(@Valid @RequestBody Comment comment) {
        Comment createdComment = commentService.create(comment);
        logger.info("创建评论成功: {}", comment);
        return Result.success("创建成功", createdComment);
    }

    @PutMapping("/{id}/approve")
    public Result<Comment> approve(@PathVariable Long id, @RequestParam Boolean approved) {
        Comment updatedComment = commentService.updateApprovalStatus(id, approved);
        logger.info("更新评论审核状态成功: {}, 审核状态: {}", id, approved);
        return Result.success("更新成功", updatedComment);
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        commentService.delete(id);
        logger.info("删除评论成功: {}", id);
        return Result.success("删除成功", null);
    }
}
    