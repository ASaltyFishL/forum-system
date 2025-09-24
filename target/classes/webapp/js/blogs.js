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
    document.getElementById('topic-category').value = '';
    document.getElementById('selected-tags').innerHTML = '';
    document.getElementById('tag-input').value = '';
    
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
    document.getElementById('update-selected-tags').innerHTML = '';
    document.getElementById('update-tag-input').value = '';
    
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
    const selectedTags = getSelectedTags();

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
    const selectedTags = getUpdateSelectedTags();

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
                console.log('博客数量:', data.data.pageInfo.data.length);
                console.log('博客详情:', data.data.pageInfo.data);
                renderBlogs(data.data.pageInfo.data);
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
                const availableTagsContainer = document.getElementById('available-tags');
                availableTagsContainer.innerHTML = '';
                data.data.forEach(tag => {
                    const tagElement = document.createElement('span');
                    tagElement.className = 'inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-300';
                    tagElement.textContent = tag.name;
                    tagElement.onclick = () => addTagToCreate(tag);
                    availableTagsContainer.appendChild(tagElement);
                });
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
                const availableTagsContainer = document.getElementById('update-available-tags');
                availableTagsContainer.innerHTML = '';
                data.data.forEach(tag => {
                    const tagElement = document.createElement('span');
                    tagElement.className = 'inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-300';
                    tagElement.textContent = tag.name;
                    tagElement.onclick = () => addTagToUpdate(tag);
                    availableTagsContainer.appendChild(tagElement);
                });
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
                    const selectedTagsContainer = document.getElementById('update-selected-tags');
                    selectedTagsContainer.innerHTML = '';
                    data.data.tags.forEach(tag => {
                        addTagToUpdateContainer(tag);
                    });
                }
            }
        })
        .catch(error => {
            console.error('加载博客详情失败:', error);
        });
}

// 添加标签到创建表单
function addTagToCreate(tag) {
    const selectedTagsContainer = document.getElementById('selected-tags');
    const existingTag = selectedTagsContainer.querySelector(`[data-tag-id="${tag.id}"]`);
    if (!existingTag) {
        addTagToCreateContainer(tag);
    }
}

// 添加标签到创建表单容器
function addTagToCreateContainer(tag) {
    const selectedTagsContainer = document.getElementById('selected-tags');
    const tagElement = document.createElement('span');
    tagElement.className = 'inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-sm mr-2 mb-2';
    tagElement.setAttribute('data-tag-id', tag.id);
    tagElement.innerHTML = `${tag.name} <span class="cursor-pointer ml-1" onclick="removeTagFromCreate(${tag.id})">&times;</span>`;
    selectedTagsContainer.appendChild(tagElement);
}

// 添加标签到更新表单
function addTagToUpdate(tag) {
    const selectedTagsContainer = document.getElementById('update-selected-tags');
    const existingTag = selectedTagsContainer.querySelector(`[data-tag-id="${tag.id}"]`);
    if (!existingTag) {
        addTagToUpdateContainer(tag);
    }
}

// 添加标签到更新表单容器
function addTagToUpdateContainer(tag) {
    const selectedTagsContainer = document.getElementById('update-selected-tags');
    const tagElement = document.createElement('span');
    tagElement.className = 'inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-sm mr-2 mb-2';
    tagElement.setAttribute('data-tag-id', tag.id);
    tagElement.innerHTML = `${tag.name} <span class="cursor-pointer ml-1" onclick="removeTagFromUpdate(${tag.id})">&times;</span>`;
    selectedTagsContainer.appendChild(tagElement);
}

// 从创建表单移除标签
function removeTagFromCreate(tagId) {
    const tagElement = document.querySelector(`#selected-tags [data-tag-id="${tagId}"]`);
    if (tagElement) {
        tagElement.remove();
    }
}

// 从更新表单移除标签
function removeTagFromUpdate(tagId) {
    const tagElement = document.querySelector(`#update-selected-tags [data-tag-id="${tagId}"]`);
    if (tagElement) {
        tagElement.remove();
    }
}

// 获取创建表单中选中的标签
function getSelectedTags() {
    const selectedTags = [];
    const tagElements = document.querySelectorAll('#selected-tags [data-tag-id]');
    tagElements.forEach(element => {
        const tagId = element.getAttribute('data-tag-id');
        selectedTags.push({ id: parseInt(tagId) });
    });
    return selectedTags;
}

// 获取更新表单中选中的标签
function getUpdateSelectedTags() {
    const selectedTags = [];
    const tagElements = document.querySelectorAll('#update-selected-tags [data-tag-id]');
    tagElements.forEach(element => {
        const tagId = element.getAttribute('data-tag-id');
        selectedTags.push({ id: parseInt(tagId) });
    });
    return selectedTags;
}

// 标签输入框事件处理
document.addEventListener('DOMContentLoaded', function() {
    // 创建表单标签输入
    const tagInput = document.getElementById('tag-input');
    if (tagInput) {
        tagInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const tagName = this.value.trim();
                if (tagName) {
                    // 创建新标签
                    createNewTag(tagName, 'create');
                    this.value = '';
                }
            }
        });
    }

    // 更新表单标签输入
    const updateTagInput = document.getElementById('update-tag-input');
    if (updateTagInput) {
        updateTagInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const tagName = this.value.trim();
                if (tagName) {
                    // 创建新标签
                    createNewTag(tagName, 'update');
                    this.value = '';
                }
            }
        });
    }
});

// 创建新标签
function createNewTag(tagName, formType) {
    fetch('/api/tags', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: tagName
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const newTag = data.data;
            if (formType === 'create') {
                addTagToCreateContainer(newTag);
                loadTagsForCreate(); // 重新加载可用标签
            } else {
                addTagToUpdateContainer(newTag);
                loadTagsForUpdate(); // 重新加载可用标签
            }
        } else {
            showModal('创建标签失败', data.message || '创建标签失败');
        }
    })
    .catch(error => {
        console.error('创建标签失败:', error);
        showModal('创建标签失败', '网络错误，请稍后重试');
    });
}