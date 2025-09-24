package com.example.forum.controller;

import com.example.forum.common.Result;
import com.example.forum.entity.Blog;
import com.example.forum.service.BlogService;
import com.example.forum.service.CategoryService;
import com.example.forum.service.CommentService;
import com.example.forum.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

/**
 * 博客控制器
 */
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
    public Result<Map<String, Object>> list(
            @RequestParam(defaultValue = "1") int pageNum, 
            @RequestParam(defaultValue = "10") int pageSize, 
            @RequestParam(required = false) Long categoryId, 
            @RequestParam(required = false) Long userId, 
            @RequestParam(required = false) String keyword) {
        
        Map<String, Object> pageInfo = blogService.findByPage(pageNum, pageSize, categoryId, userId, keyword);
        Map<String, Object> result = new HashMap<>();
        result.put("pageInfo", pageInfo);
        result.put("categories", categoryService.findAll());
        
        return Result.success("获取成功", result);
    }

    @GetMapping("/{id}")
    public Result<Map<String, Object>> get(@PathVariable Long id) {
        Blog blog = blogService.findByIdWithTags(id);
        // 增加浏览量
        blogService.incrementViewCount(id);
        
        Map<String, Object> result = new HashMap<>();
        result.put("blog", blog);
        result.put("tags", blog.getTags()); // 直接从blog对象获取标签
        
        return Result.success("获取成功", result);
    }

    @PostMapping
    public Result<Blog> create(@Valid @RequestBody Blog blog) {
        try {
            // 验证必要字段
            if (blog.getUserId() == null) {
                return Result.error("用户ID不能为空");
            }
            if (blog.getCategoryId() == null) {
                return Result.error("分类ID不能为空");
            }
            
            Blog createdBlog = blogService.create(blog);
            
            // 处理标签关联
            if (blog.getTags() != null && !blog.getTags().isEmpty()) {
                blogService.updateBlogTags(createdBlog.getId(), blog.getTags());
            }
            
            logger.info("创建博客成功: {}", createdBlog);
            return Result.success("创建成功", createdBlog);
        } catch (Exception e) {
            logger.error("创建博客失败: {}", e.getMessage(), e);
            return Result.error("创建博客失败: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public Result<Blog> update(@PathVariable Long id, @Valid @RequestBody Blog blog) {
        try {
            blog.setId(id);
            Blog updatedBlog = blogService.update(blog);
            
            // 处理标签关联
            if (blog.getTags() != null) {
                blogService.updateBlogTags(id, blog.getTags());
            }
            
            logger.info("更新博客成功: {}", updatedBlog);
            return Result.success("更新成功", updatedBlog);
        } catch (Exception e) {
            logger.error("更新博客失败: {}", e.getMessage(), e);
            return Result.error("更新博客失败: " + e.getMessage());
        }
    }
    
    @GetMapping("/{id}/comments")
    public Result<Object> getCommentsByBlogId(@PathVariable Long id) {
        // 检查博客是否存在
        blogService.findById(id);
        // 获取评论列表
        return Result.success("获取成功", commentService.findByBlogId(id));
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        blogService.delete(id);
        logger.info("删除博客成功: {}", id);
        return Result.success("删除成功", null);
    }
}
    