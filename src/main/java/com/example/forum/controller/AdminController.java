package com.example.forum.controller;

import com.example.forum.common.Result;
import com.example.forum.entity.Blog;
import com.example.forum.entity.Category;
import com.example.forum.entity.Comment;
import com.example.forum.entity.Tag;
import com.example.forum.entity.User;
import com.example.forum.service.BlogService;
import com.example.forum.service.CategoryService;
import com.example.forum.service.CommentService;
import com.example.forum.service.TagService;
import com.example.forum.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 管理员控制器
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {
    
    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);
    
    @Autowired
    private BlogService blogService;
    
    @Autowired
    private CategoryService categoryService;
    
    @Autowired
    private TagService tagService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private CommentService commentService;

    // ==================== 博客管理 ====================
    
    @GetMapping("/blogs")
    public Result<Map<String, Object>> getAllBlogs(
            @RequestParam(defaultValue = "1") int pageNum, 
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean published) {
        
        Map<String, Object> pageInfo = blogService.findByPage(pageNum, pageSize, categoryId, userId, keyword);
        Map<String, Object> result = new HashMap<>();
        result.put("pageInfo", pageInfo);
        result.put("categories", categoryService.findAll());
        result.put("users", userService.findAll());
        
        return Result.success("获取成功", result);
    }

    @GetMapping("/blogs/{id}")
    public Result<Map<String, Object>> getBlogById(@PathVariable Long id) {
        Blog blog = blogService.findByIdWithTags(id);
        Map<String, Object> result = new HashMap<>();
        result.put("blog", blog);
        result.put("tags", blog.getTags());
        
        return Result.success("获取成功", result);
    }

    @PutMapping("/blogs/{id}/publish")
    public Result<Void> toggleBlogPublish(@PathVariable Long id, @RequestParam Boolean published) {
        try {
            Blog blog = blogService.findById(id);
            blog.setPublished(published);
            blogService.update(blog);
            logger.info("博客发布状态更新成功: blogId={}, published={}", id, published);
            return Result.success("更新成功", null);
        } catch (Exception e) {
            logger.error("更新博客发布状态失败: {}", e.getMessage(), e);
            return Result.error("更新失败: " + e.getMessage());
        }
    }

    @DeleteMapping("/blogs/{id}")
    public Result<Void> deleteBlog(@PathVariable Long id) {
        try {
            blogService.delete(id);
            logger.info("删除博客成功: {}", id);
            return Result.success("删除成功", null);
        } catch (Exception e) {
            logger.error("删除博客失败: {}", e.getMessage(), e);
            return Result.error("删除失败: " + e.getMessage());
        }
    }

    // ==================== 分类管理 ====================
    
    @GetMapping("/categories")
    public Result<List<Category>> getAllCategories() {
        List<Category> categories = categoryService.findAll();
        return Result.success("获取成功", categories);
    }

    @PostMapping("/categories")
    public Result<Category> createCategory(@Valid @RequestBody Category category) {
        try {
            Category createdCategory = categoryService.create(category);
            logger.info("创建分类成功: {}", createdCategory);
            return Result.success("创建成功", createdCategory);
        } catch (Exception e) {
            logger.error("创建分类失败: {}", e.getMessage(), e);
            return Result.error("创建失败: " + e.getMessage());
        }
    }

    @PutMapping("/categories/{id}")
    public Result<Category> updateCategory(@PathVariable Long id, @Valid @RequestBody Category category) {
        try {
            category.setId(id);
            Category updatedCategory = categoryService.update(category);
            logger.info("更新分类成功: {}", updatedCategory);
            return Result.success("更新成功", updatedCategory);
        } catch (Exception e) {
            logger.error("更新分类失败: {}", e.getMessage(), e);
            return Result.error("更新失败: " + e.getMessage());
        }
    }

    @DeleteMapping("/categories/{id}")
    public Result<Void> deleteCategory(@PathVariable Long id) {
        try {
            categoryService.delete(id);
            logger.info("删除分类成功: {}", id);
            return Result.success("删除成功", null);
        } catch (Exception e) {
            logger.error("删除分类失败: {}", e.getMessage(), e);
            return Result.error("删除失败: " + e.getMessage());
        }
    }

    // ==================== 标签管理 ====================
    
    @GetMapping("/tags")
    public Result<List<Tag>> getAllTags() {
        List<Tag> tags = tagService.findAll();
        return Result.success("获取成功", tags);
    }

    @PostMapping("/tags")
    public Result<Tag> createTag(@Valid @RequestBody Tag tag) {
        try {
            Tag createdTag = tagService.create(tag);
            logger.info("创建标签成功: {}", createdTag);
            return Result.success("创建成功", createdTag);
        } catch (Exception e) {
            logger.error("创建标签失败: {}", e.getMessage(), e);
            return Result.error("创建失败: " + e.getMessage());
        }
    }

    @PutMapping("/tags/{id}")
    public Result<Tag> updateTag(@PathVariable Long id, @Valid @RequestBody Tag tag) {
        try {
            tag.setId(id);
            Tag updatedTag = tagService.update(tag);
            logger.info("更新标签成功: {}", updatedTag);
            return Result.success("更新成功", updatedTag);
        } catch (Exception e) {
            logger.error("更新标签失败: {}", e.getMessage(), e);
            return Result.error("更新失败: " + e.getMessage());
        }
    }

    @DeleteMapping("/tags/{id}")
    public Result<Void> deleteTag(@PathVariable Long id) {
        try {
            tagService.delete(id);
            logger.info("删除标签成功: {}", id);
            return Result.success("删除成功", null);
        } catch (Exception e) {
            logger.error("删除标签失败: {}", e.getMessage(), e);
            return Result.error("删除失败: " + e.getMessage());
        }
    }

    // ==================== 用户管理 ====================
    
    @GetMapping("/users")
    public Result<List<User>> getAllUsers() {
        List<User> users = userService.findAll();
        return Result.success("获取成功", users);
    }

    @GetMapping("/users/{id}")
    public Result<User> getUserById(@PathVariable Long id) {
        User user = userService.findById(id);
        return Result.success("获取成功", user);
    }

    @PutMapping("/users/{id}")
    public Result<User> updateUser(@PathVariable Long id, @Valid @RequestBody User user) {
        try {
            user.setId(id);
            User updatedUser = userService.update(user);
            logger.info("更新用户成功: {}", updatedUser);
            return Result.success("更新成功", updatedUser);
        } catch (Exception e) {
            logger.error("更新用户失败: {}", e.getMessage(), e);
            return Result.error("更新失败: " + e.getMessage());
        }
    }

    @PutMapping("/users/{id}/role")
    public Result<Void> updateUserRole(@PathVariable Long id, @RequestParam String role) {
        try {
            User user = userService.findById(id);
            user.setRole(role);
            userService.update(user);
            logger.info("更新用户角色成功: userId={}, role={}", id, role);
            return Result.success("更新成功", null);
        } catch (Exception e) {
            logger.error("更新用户角色失败: {}", e.getMessage(), e);
            return Result.error("更新失败: " + e.getMessage());
        }
    }

    @DeleteMapping("/users/{id}")
    public Result<Void> deleteUser(@PathVariable Long id) {
        try {
            userService.delete(id);
            logger.info("删除用户成功: {}", id);
            return Result.success("删除成功", null);
        } catch (Exception e) {
            logger.error("删除用户失败: {}", e.getMessage(), e);
            return Result.error("删除失败: " + e.getMessage());
        }
    }

    // ==================== 评论管理 ====================
    
    @GetMapping("/comments")
    public Result<List<Comment>> getAllComments(@RequestParam(required = false) Boolean approved) {
        List<Comment> comments;
        if (approved != null) {
            comments = commentService.findByApproved(approved);
        } else {
            comments = commentService.findAll();
        }
        return Result.success("获取成功", comments);
    }

    // ==================== 统计信息 ====================
    
    @GetMapping("/stats")
    public Result<Map<String, Object>> getStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            
            // 统计博客数量
            List<Blog> allBlogs = blogService.findAll();
            long totalBlogs = allBlogs.size();
            long publishedBlogs = allBlogs.stream().filter(Blog::getPublished).count();
            long draftBlogs = totalBlogs - publishedBlogs;
            
            // 统计用户数量
            List<User> allUsers = userService.findAll();
            long totalUsers = allUsers.size();
            long adminUsers = allUsers.stream().filter(user -> "ADMIN".equals(user.getRole())).count();
            long normalUsers = totalUsers - adminUsers;
            
            // 统计分类和标签数量
            long totalCategories = categoryService.findAll().size();
            long totalTags = tagService.findAll().size();
            
            stats.put("totalBlogs", totalBlogs);
            stats.put("publishedBlogs", publishedBlogs);
            stats.put("draftBlogs", draftBlogs);
            stats.put("totalUsers", totalUsers);
            stats.put("adminUsers", adminUsers);
            stats.put("normalUsers", normalUsers);
            stats.put("totalCategories", totalCategories);
            stats.put("totalTags", totalTags);
            
            return Result.success("获取成功", stats);
        } catch (Exception e) {
            logger.error("获取统计信息失败: {}", e.getMessage(), e);
            return Result.error("获取失败: " + e.getMessage());
        }
    }
}
