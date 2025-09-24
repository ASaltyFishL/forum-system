package com.example.forum.mapper;

import com.example.forum.entity.Blog;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface BlogMapper {
    // 查询所有博客
    List<Blog> findAll();

    // 根据ID查询博客
    Blog findById(@Param("id") Long id);

    // 根据用户ID查询博客
    List<Blog> findByUserId(@Param("userId") Long userId);

    // 根据分类ID查询博客
    List<Blog> findByCategoryId(@Param("categoryId") Long categoryId);

    // 根据标签ID查询博客
    List<Blog> findByTagId(@Param("tagId") Long tagId);

    // 增加浏览量
    void incrementViewCount(@Param("id") Long id);

    // 增加评论数
    void incrementCommentCount(@Param("id") Long id);

    // 减少评论数
    void decrementCommentCount(@Param("id") Long id);

    // 插入博客
    void insert(Blog blog);

    // 更新博客
    void update(Blog blog);

    // 删除博客
    void delete(@Param("id") Long id);
    
    // 分页查询博客
    List<Blog> findByPage(@Param("offset") int offset, @Param("pageSize") int pageSize, 
                         @Param("categoryId") Long categoryId, @Param("userId") Long userId, 
                         @Param("keyword") String keyword, @Param("published") Boolean published);
    
    // 分页查询博客总数
    int countByPage(@Param("categoryId") Long categoryId, @Param("userId") Long userId, 
                   @Param("keyword") String keyword, @Param("published") Boolean published);
}
    