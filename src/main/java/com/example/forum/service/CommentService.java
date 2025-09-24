package com.example.forum.service;

import com.example.forum.entity.Comment;
import java.util.List;
import java.util.Map;

public interface CommentService {
    // 根据博客ID查询评论
    List<Comment> findByBlogId(Long blogId);
    
    // 根据父评论ID查询评论
    List<Comment> findByParentId(Long parentId);
    
    // 查询待审核的评论
    List<Comment> findByApprovedFalse();
    
    // 根据用户ID查询评论
    List<Comment> findByUserId(Long userId);
    
    // 根据ID查询评论
    Comment findById(Long id);
    
    // 创建评论
    Comment create(Comment comment);
    
    // 更新评论审核状态
    Comment updateApprovalStatus(Long id, Boolean approved);
    
    // 删除评论
    void delete(Long id);
    
    // 分页查询评论
    Map<String, Object> findByPage(int pageNum, int pageSize, Long blogId, Long userId, Boolean approved);
}