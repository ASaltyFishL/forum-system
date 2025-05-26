package com.example.forum.entity;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import java.io.Serializable;
import java.util.Date;

@Data
@Entity
@Table(name = "user")
public class User implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty(message = "用户名不能为空")
    @Column(nullable = false, unique = true)
    private String username;

    @NotEmpty(message = "密码不能为空")
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private Date createTime;

    @Column(nullable = false)
    private Date updateTime;

    // 默认构造函数
    public User() {
        this.createTime = new Date();
        this.updateTime = new Date();
    }
}
    