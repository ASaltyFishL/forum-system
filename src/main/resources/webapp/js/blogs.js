// 文件：src/main/resources/webapp/js/blogs.js

// 获取当前用户ID
function getCurrentUserId() {
    const user = localStorage.getItem('user');
    if (user) {
        return JSON.parse(user).id;
    }
    return null;
}

// 初始化博客相关功能
document.addEventListener('DOMContentLoaded', function() {
    // 获取创建博客按钮
    const createBlogBtn = document.getElementById('create-blog-btn');
    if (createBlogBtn) {
        createBlogBtn.addEventListener('click', showCreateBlogForm);
    }

    // 为创建博客页面添加提交事件
    const createTopicForm = document.getElementById('create-topic-form');
    if (createTopicForm) {
        createTopicForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleCreateBlog();
        });
    }

    // 为更新博客页面添加提交事件
    const updateTopicForm = document.getElementById('update-topic-form');
    if (updateTopicForm) {
        updateTopicForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleUpdateBlog();
        });
    }

    // 取消创建博客
    const cancelCreateTopic = document.getElementById('cancel-create-topic');
    if (cancelCreateTopic) {
        cancelCreateTopic.addEventListener('click', function() {
            showPage('blogs');
        });
    }

    // 取消更新博客
    const cancelUpdateTopic = document.getElementById('cancel-update-topic');
    if (cancelUpdateTopic) {
        cancelUpdateTopic.addEventListener('click', function() {
            const blogId = document.getElementById('update-topic-id').value;
            viewBlog(blogId);
        });
    }
});

// 显示创建博客表单
function showCreateBlogForm() {
    // 清空表单
    document.getElementById('topic-title').value = '';
    document.getElementById('topic-content').value = '';
    // 切换到创建页面
    showPage('create-topic');
}

// 显示编辑博客表单
function showEditBlogForm(blogId, title, content) {
    document.getElementById('update-topic-id').value = blogId;
    document.getElementById('update-topic-title').value = title;
    document.getElementById('update-topic-content').value = content;
    // 切换到编辑页面
    showPage('update-topic');
}

