package com.example.forum.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import javax.validation.constraints.NotEmpty;
import java.io.Serializable;
import java.util.Date;

/**
 * 分类实体类
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    @NotEmpty(message = "分类名称不能为空")
    private String name;

    private String description;

    private Date createTime;

    private Date updateTime;

    public Category(String name, String description) {
        this.name = name;
        this.description = description;
        this.createTime = new Date();
        this.updateTime = new Date();
    }
}