package com.example.forum.mapper;

import com.example.forum.entity.Comment;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CommentMapper {
    // 根据博客ID查询评论
    List<Comment> findByBlogId(@Param("blogId") Long blogId);

    // 根据父评论ID查询子评论
    List<Comment> findByParentId(@Param("parentId") Long parentId);

    // 查询待审核的评论
    List<Comment> findByApprovedFalse();

    // 根据审核状态查询评论
    List<Comment> findByApproved(@Param("approved") Boolean approved);

    // 查询所有评论
    List<Comment> findAll();

    // 根据用户ID查询评论
    List<Comment> findByUserId(@Param("userId") Long userId);

    // 根据ID查询评论
    Comment findById(@Param("id") Long id);

    // 插入评论
    void insert(Comment comment);

    // 更新评论审核状态
    void updateApprovalStatus(@Param("id") Long id, @Param("approved") Boolean approved);

    // 删除评论
    void delete(@Param("id") Long id);
    
    // 分页查询评论
    List<Comment> findByPage(@Param("offset") int offset, @Param("pageSize") int pageSize, 
                            @Param("blogId") Long blogId, @Param("userId") Long userId, 
                            @Param("approved") Boolean approved);
    
    // 分页查询评论总数
    int countByPage(@Param("blogId") Long blogId, @Param("userId") Long userId, 
                   @Param("approved") Boolean approved);
}
    