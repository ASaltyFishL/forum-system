// 文件：src/main/resources/webapp/js/blogs.js

// 获取当前用户ID
function getCurrentUserId() {
    const user = localStorage.getItem('user');
    if (user) {
        return JSON.parse(user).id;
    }
    return null;
}

// 加载所有博客列表
function loadBlogs() {
    console.log('正在加载博客列表...');
    const blogsContainer = document.getElementById('blogs-container');
    if (!blogsContainer) {
        console.error('找不到博客容器元素');
        return;
    }
    
    // 显示加载中状态
    blogsContainer.innerHTML = `
        <div class="text-center text-gray-500 py-10">
            <i class="fa fa-spinner fa-spin text-2xl mb-2"></i>
            <p>正在加载博客...</p>
        </div>
    `;
    
    // 发送请求获取博客列表
    fetch('/api/blogs')
        .then(response => {
            console.log('收到博客列表响应:', response);
            if (!response.ok) {
                throw new Error('获取博客列表失败: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log('博客列表数据:', data);
            if (data.success) {
                renderBlogs(data.data);
            } else {
                throw new Error(data.message || '获取博客列表失败');
            }
        })
        .catch(error => {
            console.error('加载博客列表错误:', error);
            blogsContainer.innerHTML = `
                <div class="text-center text-red-500 py-10">
                    <i class="fa fa-exclamation-circle text-2xl mb-2"></i>
                    <p>加载博客失败: ${error.message}</p>
                    <button onclick="loadBlogs()" class="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                        <i class="fa fa-refresh mr-2"></i>重新加载
                    </button>
                </div>
            `;
        });
}

// 格式化日期函数，确保安全显示日期
function formatDate(dateStr) {
    if (!dateStr) return '未知时间';
    
    // 尝试解析日期
    try {
        const date = new Date(dateStr);
        // 检查日期是否有效 (确保年份大于1970年且不是NaN)
        if (isNaN(date.getTime()) || date.getFullYear() <= 1970) {
            return '未知时间';
        }
        
        // 格式化日期: YYYY-MM-DD HH:MM:SS
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } catch (e) {
        console.error('日期格式化错误:', e);
        return '未知时间';
    }
}

// 渲染博客列表
function renderBlogs(blogs) {
    const blogsContainer = document.getElementById('blogs-container');
    
    if (blogs.length === 0) {
        blogsContainer.innerHTML = `
            <div class="text-center text-gray-500 py-10">
                <i class="fa fa-file-text-o text-2xl mb-2"></i>
                <p>暂无博客</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    blogs.forEach(blog => {
        html += `
            <div class="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow duration-200">
                <div class="flex justify-between items-start mb-4">
                    <h2 class="text-xl font-bold text-gray-800 hover:text-blue-600 cursor-pointer">
                        <a href="#" onclick="viewBlog(${blog.id})">${blog.title}</a>
                    </h2>
                </div>
                <div class="text-gray-600 mb-4">
                    ${truncateText(blog.content, 150)} <!-- 显示内容摘要 -->
                </div>
                <div class="flex justify-between items-center text-sm text-gray-500">
                    <div>
                        <span>作者: ${blog.username || '未知'}</span>
                        <span class="mx-2">•</span>
                        <span>发布时间: ${formatDate(blog.createTime)}</span>
                    </div>
                    <div class="flex items-center space-x-4">
                        <span class="flex items-center">
                            <i class="fa fa-eye mr-1"></i> ${blog.viewCount || 0}
                        </span>
                        <span class="flex items-center">
                            <i class="fa fa-comment mr-1"></i> ${blog.commentCount || 0}
                        </span>
                    </div>
                </div>
            </div>
        `;
    });
    
    blogsContainer.innerHTML = html;
}

// 截取文本函数
function truncateText(text, length) {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
}

// 查看博客详情
function viewBlog(blogId) {
    // 保存当前博客ID到本地存储
    localStorage.setItem('currentBlogId', blogId);
    // 切换到博客详情页面
    showPage('blog-detail');
    // 加载博客详情
    loadBlogDetail(blogId);
    // 加载评论列表
    loadComments(blogId);
}