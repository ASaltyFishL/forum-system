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

    // 为评论表单添加提交事件
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleCommentSubmit();
        });
    }
});

// 显示创建博客表单
function showCreateBlogForm() {
    // 清空表单
    document.getElementById('topic-title').value = '';
    document.getElementById('topic-content').value = '';
    document.getElementById('topic-category').value = '';
    
    // 清空标签选择
    const tagSelect = document.getElementById('topic-tags');
    if (tagSelect) {
        tagSelect.selectedIndex = -1; // 清除所有选择
    }
    
    // 加载分类和标签数据
    loadCategoriesForCreate();
    loadTagsForCreate();
    
    // 切换到创建页面
    showPage('create-topic');
}

// 显示编辑博客表单
function showEditBlogForm(blogId, title, content) {
    document.getElementById('update-topic-id').value = blogId;
    document.getElementById('update-topic-title').value = title;
    document.getElementById('update-topic-content').value = content;
    
    // 清空标签选择
    const tagSelect = document.getElementById('update-topic-tags');
    if (tagSelect) {
        tagSelect.selectedIndex = -1; // 清除所有选择
    }
    
    // 加载分类和标签数据
    loadCategoriesForUpdate();
    loadTagsForUpdate();
    
    // 加载当前博客的分类和标签信息
    loadBlogCategoryAndTags(blogId);
    
    // 切换到编辑页面
    showPage('update-topic');
}

