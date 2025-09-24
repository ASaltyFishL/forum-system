package com.example.forum.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import javax.validation.constraints.NotEmpty;
import java.io.Serializable;
import java.util.Date;

/**
 * 标签实体类
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Tag implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    @NotEmpty(message = "标签名称不能为空")
    private String name;

    private Date createTime;

    private Date updateTime;

    public Tag(String name) {
        this.name = name;
        this.createTime = new Date();
        this.updateTime = new Date();
    }
}