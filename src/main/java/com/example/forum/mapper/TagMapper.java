package com.example.forum.mapper;

import com.example.forum.entity.Tag;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TagMapper {

    // 查询所有标签
    List<Tag> findAll();

    // 根据ID查询标签
    Tag findById(@Param("id") Long id);

    // 根据名称查询标签
    Tag findByName(@Param("name") String name);

    // 插入标签
    void insert(Tag tag);

    // 更新标签
    void update(Tag tag);

    // 删除标签
    void delete(@Param("id") Long id);

    // 根据博客ID查询标签列表
    List<Tag> findByBlogId(@Param("blogId") Long blogId);
}