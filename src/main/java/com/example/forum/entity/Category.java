package com.example.forum.entity;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import java.io.Serializable;
import java.util.Date;

@Data
@Entity
@Table(name = "category")
public class Category implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty(message = "分类名称不能为空")
    @Column(nullable = false, unique = true)
    private String name;

    @Column
    private String description;

    @Column(nullable = false)
    private Date createTime;

    @Column(nullable = false)
    private Date updateTime;

    // 默认构造函数
    public Category() {
        this.createTime = new Date();
        this.updateTime = new Date();
    }
}