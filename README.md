# 简易论坛系统

## 项目简介

这是一个基于Spring Boot的简易论坛系统，采用前后端分离架构设计，提供博客发布、评论互动、分类标签管理等核心功能。系统架构清晰、代码规范，适合作为学习Spring Boot和Web开发的示例项目，也可以作为构建更复杂论坛系统的基础框架。

## 技术栈

### 后端技术
- **框架**: Spring Boot 2.7.5
- **安全框架**: Spring Security
- **ORM框架**: MyBatis
- **数据库**: MySQL 8.0
- **构建工具**: Maven 3.6+
- **Java版本**: JDK 17

### 前端技术
- **基础技术**: HTML5, CSS3, JavaScript
- **CSS框架**: Tailwind CSS
- **图标库**: Font Awesome

## 功能特性

### 用户管理
- 用户注册、登录功能
- 用户角色管理（普通用户、管理员）
- 用户基本信息维护

### 博客管理
- 博客发布、编辑、删除功能
- 博客分类和标签管理
- 博客浏览量统计
- 博客搜索功能

### 评论系统
- 多级评论支持
- 评论计数功能

### 系统管理
- 分类管理
- 标签管理
- 用户管理
- 数据初始化功能

## 项目结构

### 后端结构
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

### 前端结构
```
src/main/resources/webapp/
├── admin.html           # 管理员后台页面
├── css/                 # 样式文件
│   └── style.css
├── index.html           # 首页
└── js/                  # JavaScript文件
    ├── admin-blog.js    # 博客管理脚本
    ├── admin.js         # 管理员脚本
    ├── app.js           # 应用主脚本
    ├── auth.js          # 认证相关脚本
    └── blogs.js         # 博客相关脚本
```

## 数据库设计

### 核心表结构

1. **用户表 (user)**
   - 存储用户基本信息、登录凭证和角色信息
   - 关键字段：id, username, password, nickname, email, role等

2. **博客表 (blog)**
   - 存储博客内容、分类关联和统计信息
   - 关键字段：id, title, content, user_id, category_id, view_count, comment_count等

3. **评论表 (comment)**
   - 存储评论内容和层级结构
   - 关键字段：id, content, blog_id, user_id, parent_id等

4. **分类表 (category)**
   - 存储博客分类信息
   - 关键字段：id, name, description等

5. **标签表 (tag)**
   - 存储标签信息
   - 关键字段：id, name等

6. **博客标签关联表 (blog_tag)**
   - 存储博客和标签的多对多关系
   - 关键字段：blog_id, tag_id

## 环境要求

- JDK 17+
- MySQL 8.0+
- Maven 3.6+

## 安装与配置

### 1. 数据库准备

1. 创建MySQL数据库
   ```sql
   CREATE DATABASE forum;
   ```

2. 配置数据库连接信息
   在`application.properties`文件中修改数据库连接配置：
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/forum?useUnicode=true&characterEncoding=utf-8&useSSL=true&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=123456
   ```

### 2. 项目构建

```bash
# 克隆项目（假设已克隆到本地）
# cd forum-system

# 构建项目
mvn clean package

# 运行项目
java -jar target/forum-system-0.0.1-SNAPSHOT.jar
```

### 3. 初始化数据

项目启动时会自动执行以下初始化操作：
- 创建数据库表结构（通过`schema.sql`）
- 创建管理员用户（用户名：admin，密码：admin123）
- 创建示例分类和标签数据

## 使用指南

### 访问系统

项目启动后，可以通过以下地址访问：
- 系统首页：http://localhost:8080
- 管理员后台：http://localhost:8080/admin.html

### 普通用户功能

1. **注册登录**
   - 点击导航栏的"注册"按钮创建新账号
   - 使用注册的账号登录系统

2. **浏览博客**
   - 首页浏览最新博客
   - 点击博客标题查看详情
   - 按分类或标签筛选博客

3. **发表评论**
   - 在博客详情页可以发表评论
   - 支持回复他人评论

### 管理员功能

1. **登录管理后台**
   - 使用管理员账号（admin/admin123）登录
   - 登录后导航栏会显示"管理后台"按钮

2. **博客管理**
   - 查看所有博客列表
   - 编辑或删除博客

3. **分类标签管理**
   - 管理博客分类
   - 管理标签

## API接口说明

### 用户接口
- `POST /api/users/register` - 用户注册
- `POST /api/users/login` - 用户登录
- `GET /api/users/me` - 获取当前登录用户信息

### 博客接口
- `GET /api/blogs` - 获取博客列表（支持分页、分类、标签筛选）
- `GET /api/blogs/{id}` - 获取博客详情
- `POST /api/blogs` - 创建博客
- `PUT /api/blogs/{id}` - 更新博客
- `DELETE /api/blogs/{id}` - 删除博客

### 评论接口
- `GET /api/blogs/{id}/comments` - 获取博客评论
- `POST /api/comments` - 创建评论
- `DELETE /api/comments/{id}` - 删除评论

### 分类接口
- `GET /api/categories` - 获取分类列表
- `POST /api/categories` - 创建分类
- `PUT /api/categories/{id}` - 更新分类
- `DELETE /api/categories/{id}` - 删除分类

### 标签接口
- `GET /api/tags` - 获取标签列表
- `POST /api/tags` - 创建标签
- `PUT /api/tags/{id}` - 更新标签
- `DELETE /api/tags/{id}` - 删除标签

## 安全配置

系统使用Spring Security进行认证和授权管理：
- 支持基于角色的访问控制
- 密码加密存储
- CORS跨域支持
- 静态资源访问控制

## 常见问题

### 1. 数据库连接失败
- 检查MySQL服务是否启动
- 确认`application.properties`中的数据库连接信息正确
- 确保MySQL用户有足够的权限

### 2. 项目启动失败
- 检查JDK版本是否为17或更高
- 确认Maven依赖已正确下载
- 查看控制台错误日志，针对性解决问题

### 3. 管理员账号无法登录
- 默认管理员账号为admin，密码为admin123
- 确保DataInitializer类正确执行了初始化操作

## 扩展建议

1. **性能优化**
   - 引入Redis缓存热点数据
   - 实现分页查询和数据索引

2. **功能扩展**
   - 集成全文搜索引擎（如Elasticsearch）
   - 添加文件上传和图片处理功能
   - 实现消息通知系统

3. **安全增强**
   - 完善CSRF防护
   - 实现API限流
   - 添加验证码功能

4. **用户体验**
   - 优化移动端响应式设计
   - 添加富文本编辑器
   - 实现主题切换功能

## License

该项目仅供学习使用。