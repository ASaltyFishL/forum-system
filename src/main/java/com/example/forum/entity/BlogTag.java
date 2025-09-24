package com.example.forum.entity;

import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;

@Data
@Entity
@Table(name = "blog_tag")
public class BlogTag implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "blog_id")
    private Long blogId;

    @Id
    @Column(name = "tag_id")
    private Long tagId;

    // 注意：这个实体类没有单独的自增ID，而是使用联合主键
    // blogId和tagId共同构成主键
}