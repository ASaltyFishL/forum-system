package com.example.forum.entity;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Data
@Entity
@Table(name = "blog")
public class Blog implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty(message = "博客标题不能为空")
    @Column(nullable = false)
    private String title;

    @NotEmpty(message = "博客内容不能为空")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column
    private String summary;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long categoryId;

    @Column
    private Integer viewCount = 0;

    @Column
    private Integer commentCount = 0;

    @Column
    private Boolean published = true;

    @Column(nullable = false)
    private Date createTime;

    @Column(nullable = false)
    private Date updateTime;
    
    // 添加非持久化字段
    @Transient
    private String username;
    
    @Transient
    private String categoryName;
    
    @Transient
    private List<Tag> tags;
}
    