// 创建新博客
function handleCreateBlog() {
    const title = document.getElementById('topic-title').value;
    const content = document.getElementById('topic-content').value;
    const categoryId = document.getElementById('topic-category').value;
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

    if (!categoryId) {
        showModal('创建失败', '请选择分类');
        return;
    }

    // 获取选中的标签
    const selectedTags = getSelectedTagsFromSelect('topic-tags');

    showLoading('正在发布...');

    fetch('/api/blogs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: title,
            content: content,
            userId: userId,
            categoryId: parseInt(categoryId),
            summary: content.substring(0, 100) + '...', // 自动生成摘要
            tags: selectedTags
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
    const categoryId = document.getElementById('update-topic-category').value;
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

    if (!categoryId) {
        showModal('更新失败', '请选择分类');
        return;
    }

    // 获取选中的标签
    const selectedTags = getSelectedTagsFromSelect('update-topic-tags');

    showLoading('正在更新...');

    fetch(`/api/blogs/${blogId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: title,
            content: content,
            userId: userId,
            categoryId: parseInt(categoryId),
            summary: content.substring(0, 100) + '...', // 自动生成摘要
            tags: selectedTags
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
    
    fetch(`/api/blogs/${blogId}`, {
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
function loadBlogs(filters = {}) {
    console.log('正在加载博客列表...', filters);
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
    
    // 构建查询参数
    const params = new URLSearchParams();
    if (filters.categoryId) params.append('categoryId', filters.categoryId);
    if (filters.tagId) params.append('tagId', filters.tagId);
    if (filters.keyword) params.append('keyword', filters.keyword);
    if (filters.pageNum) params.append('pageNum', filters.pageNum);
    if (filters.pageSize) params.append('pageSize', filters.pageSize);
    
    const queryString = params.toString();
    const url = queryString ? `/api/blogs?${queryString}` : '/api/blogs';
    
    // 发送请求获取博客列表
    console.log('发送API请求到', url);
    fetch(url)
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
                console.log('博客数量:', data.data.pageInfo.data.length);
                console.log('博客详情:', data.data.pageInfo.data);
                renderBlogs(data.data.pageInfo.data);
                updateFilterResultsInfo(data.data.pageInfo, filters);
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
                        <span>分类: ${blog.categoryName || '未分类'}</span>
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
                ${blog.tags && blog.tags.length > 0 ? `
                    <div class="mt-3 flex flex-wrap gap-2">
                        ${blog.tags.map(tag => `
                            <span class="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                ${tag.name}
                            </span>
                        `).join('')}
                    </div>
                ` : ''}
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
                renderBlogDetail(data.data.blog);
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
                ${blog.tags && blog.tags.length > 0 ? `
                    <div class="mb-4 flex flex-wrap gap-2">
                        ${blog.tags.map(tag => `
                            <span class="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                ${tag.name}
                            </span>
                        `).join('')}
                    </div>
                ` : ''}
                <div class="flex justify-between items-center text-sm text-gray-500">
                    <div>
                        <span><i class="fa fa-user mr-1"></i> 作者: ${username}</span>
                        <span class="mx-2">•</span>
                        <span><i class="fa fa-folder mr-1"></i> 分类: ${blog.categoryName || '未分类'}</span>
                    </div>
                    <div>
                        <span><i class="fa fa-clock-o mr-1"></i> ${formatDate(blog.createTime)}</span>
                        <span class="mx-2">•</span>
                        <span><i class="fa fa-eye mr-1"></i> ${blog.viewCount || 0}</span>
                        <span class="mx-2">•</span>
                        <span><i class="fa fa-comment mr-1"></i> ${blog.commentCount || 0}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    blogDetailContainer.innerHTML = html;
    
    // 显示评论表单（如果用户已登录）
    const commentFormContainer = document.getElementById('comment-form-container');
    if (commentFormContainer && currentUserId) {
        commentFormContainer.classList.remove('hidden');
    } else if (commentFormContainer) {
        commentFormContainer.classList.add('hidden');
    }
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

// ==================== 分类和标签相关功能 ====================

// 加载分类数据到创建表单
function loadCategoriesForCreate() {
    fetch('/api/categories')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const categorySelect = document.getElementById('topic-category');
                categorySelect.innerHTML = '<option value="">请选择分类</option>';
                data.data.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.id;
                    option.textContent = category.name;
                    categorySelect.appendChild(option);
                });
            }
        })
        .catch(error => {
            console.error('加载分类失败:', error);
        });
}

// 加载分类数据到更新表单
function loadCategoriesForUpdate() {
    fetch('/api/categories')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const categorySelect = document.getElementById('update-topic-category');
                categorySelect.innerHTML = '<option value="">请选择分类</option>';
                data.data.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.id;
                    option.textContent = category.name;
                    categorySelect.appendChild(option);
                });
            }
        })
        .catch(error => {
            console.error('加载分类失败:', error);
        });
}

// 加载标签数据到创建表单
function loadTagsForCreate() {
    fetch('/api/tags')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const tagSelect = document.getElementById('topic-tags');
                if (tagSelect) {
                    tagSelect.innerHTML = ''; // 清空现有选项
                    data.data.forEach(tag => {
                        const option = document.createElement('option');
                        option.value = tag.id;
                        option.textContent = tag.name;
                        tagSelect.appendChild(option);
                    });
                }
            }
        })
        .catch(error => {
            console.error('加载标签失败:', error);
        });
}

// 加载标签数据到更新表单
function loadTagsForUpdate() {
    fetch('/api/tags')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const tagSelect = document.getElementById('update-topic-tags');
                if (tagSelect) {
                    tagSelect.innerHTML = ''; // 清空现有选项
                    data.data.forEach(tag => {
                        const option = document.createElement('option');
                        option.value = tag.id;
                        option.textContent = tag.name;
                        tagSelect.appendChild(option);
                    });
                }
            }
        })
        .catch(error => {
            console.error('加载标签失败:', error);
        });
}

// 加载博客的分类和标签信息
function loadBlogCategoryAndTags(blogId) {
    // 加载博客详情获取分类信息
    fetch(`/api/blogs/${blogId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const blog = data.data.blog;
                // 设置分类
                document.getElementById('update-topic-category').value = blog.categoryId;
                
                // 设置标签
                if (data.data.tags && data.data.tags.length > 0) {
                    const tagSelect = document.getElementById('update-topic-tags');
                    if (tagSelect) {
                        // 清除之前的选择
                        for (let i = 0; i < tagSelect.options.length; i++) {
                            tagSelect.options[i].selected = false;
                        }
                        // 设置选中的标签
                        data.data.tags.forEach(tag => {
                            for (let i = 0; i < tagSelect.options.length; i++) {
                                if (tagSelect.options[i].value == tag.id) {
                                    tagSelect.options[i].selected = true;
                                    break;
                                }
                            }
                        });
                    }
                }
            }
        })
        .catch(error => {
            console.error('加载博客详情失败:', error);
        });
}


// 从下拉框获取选中的标签
function getSelectedTagsFromSelect(selectId) {
    const selectedTags = [];
    const tagSelect = document.getElementById(selectId);
    if (tagSelect) {
        for (let i = 0; i < tagSelect.options.length; i++) {
            if (tagSelect.options[i].selected && tagSelect.options[i].value) {
                selectedTags.push({ id: parseInt(tagSelect.options[i].value) });
            }
        }
    }
    return selectedTags;
}


