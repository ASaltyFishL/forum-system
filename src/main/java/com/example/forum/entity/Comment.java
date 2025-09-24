package com.example.forum.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import javax.validation.constraints.NotEmpty;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * 评论实体类
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Comment implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    @NotEmpty(message = "评论内容不能为空")
    private String content;

    private Long blogId;

    private Long userId;

    private Long parentId;

    private Boolean approved = true;

    private Date createTime;
    
    // 非持久化字段 - 用于显示
    private String username;
    private List<Comment> children;
}
    