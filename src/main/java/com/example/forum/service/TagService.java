package com.example.forum.service;

import com.example.forum.entity.Tag;
import java.util.List;

public interface TagService {
    // 查询所有标签
    List<Tag> findAll();
    
    // 根据ID查询标签
    Tag findById(Long id);
    
    // 根据名称查询标签
    Tag findByName(String name);
    
    // 创建标签
    Tag create(Tag tag);
    
    // 更新标签
    Tag update(Tag tag);
    
    // 删除标签
    void delete(Long id);
    
    // 根据博客ID查询标签列表
    List<Tag> findByBlogId(Long blogId);
}