// ==================== 筛选功能 ====================

// 初始化筛选功能
function initFilters() {
    loadFilterOptions();
    bindFilterEvents();
}

// 加载筛选选项
function loadFilterOptions() {
    // 加载分类选项
    fetch('/api/categories')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const categoryFilter = document.getElementById('category-filter');
                if (categoryFilter) {
                    categoryFilter.innerHTML = '<option value="">全部分类</option>';
                    data.data.forEach(category => {
                        const option = document.createElement('option');
                        option.value = category.id;
                        option.textContent = category.name;
                        categoryFilter.appendChild(option);
                    });
                }
            }
        })
        .catch(error => {
            console.error('加载分类选项失败:', error);
        });

    // 加载标签选项
    fetch('/api/tags')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const tagFilter = document.getElementById('tag-filter');
                if (tagFilter) {
                    tagFilter.innerHTML = '<option value="">全部标签</option>';
                    data.data.forEach(tag => {
                        const option = document.createElement('option');
                        option.value = tag.id;
                        option.textContent = tag.name;
                        tagFilter.appendChild(option);
                    });
                }
            }
        })
        .catch(error => {
            console.error('加载标签选项失败:', error);
        });
}

// 绑定筛选事件
function bindFilterEvents() {
    // 应用筛选按钮
    const applyFiltersBtn = document.getElementById('apply-filters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }

    // 清除筛选按钮
    const clearFiltersBtn = document.getElementById('clear-filters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
    }

    // 搜索按钮
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', applyFilters);
    }

    // 搜索框回车事件
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyFilters();
            }
        });
    }

    // 分类和标签选择变化时自动应用筛选
    const categoryFilter = document.getElementById('category-filter');
    const tagFilter = document.getElementById('tag-filter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
    if (tagFilter) {
        tagFilter.addEventListener('change', applyFilters);
    }
}

// 应用筛选
function applyFilters() {
    const categoryId = document.getElementById('category-filter')?.value;
    const tagId = document.getElementById('tag-filter')?.value;
    const keyword = document.getElementById('search-input')?.value.trim();

    const filters = {};
    if (categoryId) filters.categoryId = categoryId;
    if (tagId) filters.tagId = tagId;
    if (keyword) filters.keyword = keyword;

    console.log('应用筛选:', filters);
    loadBlogs(filters);
}

// 清除筛选
function clearFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const tagFilter = document.getElementById('tag-filter');
    const searchInput = document.getElementById('search-input');

    if (categoryFilter) categoryFilter.value = '';
    if (tagFilter) tagFilter.value = '';
    if (searchInput) searchInput.value = '';

    console.log('清除筛选');
    loadBlogs();
}

// 更新筛选结果信息
function updateFilterResultsInfo(pageInfo, filters) {
    const filterResultsInfo = document.getElementById('filter-results-info');
    if (!filterResultsInfo) return;

    const total = pageInfo.total || 0;
    const currentPage = pageInfo.pageNum || 1;
    const pageSize = pageInfo.pageSize || 10;
    const totalPages = pageInfo.totalPages || 1;

    let infoText = `共找到 ${total} 篇博客`;
    
    // 添加筛选条件信息
    const filterConditions = [];
    if (filters.categoryId) {
        const categoryFilter = document.getElementById('category-filter');
        const categoryName = categoryFilter?.selectedOptions[0]?.text || '未知分类';
        filterConditions.push(`分类: ${categoryName}`);
    }
    if (filters.tagId) {
        const tagFilter = document.getElementById('tag-filter');
        const tagName = tagFilter?.selectedOptions[0]?.text || '未知标签';
        filterConditions.push(`标签: ${tagName}`);
    }
    if (filters.keyword) {
        filterConditions.push(`关键词: "${filters.keyword}"`);
    }

    if (filterConditions.length > 0) {
        infoText += ` (筛选条件: ${filterConditions.join(', ')})`;
    }

    if (totalPages > 1) {
        infoText += ` | 第 ${currentPage} 页，共 ${totalPages} 页`;
    }

    filterResultsInfo.textContent = infoText;
}

// ==================== 评论功能 ====================

