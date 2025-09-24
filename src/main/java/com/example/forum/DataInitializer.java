package com.example.forum;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Date;

/**
 * 数据初始化工具，用于插入示例数据到数据库
 */
public class DataInitializer {
    
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/forum?useSSL=false&serverTimezone=UTC&characterEncoding=utf8mb4";
        String username = "root";
        String password = "123456";
        
        try (Connection conn = DriverManager.getConnection(url, username, password)) {
            // 插入分类数据
            insertCategory(conn);
            
            // 插入博客数据
            insertBlog(conn);
            
            System.out.println("数据插入成功！");
        } catch (Exception e) {
            System.out.println("数据插入失败：" + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private static void insertCategory(Connection conn) throws SQLException {
        String sql = "INSERT INTO category (name, description, create_time, update_time) VALUES (?, ?, ?, ?)";
        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, "技术");
            pstmt.setString(2, "技术相关的博客文章");
            pstmt.setTimestamp(3, new java.sql.Timestamp(new Date().getTime()));
            pstmt.setTimestamp(4, new java.sql.Timestamp(new Date().getTime()));
            pstmt.executeUpdate();
            System.out.println("分类数据插入成功！");
        }
    }
    
    private static void insertBlog(Connection conn) throws SQLException {
        // 先查询分类ID
        String categoryIdQuery = "SELECT id FROM category WHERE name = '技术'";
        Long categoryId = null;
        try (PreparedStatement pstmt = conn.prepareStatement(categoryIdQuery)) {
            var rs = pstmt.executeQuery();
            if (rs.next()) {
                categoryId = rs.getLong(1);
            }
        }
        
        if (categoryId != null) {
            // 插入博客数据
            String sql = "INSERT INTO blog (title, content, summary, category_id, user_id, view_count, comment_count, published, create_time, update_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
                pstmt.setString(1, "Spring Boot入门教程");
                pstmt.setString(2, "Spring Boot是一个快速开发框架，可以帮助开发者快速构建独立的、生产级别的Spring应用。\n\n在本教程中，我们将学习：\n1. Spring Boot的基本概念\n2. 如何创建一个Spring Boot项目\n3. Spring Boot的核心特性\n4. 如何构建RESTful API\n5. 如何连接数据库");
                pstmt.setString(3, "本教程将带领你入门Spring Boot开发，从基础概念到实际应用。");
                pstmt.setLong(4, categoryId);
                pstmt.setLong(5, 1); // admin用户ID
                pstmt.setInt(6, 0);
                pstmt.setInt(7, 0);
                pstmt.setBoolean(8, true);
                pstmt.setTimestamp(9, new java.sql.Timestamp(new Date().getTime()));
                pstmt.setTimestamp(10, new java.sql.Timestamp(new Date().getTime()));
                pstmt.executeUpdate();
                System.out.println("博客数据插入成功！");
            }
        } else {
            System.out.println("找不到'技术'分类，无法插入博客数据！");
        }
    }
}