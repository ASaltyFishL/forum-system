package com.example.forum.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BlogTagMapper {

    // 为博客添加标签
    void insert(@Param("blogId") Long blogId, @Param("tagId") Long tagId);

    // 根据博客ID删除所有标签关联
    void deleteByBlogId(@Param("blogId") Long blogId);

    // 根据标签ID删除所有博客关联
    void deleteByTagId(@Param("tagId") Long tagId);

    // 批量为博客添加标签
    void batchInsert(@Param("blogId") Long blogId, @Param("tagIds") List<Long> tagIds);
}