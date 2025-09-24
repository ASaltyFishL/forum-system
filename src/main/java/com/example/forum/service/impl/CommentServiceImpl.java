package com.example.forum.service.impl;

import com.example.forum.entity.Comment;
import com.example.forum.mapper.CommentMapper;
import com.example.forum.service.CommentService;
import com.example.forum.service.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentMapper commentMapper;
    
    @Autowired
    private BlogService blogService;
    
    private static final Logger logger = LoggerFactory.getLogger(CommentServiceImpl.class);

    @Override
    public List<Comment> findByBlogId(Long blogId) {
        return commentMapper.findByBlogId(blogId);
    }

    @Override
    public List<Comment> findByParentId(Long parentId) {
        return commentMapper.findByParentId(parentId);
    }

    @Override
    public List<Comment> findByApprovedFalse() {
        return commentMapper.findByApprovedFalse();
    }

    @Override
    public List<Comment> findByApproved(Boolean approved) {
        return commentMapper.findByApproved(approved);
    }

    @Override
    public List<Comment> findAll() {
        return commentMapper.findAll();
    }

    @Override
    public List<Comment> findByUserId(Long userId) {
        return commentMapper.findByUserId(userId);
    }

    @Override
    public Comment findById(Long id) {
        Comment comment = commentMapper.findById(id);
        if (comment == null) {
            throw new RuntimeException("评论不存在");
        }
        return comment;
    }

    @Transactional
    @Override
    public Comment create(Comment comment) {
        // 确保日期字段有值
        Date now = new Date();
        if (comment.getCreateTime() == null) {
            comment.setCreateTime(now);
        }
        if (comment.getApproved() == null) {
            // 默认情况下，评论需要审核
            comment.setApproved(false);
        }

        // 插入评论
        commentMapper.insert(comment);
        
        // 如果评论已审核通过，增加博客的评论数
        if (Boolean.TRUE.equals(comment.getApproved())) {
            blogService.incrementCommentCount(comment.getBlogId());
        }
        
        logger.info("创建评论成功: {}", comment);
        return comment;
    }

    @Transactional
    @Override
    public Comment updateApprovalStatus(Long id, Boolean approved) {
        Comment comment = commentMapper.findById(id);
        if (comment == null) {
            throw new RuntimeException("评论不存在");
        }

        // 如果状态发生变化，处理博客评论数
        if (comment.getApproved() != approved) {
            if (Boolean.TRUE.equals(approved)) {
                blogService.incrementCommentCount(comment.getBlogId());
            } else {
                blogService.decrementCommentCount(comment.getBlogId());
            }
        }

        // 更新审核状态
        comment.setApproved(approved);
        commentMapper.updateApprovalStatus(id, approved);
        
        logger.info("更新评论审核状态成功: {}, 审核状态: {}", id, approved);
        return comment;
    }

    @Transactional
    @Override
    public void delete(Long id) {
        Comment comment = commentMapper.findById(id);
        if (comment == null) {
            throw new RuntimeException("评论不存在");
        }

        // 如果评论已审核通过，减少博客的评论数
        if (Boolean.TRUE.equals(comment.getApproved())) {
            blogService.decrementCommentCount(comment.getBlogId());
        }

        // 删除子评论
        List<Comment> children = commentMapper.findByParentId(id);
        if (children != null && !children.isEmpty()) {
            for (Comment child : children) {
                delete(child.getId());
            }
        }

        // 删除评论
        commentMapper.delete(id);
        logger.info("删除评论成功: {}", comment);
    }

    @Override
    public Map<String, Object> findByPage(int pageNum, int pageSize, Long blogId, Long userId, Boolean approved) {
        int offset = (pageNum - 1) * pageSize;
        List<Comment> comments = commentMapper.findByPage(offset, pageSize, blogId, userId, approved);
        int total = commentMapper.countByPage(blogId, userId, approved);
        
        Map<String, Object> result = new HashMap<>();
        result.put("data", comments);
        result.put("total", total);
        result.put("pageNum", pageNum);
        result.put("pageSize", pageSize);
        result.put("totalPages", (total + pageSize - 1) / pageSize);
        
        return result;
    }
}