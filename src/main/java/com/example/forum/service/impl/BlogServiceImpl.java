package com.example.forum.service.impl;

import com.example.forum.entity.Blog;
import com.example.forum.mapper.BlogMapper;
import com.example.forum.mapper.BlogTagMapper;
import com.example.forum.service.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import com.example.forum.entity.Tag;

@Service
public class BlogServiceImpl implements BlogService {

    @Autowired
    private BlogMapper blogMapper;
    
    @Autowired
    private BlogTagMapper blogTagMapper;
    
    private static final Logger logger = LoggerFactory.getLogger(BlogServiceImpl.class);

    @Override
    public List<Blog> findAll() {
        return blogMapper.findAll();
    }

    @Override
    public Blog findById(Long id) {
        Blog blog = blogMapper.findById(id);
        if (blog == null) {
            throw new RuntimeException("博客不存在");
        }
        return blog;
    }

    @Override
    public List<Blog> findByUserId(Long userId) {
        return blogMapper.findByUserId(userId);
    }

    @Override
    public List<Blog> findByCategoryId(Long categoryId) {
        return blogMapper.findByCategoryId(categoryId);
    }

    @Override
    public List<Blog> findByTagId(Long tagId) {
        return blogMapper.findByTagId(tagId);
    }

    @Transactional
    @Override
    public Blog create(Blog blog) {
        // 确保日期字段有值
        Date now = new Date();
        if (blog.getCreateTime() == null) {
            blog.setCreateTime(now);
        }
        if (blog.getUpdateTime() == null) {
            blog.setUpdateTime(now);
        }
        if (blog.getViewCount() == null) {
            blog.setViewCount(0);
        }
        if (blog.getCommentCount() == null) {
            blog.setCommentCount(0);
        }
        if (blog.getPublished() == null) {
            blog.setPublished(true);
        }

        // 插入博客
        blogMapper.insert(blog);
        
        // 处理标签关联
        if (blog.getTags() != null && !blog.getTags().isEmpty()) {
            List<Long> tagIds = new ArrayList<>();
            for (Tag tag : blog.getTags()) {
                tagIds.add(tag.getId());
            }
            blogTagMapper.batchInsert(blog.getId(), tagIds);
        }
        
        logger.info("创建博客成功: {}", blog);
        return blog;
    }

    @Transactional
    @Override
    public Blog update(Blog blog) {
        // 检查博客是否存在
        Blog existingBlog = blogMapper.findById(blog.getId());
        if (existingBlog == null) {
            throw new RuntimeException("博客不存在");
        }

        // 更新博客信息
        existingBlog.setTitle(blog.getTitle());
        existingBlog.setContent(blog.getContent());
        existingBlog.setSummary(blog.getSummary());
        existingBlog.setCategoryId(blog.getCategoryId());
        existingBlog.setPublished(blog.getPublished());
        existingBlog.setUpdateTime(new Date());

        blogMapper.update(existingBlog);
        
        // 更新标签关联
        if (blog.getTags() != null) {
            // 删除旧的标签关联
            blogTagMapper.deleteByBlogId(blog.getId());
            
            // 添加新的标签关联
            if (!blog.getTags().isEmpty()) {
                List<Long> tagIds = new ArrayList<>();
                for (Tag tag : blog.getTags()) {
                    tagIds.add(tag.getId());
                }
                blogTagMapper.batchInsert(blog.getId(), tagIds);
            }
        }
        
        logger.info("更新博客成功: {}", existingBlog);
        return existingBlog;
    }

    @Transactional
    @Override
    public void delete(Long id) {
        Blog blog = blogMapper.findById(id);
        if (blog == null) {
            throw new RuntimeException("博客不存在");
        }

        // 删除博客与标签的关联
        blogTagMapper.deleteByBlogId(id);
        
        // 删除博客
        blogMapper.delete(id);
        logger.info("删除博客成功: {}", blog);
    }

    @Override
    public void incrementViewCount(Long blogId) {
        blogMapper.incrementViewCount(blogId);
    }

    @Override
    public void incrementCommentCount(Long blogId) {
        blogMapper.incrementCommentCount(blogId);
    }

    @Override
    public void decrementCommentCount(Long blogId) {
        blogMapper.decrementCommentCount(blogId);
    }

    @Override
    public Map<String, Object> findByPage(int pageNum, int pageSize, Long categoryId, Long userId, String keyword) {
        int offset = (pageNum - 1) * pageSize;
        List<Blog> blogs = blogMapper.findByPage(offset, pageSize, categoryId, userId, keyword);
        int total = blogMapper.countByPage(categoryId, userId, keyword);
        
        Map<String, Object> result = new HashMap<>();
        result.put("data", blogs);
        result.put("total", total);
        result.put("pageNum", pageNum);
        result.put("pageSize", pageSize);
        result.put("totalPages", (total + pageSize - 1) / pageSize);
        
        return result;
    }
}