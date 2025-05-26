package com.example.forum.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@MapperScan("com.example.forum.mapper")
public class MyBatisConfig {
    // MyBatis配置
}
    