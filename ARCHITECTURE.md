# 论坛系统架构文档

## 项目概述

这是一个基于Spring Boot的简易论坛系统，采用前后端分离架构，提供博客发布、评论、分类标签等核心功能。

## 技术栈

- **后端框架**: Spring Boot 2.7.5
- **安全框架**: Spring Security
- **数据访问**: MyBatis
- **数据库**: MySQL 8.0
- **构建工具**: Maven
- **Java版本**: JDK 17
- **前端**: 原生HTML/CSS/JavaScript

## 项目结构

```
src/main/java/com/example/forum/
├── common/                 # 通用组件
│   └── Result.java        # 统一响应格式
├── config/                # 配置类
│   ├── MyBatisConfig.java # MyBatis配置
│   ├── SecurityConfig.java# 安全配置
│   └── WebConfig.java     # Web配置
├── controller/            # 控制器层
│   ├── UserController.java
│   ├── BlogController.java
│   ├── CommentController.java
│   ├── CategoryController.java
│   └── TagController.java
├── entity/               # 实体类
│   ├── User.java
│   ├── Blog.java
│   ├── Comment.java
│   ├── Category.java
│   ├── Tag.java
│   └── BlogTag.java
├── exception/            # 异常处理
│   └── GlobalExceptionHandler.java
├── mapper/              # 数据访问层
│   ├── UserMapper.java
│   ├── BlogMapper.java
│   ├── CommentMapper.java
│   ├── CategoryMapper.java
│   ├── TagMapper.java
│   └── BlogTagMapper.java
├── service/             # 服务层
│   ├── UserService.java
│   ├── BlogService.java
│   ├── CommentService.java
│   ├── CategoryService.java
│   ├── TagService.java
│   └── impl/           # 服务实现
│       ├── UserServiceImpl.java
│       ├── BlogServiceImpl.java
│       ├── CommentServiceImpl.java
│       ├── CategoryServiceImpl.java
│       └── TagServiceImpl.java
├── DataInitializer.java # 数据初始化器
└── ForumApplication.java # 启动类
```

## 架构设计

### 分层架构

1. **控制器层 (Controller)**
   - 处理HTTP请求
   - 参数验证
   - 调用服务层
   - 返回统一响应格式

2. **服务层 (Service)**
   - 业务逻辑处理
   - 事务管理
   - 数据验证
   - 异常处理

3. **数据访问层 (Mapper)**
   - 数据库操作
   - SQL映射
   - 结果集映射

4. **实体层 (Entity)**
   - 数据模型定义
   - 数据验证注解
   - 业务对象封装

### 核心特性

#### 1. 统一响应格式
```java
public class Result<T> {
    private boolean success;
    private String message;
    private T data;
    private Integer code;
}
```

#### 2. 全局异常处理
- 统一异常捕获
- 标准化错误响应
- 日志记录

#### 3. 数据验证
- 使用Bean Validation注解
- 参数自动验证
- 友好的错误提示

#### 4. 安全配置
- CORS跨域支持
- 静态资源访问
- API接口开放

## 数据库设计

### 核心表结构

1. **用户表 (user)**
   - 用户基本信息
   - 登录认证
   - 个人资料

2. **博客表 (blog)**
   - 博客内容
   - 分类关联
   - 统计信息

3. **评论表 (comment)**
   - 评论内容
   - 层级结构
   - 审核状态

4. **分类表 (category)**
   - 博客分类
   - 分类描述

5. **标签表 (tag)**
   - 标签信息
   - 博客关联

6. **博客标签关联表 (blog_tag)**
   - 多对多关系
   - 标签关联

## API接口设计

### 用户管理
- `POST /api/user/register` - 用户注册
- `POST /api/user/login` - 用户登录
- `GET /api/user/current` - 获取当前用户
- `PUT /api/user/{id}` - 更新用户信息
- `DELETE /api/user/{id}` - 删除用户

### 博客管理
- `GET /api/blogs` - 获取博客列表（分页）
- `GET /api/blogs/{id}` - 获取博客详情
- `POST /api/blogs` - 创建博客
- `PUT /api/blogs/{id}` - 更新博客
- `DELETE /api/blogs/{id}` - 删除博客

### 评论管理
- `GET /api/comments/blog/{blogId}` - 获取博客评论
- `POST /api/comments` - 创建评论
- `PUT /api/comments/{id}/approve` - 审核评论
- `DELETE /api/comments/{id}` - 删除评论

### 分类管理
- `GET /api/categories` - 获取分类列表
- `POST /api/categories` - 创建分类
- `PUT /api/categories/{id}` - 更新分类
- `DELETE /api/categories/{id}` - 删除分类

### 标签管理
- `GET /api/tags` - 获取标签列表
- `GET /api/tags/blog/{blogId}` - 获取博客标签
- `POST /api/tags` - 创建标签
- `PUT /api/tags/{id}` - 更新标签
- `DELETE /api/tags/{id}` - 删除标签

## 配置说明

### 数据库配置
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/forum
spring.datasource.username=root
spring.datasource.password=123456
```

### MyBatis配置
```properties
mybatis.mapper-locations=classpath:mapper/*.xml
mybatis.type-aliases-package=com.example.forum.entity
```

## 部署说明

1. **环境要求**
   - JDK 17+
   - MySQL 8.0+
   - Maven 3.6+

2. **数据库初始化**
   - 创建数据库: `CREATE DATABASE forum;`
   - 运行schema.sql创建表结构
   - 应用启动时自动初始化示例数据

3. **应用启动**
   ```bash
   mvn clean package
   java -jar target/forum-system-0.0.1-SNAPSHOT.jar
   ```

4. **访问地址**
   - 应用地址: http://localhost:8080
   - API文档: http://localhost:8080/api

## 优化亮点

1. **架构清晰**: 采用经典三层架构，职责分离明确
2. **代码规范**: 统一编码风格，完善的注释文档
3. **异常处理**: 全局异常处理机制，统一错误响应
4. **数据验证**: 完善的参数验证，提高数据质量
5. **响应格式**: 统一的API响应格式，便于前端处理
6. **配置管理**: 清晰的配置文件，便于环境切换
7. **日志记录**: 完善的日志记录，便于问题排查

## 扩展建议

1. **缓存优化**: 引入Redis缓存热点数据
2. **搜索功能**: 集成Elasticsearch实现全文搜索
3. **文件上传**: 支持图片、附件上传功能
4. **消息通知**: 实现评论通知、系统消息功能
5. **权限管理**: 完善用户角色权限体系
6. **API文档**: 集成Swagger生成API文档
7. **监控告警**: 集成Actuator实现应用监控
