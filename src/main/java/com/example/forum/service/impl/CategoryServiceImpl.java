package com.example.forum.service.impl;

import com.example.forum.entity.Category;
import com.example.forum.mapper.CategoryMapper;
import com.example.forum.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Date;
import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryMapper categoryMapper;
    private static final Logger logger = LoggerFactory.getLogger(CategoryServiceImpl.class);

    @Override
    public List<Category> findAll() {
        return categoryMapper.findAll();
    }

    @Override
    public Category findById(Long id) {
        Category category = categoryMapper.findById(id);
        if (category == null) {
            throw new RuntimeException("分类不存在");
        }
        return category;
    }

    @Override
    public Category findByName(String name) {
        return categoryMapper.findByName(name);
    }

    @Override
    public Category create(Category category) {
        // 检查分类名称是否已存在
        Category existingCategory = categoryMapper.findByName(category.getName());
        if (existingCategory != null) {
            throw new RuntimeException("分类名称已存在");
        }

        // 确保日期字段有值
        Date now = new Date();
        if (category.getCreateTime() == null) {
            category.setCreateTime(now);
        }
        if (category.getUpdateTime() == null) {
            category.setUpdateTime(now);
        }

        categoryMapper.insert(category);
        logger.info("创建分类成功: {}", category);
        return category;
    }

    @Override
    public Category update(Category category) {
        // 检查分类是否存在
        Category existingCategory = categoryMapper.findById(category.getId());
        if (existingCategory == null) {
            throw new RuntimeException("分类不存在");
        }

        // 检查分类名称是否已被其他分类使用
        Category categoryWithSameName = categoryMapper.findByName(category.getName());
        if (categoryWithSameName != null && !categoryWithSameName.getId().equals(category.getId())) {
            throw new RuntimeException("分类名称已被使用");
        }

        // 更新分类信息
        existingCategory.setName(category.getName());
        existingCategory.setDescription(category.getDescription());
        existingCategory.setUpdateTime(new Date());

        categoryMapper.update(existingCategory);
        logger.info("更新分类成功: {}", existingCategory);
        return existingCategory;
    }

    @Override
    public void delete(Long id) {
        Category category = categoryMapper.findById(id);
        if (category == null) {
            throw new RuntimeException("分类不存在");
        }

        // 这里可以添加检查，确保没有博客使用该分类
        // TODO: 实现检查逻辑

        categoryMapper.delete(id);
        logger.info("删除分类成功: {}", category);
    }
}