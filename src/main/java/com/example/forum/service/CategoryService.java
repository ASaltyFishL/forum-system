package com.example.forum.service;

import com.example.forum.entity.Category;
import java.util.List;

public interface CategoryService {
    // 查询所有分类
    List<Category> findAll();
    
    // 根据ID查询分类
    Category findById(Long id);
    
    // 根据名称查询分类
    Category findByName(String name);
    
    // 创建分类
    Category create(Category category);
    
    // 更新分类
    Category update(Category category);
    
    // 删除分类
    void delete(Long id);
}