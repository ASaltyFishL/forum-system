package com.example.forum.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import javax.validation.constraints.NotEmpty;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * 博客实体类
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Blog implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    @NotEmpty(message = "博客标题不能为空")
    private String title;

    @NotEmpty(message = "博客内容不能为空")
    private String content;

    private String summary;

    private Long userId;

    private Long categoryId;

    private Integer viewCount = 0;

    private Integer commentCount = 0;

    private Boolean published = true;

    private Date createTime;

    private Date updateTime;
    
    // 非持久化字段 - 用于显示
    private String username;
    private String categoryName;
    private List<Tag> tags;
}
    