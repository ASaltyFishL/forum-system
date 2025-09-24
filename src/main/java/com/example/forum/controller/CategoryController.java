package com.example.forum.controller;

import com.example.forum.common.Result;
import com.example.forum.entity.Category;
import com.example.forum.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.validation.Valid;
import java.util.List;

/**
 * 分类控制器
 */
@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    
    private static final Logger logger = LoggerFactory.getLogger(CategoryController.class);
    
    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public Result<List<Category>> list() {
        List<Category> categories = categoryService.findAll();
        return Result.success("获取成功", categories);
    }

    @GetMapping("/{id}")
    public Result<Category> get(@PathVariable Long id) {
        Category category = categoryService.findById(id);
        return Result.success("获取成功", category);
    }

    @PostMapping
    public Result<Category> create(@Valid @RequestBody Category category) {
        Category createdCategory = categoryService.create(category);
        logger.info("创建分类成功: {}", category);
        return Result.success("创建成功", createdCategory);
    }

    @PutMapping("/{id}")
    public Result<Category> update(@PathVariable Long id, @Valid @RequestBody Category category) {
        category.setId(id);
        Category updatedCategory = categoryService.update(category);
        logger.info("更新分类成功: {}", category);
        return Result.success("更新成功", updatedCategory);
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        categoryService.delete(id);
        logger.info("删除分类成功: {}", id);
        return Result.success("删除成功", null);
    }
}