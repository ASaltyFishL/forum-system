package com.example.forum.controller;

import com.example.forum.entity.Blog;
import com.example.forum.service.BlogService;
import com.example.forum.service.CategoryService;
import com.example.forum.service.CommentService;
import com.example.forum.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/blogs")
public class BlogController {
    
    private static final Logger logger = LoggerFactory.getLogger(BlogController.class);
    
    @Autowired
    private BlogService blogService;
    
    @Autowired
    private CategoryService categoryService;
    
    @Autowired
    private CommentService commentService;
    
    @Autowired
    private TagService tagService;

    @GetMapping
    public Map<String, Object> list(
            @RequestParam(defaultValue = "1") int pageNum, 
            @RequestParam(defaultValue = "10") int pageSize, 
            @RequestParam(required = false) Long categoryId, 
            @RequestParam(required = false) Long userId, 
            @RequestParam(required = false) String keyword) {
        Map<String, Object> result = new HashMap<>();
        try {
            Map<String, Object> pageInfo = blogService.findByPage(pageNum, pageSize, categoryId, userId, keyword);
            result.put("success", true);
            result.put("message", "获取成功");
            result.put("data", pageInfo);
            result.put("categories", categoryService.findAll());
        } catch (Exception e) {
            logger.error("获取博客列表失败: {}", e.getMessage());
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return result;
    }

    @GetMapping("/{id}")
    public Map<String, Object> get(@PathVariable Long id) {
        Map<String, Object> result = new HashMap<>();
        try {
            Blog blog = blogService.findById(id);
            // 增加浏览量
            blogService.incrementViewCount(id);
            result.put("success", true);
            result.put("message", "获取成功");
            result.put("data", blog);
            result.put("tags", tagService.findByBlogId(id));
        } catch (Exception e) {
            logger.error("获取博客详情失败: {}", e.getMessage());
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return result;
    }

    @PostMapping
    public Map<String, Object> create(@RequestBody Blog blog) {
        Map<String, Object> result = new HashMap<>();
        try {
            Blog createdBlog = blogService.create(blog);
            logger.info("保存博客成功: {}", blog);
            result.put("success", true);
            result.put("message", "创建成功");
            result.put("data", createdBlog);
        } catch (Exception e) {
            logger.error("保存博客失败: {}", e.getMessage());
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return result;
    }

    @PutMapping("/{id}")
    public Map<String, Object> update(@PathVariable Long id, @RequestBody Blog blog) {
        Map<String, Object> result = new HashMap<>();
        try {
            blog.setId(id);
            Blog updatedBlog = blogService.update(blog);
            logger.info("更新博客成功: {}", blog);
            result.put("success", true);
            result.put("message", "更新成功");
            result.put("data", updatedBlog);
        } catch (Exception e) {
            logger.error("更新博客失败: {}", e.getMessage());
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    @GetMapping("/{id}/comments")
    public Map<String, Object> getCommentsByBlogId(@PathVariable Long id) {
        Map<String, Object> result = new HashMap<>();
        try {
            // 检查博客是否存在
            blogService.findById(id);
            // 获取评论列表
            result.put("success", true);
            result.put("message", "获取成功");
            result.put("data", commentService.findByBlogId(id));
        } catch (Exception e) {
            logger.error("获取博客评论失败: {}", e.getMessage());
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return result;
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable Long id) {
        Map<String, Object> result = new HashMap<>();
        try {
            blogService.delete(id);
            logger.info("删除博客成功: {}", id);
            result.put("success", true);
            result.put("message", "删除成功");
        } catch (Exception e) {
            logger.error("删除博客失败: {}", e.getMessage());
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return result;
    }
}
    