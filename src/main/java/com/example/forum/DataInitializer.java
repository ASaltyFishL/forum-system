package com.example.forum;

import com.example.forum.entity.Category;
import com.example.forum.entity.Tag;
import com.example.forum.entity.User;
import com.example.forum.service.CategoryService;
import com.example.forum.service.TagService;
import com.example.forum.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;


/**
 * 数据初始化器 - 在应用启动时初始化示例数据
 */
@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private CategoryService categoryService;
    
    @Autowired
    private TagService tagService;
    
    @Override
    public void run(String... args) throws Exception {
        initializeData();
    }
    
    private void initializeData() {
        try {
            // 初始化用户数据
            initializeUsers();
            
            // 初始化分类数据
            initializeCategories();
            
            // 初始化标签数据
            initializeTags();
            
            System.out.println("数据初始化完成！");
        } catch (Exception e) {
            System.out.println("数据初始化失败：" + e.getMessage());
        }
    }
    
    private void initializeUsers() {
        try {
            // 检查是否已存在admin用户
            userService.findByUsername("admin");
        } catch (Exception e) {
            // 如果不存在，创建admin用户
            User admin = new User("admin", "admin123");
            admin.setNickname("管理员");
            admin.setEmail("admin@example.com");
            admin.setBio("系统管理员");
            userService.register(admin);
            System.out.println("创建admin用户成功");
        }
    }
    
    private void initializeCategories() {
        String[] categories = {"技术", "生活", "学习", "分享"};
        String[] descriptions = {
            "技术相关的博客文章",
            "生活感悟和日常分享",
            "学习笔记和心得体会",
            "资源分享和推荐"
        };
        
        for (int i = 0; i < categories.length; i++) {
            try {
                categoryService.findByName(categories[i]);
            } catch (Exception e) {
                Category category = new Category(categories[i], descriptions[i]);
                categoryService.create(category);
                System.out.println("创建分类：" + categories[i]);
            }
        }
    }
    
    private void initializeTags() {
        String[] tags = {"Spring Boot", "Java", "MySQL", "前端", "后端", "数据库", "学习", "教程"};
        
        for (String tagName : tags) {
            try {
                tagService.findByName(tagName);
            } catch (Exception e) {
                Tag tag = new Tag(tagName);
                tagService.create(tag);
                System.out.println("创建标签：" + tagName);
            }
        }
    }
}