// 创建新博客
function handleCreateBlog() {
    const title = document.getElementById('topic-title').value;
    const content = document.getElementById('topic-content').value;
    const userId = getCurrentUserId();

    if (!userId) {
        showModal('创建失败', '请先登录再发布博客');
        return;
    }

    if (!title.trim()) {
        showModal('创建失败', '标题不能为空');
        return;
    }

    if (!content.trim()) {
        showModal('创建失败', '内容不能为空');
        return;
    }

    showLoading('正在发布...');

    fetch(`/api/blogs?userId=${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: title,
            content: content
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('创建博客失败：' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        hideLoading();
        if (data.success) {
            showModal('创建成功', '博客已成功发布', function() {
                // 跳转到博客列表页
                showPage('blogs');
            });
        } else {
            throw new Error(data.message || '创建博客失败');
        }
    })
    .catch(error => {
        hideLoading();
        showModal('创建失败', error.message);
        console.error('创建博客错误:', error);
    });
}

// 更新博客
function handleUpdateBlog() {
    const blogId = document.getElementById('update-topic-id').value;
    const title = document.getElementById('update-topic-title').value;
    const content = document.getElementById('update-topic-content').value;
    const userId = getCurrentUserId();

    if (!userId) {
        showModal('更新失败', '请先登录');
        return;
    }

    if (!title.trim()) {
        showModal('更新失败', '标题不能为空');
        return;
    }

    if (!content.trim()) {
        showModal('更新失败', '内容不能为空');
        return;
    }

    showLoading('正在更新...');

    fetch(`/api/blogs/${blogId}?userId=${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: title,
            content: content
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('更新博客失败：' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        hideLoading();
        if (data.success) {
            showModal('更新成功', '博客已成功更新', function() {
                viewBlog(blogId);
            });
        } else {
            throw new Error(data.message || '更新博客失败');
        }
    })
    .catch(error => {
        hideLoading();
        showModal('更新失败', error.message);
        console.error('更新博客错误:', error);
    });
}

// 删除博客
function deleteBlog(blogId) {
    const userId = getCurrentUserId();
    
    if (!userId) {
        showModal('删除失败', '请先登录');
        return;
    }
    
    if (!confirm('确定要删除这个博客吗？此操作不可撤销。')) {
        return;
    }
    
    showLoading('正在删除...');
    
    fetch(`/api/blogs/${blogId}?userId=${userId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('删除博客失败：' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        hideLoading();
        if (data.success) {
            showModal('删除成功', '博客已成功删除', function() {
                showPage('blogs');
            });
        } else {
            throw new Error(data.message || '删除博客失败');
        }
    })
    .catch(error => {
        hideLoading();
        showModal('删除失败', error.message);
        console.error('删除博客错误:', error);
    });
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
    console.log('发送API请求到 /api/blogs');
    fetch('/api/blogs')
        .then(response => {
            console.log('收到博客列表响应:', response.status, response.statusText);
            if (!response.ok) {
                throw new Error('获取博客列表失败: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log('博客列表数据:', data);
            if (data.success) {
                console.log('分页信息:', data.data);
                console.log('博客数量:', data.data.data.length);
                console.log('博客详情:', data.data.data);
                renderBlogs(data.data.data);
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

// 查看博客详情
function viewBlog(blogId) {
    console.log('查看博客详情，ID:', blogId);
    // 保存当前博客ID到本地存储
    localStorage.setItem('currentBlogId', blogId);
    // 切换到博客详情页面
    showPage('blog-detail');
    // 加载博客详情
    loadBlogDetail(blogId);
    // 加载评论列表
    loadComments(blogId);
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

// 加载博客详情
function loadBlogDetail(blogId) {
    console.log('开始加载博客详情，ID:', blogId);
    const blogDetailContainer = document.getElementById('blog-detail-container');
    
    console.log('博客详情容器元素:', blogDetailContainer);
    
    if (!blogDetailContainer) {
        console.error('找不到博客详情容器元素');
        return;
    }
    
    if (!blogId) {
        blogId = localStorage.getItem('currentBlogId');
        console.log('从localStorage获取博客ID:', blogId);
        if (!blogId) {
            console.error('没有博客ID');
            blogDetailContainer.innerHTML = '没有选择博客';
            return;
        }
    }
    
    // 显示加载中状态
    console.log('显示加载中状态');
    blogDetailContainer.innerHTML = `
        <div class="text-center text-gray-500 py-10">
            <i class="fa fa-spinner fa-spin text-2xl mb-2"></i>
            <p>正在加载博客详情...</p>
        </div>
    `;
    
    console.log('发送API请求到 /api/blogs/' + blogId);
    fetch(`/api/blogs/${blogId}`)
        .then(response => {
            console.log('收到博客详情响应:', response.status, response.statusText);
            return response.json();
        })
        .then(data => {
            console.log('博客详情数据:', data);
            if (data.success) {
                console.log('成功获取博客详情，准备渲染:', data.data);
                renderBlogDetail(data.data);
            } else {
                throw new Error(data.message || '加载博客详情失败');
            }
        })
        .catch(error => {
            console.error('加载博客详情错误:', error);
            blogDetailContainer.innerHTML = `
                <div class="text-center text-red-500 py-10">
                    <i class="fa fa-exclamation-circle text-2xl mb-2"></i>
                    <p>加载博客失败: ${error.message}</p>
                </div>
            `;
        });
}

// 渲染博客详情
function renderBlogDetail(blog) {
    const blogDetailContainer = document.getElementById('blog-detail-container');
    const currentUserId = getCurrentUserId();
    console.log('当前用户ID:', currentUserId);
    console.log('博客作者ID:', blog.userId);
    const isAuthor = currentUserId && currentUserId == blog.userId;
    
    // 使用blog.username，如果为空则显示"未知用户"
    const username = blog.username || '未知用户';
    
    const html = `
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-6">
                <div class="flex justify-between items-start mb-4">
                    <h2 class="text-2xl font-bold text-gray-800">${blog.title}</h2>
                    ${isAuthor ? `
                        <div class="flex space-x-2">
                            <button onclick="showEditBlogForm(${blog.id}, '${escapeHtml(blog.title)}', '${escapeHtml(blog.content)}')" class="text-blue-500 hover:text-blue-700">
                                <i class="fa fa-edit"></i> 编辑
                            </button>
                            <button onclick="deleteBlog(${blog.id})" class="text-red-500 hover:text-red-700">
                                <i class="fa fa-trash"></i> 删除
                            </button>
                        </div>
                    ` : ''}
                </div>
                <div class="mb-4 text-gray-600 whitespace-pre-wrap">${blog.content}</div>
                <div class="flex justify-between items-center text-sm text-gray-500">
                    <span>
                        <i class="fa fa-user mr-1"></i> 作者: ${username}
                    </span>
                    <span>
                        <i class="fa fa-clock-o mr-1"></i> ${formatDate(blog.createTime)}
                    </span>
                </div>
            </div>
        </div>
    `;
    
    blogDetailContainer.innerHTML = html;
}

// 转义HTML特殊字符的函数
function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}