// 处理评论提交
function handleCommentSubmit() {
    const content = document.getElementById('comment-content').value;
    const blogId = getCurrentBlogId();
    const userId = getCurrentUserId();
    
    if (!content || !blogId || !userId) {
        showModal('评论失败', '请先登录并填写评论内容');
        return;
    }
    
    showLoading('正在提交评论...');
    
    fetch('/api/comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content: content,
            blogId: blogId,
            userId: userId,
            approved: true // 直接通过，不需要审核
        })
    })
    .then(response => response.json())
    .then(data => {
        hideLoading();
        
        if (data.success) {
            document.getElementById('comment-content').value = '';
            showModal('评论提交成功', '评论已成功发布！', function() {
                loadComments(blogId);
            });
        } else {
            showModal('评论失败', data.message || '提交评论失败');
        }
    })
    .catch(error => {
        hideLoading();
        showModal('评论失败', '网络错误，请稍后重试');
        console.error('Comment submission error:', error);
    });
}

// 获取当前博客ID
function getCurrentBlogId() {
    return localStorage.getItem('currentBlogId');
}

// 加载评论列表
function loadComments(blogId) {
    if (!blogId) {
        blogId = getCurrentBlogId();
        if (!blogId) {
            console.error('没有选择博客，无法加载评论');
            return;
        }
    }
    
    const commentsContainer = document.getElementById('comments-container');
    if (!commentsContainer) {
        console.error('找不到评论列表容器');
        return;
    }
    
    // 显示加载中的状态
    let loadingHtml = `
        <h3 class="text-xl font-bold text-gray-800 mb-4">评论列表</h3>
        <div class="text-center text-gray-500 py-10">
            <i class="fa fa-spinner fa-spin text-2xl mb-2"></i>
            <p>正在加载评论...</p>
        </div>
    `;
    commentsContainer.innerHTML = loadingHtml;
    
    // 发送请求获取评论列表
    fetch(`/api/blogs/${blogId}/comments`)
        .then(response => {
            if (!response.ok) {
                throw new Error('获取评论列表失败: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                renderComments(data.data);
            } else {
                throw new Error(data.message || '获取评论列表失败');
            }
        })
        .catch(error => {
            console.error('加载评论列表错误:', error);
            let errorHtml = `
                <h3 class="text-xl font-bold text-gray-800 mb-4">评论列表</h3>
                <div class="text-center text-red-500 py-10">
                    <i class="fa fa-exclamation-circle text-2xl mb-2"></i>
                    <p>加载评论失败: ${error.message}</p>
                    <button onclick="loadComments(${blogId})" class="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                        <i class="fa fa-refresh mr-2"></i>重新加载
                    </button>
                </div>
            `;
            commentsContainer.innerHTML = errorHtml;
        });
}

// 渲染评论列表
function renderComments(comments) {
    const commentsContainer = document.getElementById('comments-container');
    
    if (!comments || comments.length === 0) {
        commentsContainer.innerHTML = `
            <h3 class="text-xl font-bold text-gray-800 mb-4">评论列表</h3>
            <div class="text-center text-gray-500 py-10">
                <i class="fa fa-comment-o text-2xl mb-2"></i>
                <p>暂无评论，快来发表第一条评论吧！</p>
            </div>
        `;
        return;
    }
    
    let html = `
        <h3 class="text-xl font-bold text-gray-800 mb-4">评论列表</h3>
    `;
    
    // 渲染评论
    comments.forEach(comment => {
        html += `
            <div class="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow duration-200">
                <div class="flex justify-between items-start mb-3">
                    <div class="flex items-center">
                        <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <i class="fa fa-user text-blue-500"></i>
                        </div>
                        <div>
                            <h4 class="font-semibold text-gray-800">${comment.nickname || comment.username || '匿名用户'}</h4>
                            <p class="text-sm text-gray-500">${formatDate(comment.createTime)}</p>
                        </div>
                    </div>
                </div>
                <div class="text-gray-700 ml-13">
                    ${comment.content}
                </div>
            </div>
        `;
    });
    
    commentsContainer.innerHTML = html;
}

// 格式化日期函数
function formatDate(dateStr) {
    if (!dateStr) return '未知时间';
    
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime()) || date.getFullYear() <= 1970) {
            return '未知时间';
        }
        
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

// 页面加载时初始化筛选功能
document.addEventListener('DOMContentLoaded', function() {
    // 延迟初始化，确保页面元素已加载
    setTimeout(initFilters, 100);
});