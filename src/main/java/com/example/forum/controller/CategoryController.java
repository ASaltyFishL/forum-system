package com.example.forum.controller;

import com.example.forum.entity.Category;
import com.example.forum.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    
    private static final Logger logger = LoggerFactory.getLogger(CategoryController.class);
    
    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public Map<String, Object> list() {
        Map<String, Object> result = new HashMap<>();
        try {
            List<Category> categories = categoryService.findAll();
            result.put("success", true);
            result.put("message", "获取成功");
            result.put("data", categories);
        } catch (Exception e) {
            logger.error("获取分类列表失败: {}", e.getMessage());
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return result;
    }

    @GetMapping("/{id}")
    public Map<String, Object> get(@PathVariable Long id) {
        Map<String, Object> result = new HashMap<>();
        try {
            Category category = categoryService.findById(id);
            result.put("success", true);
            result.put("message", "获取成功");
            result.put("data", category);
        } catch (Exception e) {
            logger.error("获取分类详情失败: {}", e.getMessage());
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return result;
    }

    @PostMapping
    public Map<String, Object> create(@RequestBody Category category) {
        Map<String, Object> result = new HashMap<>();
        try {
            Category createdCategory = categoryService.create(category);
            logger.info("创建分类成功: {}", category);
            result.put("success", true);
            result.put("message", "创建成功");
            result.put("data", createdCategory);
        } catch (Exception e) {
            logger.error("创建分类失败: {}", e.getMessage());
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return result;
    }

    @PutMapping("/{id}")
    public Map<String, Object> update(@PathVariable Long id, @RequestBody Category category) {
        Map<String, Object> result = new HashMap<>();
        try {
            category.setId(id);
            Category updatedCategory = categoryService.update(category);
            logger.info("更新分类成功: {}", category);
            result.put("success", true);
            result.put("message", "更新成功");
            result.put("data", updatedCategory);
        } catch (Exception e) {
            logger.error("更新分类失败: {}", e.getMessage());
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return result;
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable Long id) {
        Map<String, Object> result = new HashMap<>();
        try {
            categoryService.delete(id);
            logger.info("删除分类成功: {}", id);
            result.put("success", true);
            result.put("message", "删除成功");
        } catch (Exception e) {
            logger.error("删除分类失败: {}", e.getMessage());
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return result;
    }
}