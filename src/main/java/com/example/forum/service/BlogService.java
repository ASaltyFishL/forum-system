package com.example.forum.service;

import com.example.forum.entity.Blog;
import com.example.forum.entity.Tag;
import java.util.List;
import java.util.Map;

public interface BlogService {
    // 查询所有博客
    List<Blog> findAll();
    
    // 根据ID查询博客
    Blog findById(Long id);
    
    // 根据ID查询博客（包含标签）
    Blog findByIdWithTags(Long id);
    
    // 根据用户ID查询博客
    List<Blog> findByUserId(Long userId);
    
    // 根据分类ID查询博客
    List<Blog> findByCategoryId(Long categoryId);
    
    // 根据标签ID查询博客
    List<Blog> findByTagId(Long tagId);
    
    // 创建博客
    Blog create(Blog blog);
    
    // 更新博客
    Blog update(Blog blog);
    
    // 删除博客
    void delete(Long id);
    
    // 增加浏览量
    void incrementViewCount(Long blogId);
    
    // 增加评论数
    void incrementCommentCount(Long blogId);
    
    // 减少评论数
    void decrementCommentCount(Long blogId);
    
    // 分页查询博客
    Map<String, Object> findByPage(int pageNum, int pageSize, Long categoryId, Long userId, String keyword);
    
    // 按标签分页查询博客
    Map<String, Object> findByTagIdWithPage(int pageNum, int pageSize, Long tagId);
    
    // 更新博客标签关联
    void updateBlogTags(Long blogId, List<Tag> tags);
}