package com.example.forum.entity;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import java.io.Serializable;
import java.util.Date;

@Data
@Entity
@Table(name = "topic")
public class Topic implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty(message = "帖子标题不能为空")
    @Column(nullable = false)
    private String title;

    @NotEmpty(message = "帖子内容不能为空")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Date createTime;

    @Column(nullable = false)
    private Date updateTime;
    
    // 添加用户名字段，标记为非持久化
    @Transient
    private String username;
}
    