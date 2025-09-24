package com.example.forum.entity;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Data
@Entity
@Table(name = "comment")
public class Comment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty(message = "评论内容不能为空")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private Long blogId;

    @Column(nullable = false)
    private Long userId;

    @Column
    private Long parentId;

    @Column
    private Boolean approved = true;

    @Column(nullable = false)
    private Date createTime;
    
    // 添加非持久化字段
    @Transient
    private String username;
    
    @Transient
    private List<Comment> children;
}
    