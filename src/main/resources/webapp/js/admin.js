// 管理员后台JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // 检查管理员权限
    checkAdminAuth();
    
    // 初始化页面
    initAdminPage();
    
    // 绑定事件
    bindEvents();
    
    // 加载仪表盘数据
    loadDashboard();
});

// 检查管理员权限
function checkAdminAuth() {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMIN') {
        alert('您没有管理员权限！');
        window.location.href = '/';
        return;
    }
    
    // 显示当前管理员用户名
    document.getElementById('admin-username').textContent = currentUser.username;
}

// 获取当前用户信息
function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

// 初始化管理员页面
function initAdminPage() {
    // 默认显示仪表盘
    showSection('dashboard');
}

// 绑定事件
function bindEvents() {
    // 侧边栏导航
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });
    
    // 侧边栏切换
    document.getElementById('sidebar-toggle').addEventListener('click', function() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('main-content');
        
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
    });
    
    // 退出登录
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = '/';
    });
    
    // 模态框关闭
    document.getElementById('close-modal').addEventListener('click', hideModal);
    document.getElementById('modal-cancel').addEventListener('click', hideModal);
    document.getElementById('close-form-modal').addEventListener('click', hideFormModal);
    document.getElementById('form-modal-cancel').addEventListener('click', hideFormModal);
    
    // 刷新按钮
    document.getElementById('refresh-blogs').addEventListener('click', loadBlogs);
    document.getElementById('refresh-users').addEventListener('click', loadUsers);
    
    // 添加按钮
    document.getElementById('add-category-btn').addEventListener('click', showAddCategoryForm);
    document.getElementById('add-tag-btn').addEventListener('click', showAddTagForm);
    
    // 筛选器
    document.getElementById('blog-status-filter').addEventListener('change', loadBlogs);
    document.getElementById('user-role-filter').addEventListener('change', loadUsers);
}

// 显示指定部分
function showSection(sectionName) {
    // 隐藏所有部分
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // 显示指定部分
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
    
    // 更新页面标题
    const titles = {
        'dashboard': '仪表盘',
        'blogs': '博客管理',
        'categories': '分类管理',
        'tags': '标签管理',
        'users': '用户管理'
    };
    document.getElementById('page-title').textContent = titles[sectionName] || '仪表盘';
    
    // 更新导航状态
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('bg-gray-700');
    });
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('bg-gray-700');
    
    // 加载对应数据
    switch(sectionName) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'blogs':
            loadBlogs();
            break;
        case 'categories':
            loadCategories();
            break;
        case 'tags':
            loadTags();
            break;
        case 'users':
            loadUsers();
            break;
    }
}

// ==================== 仪表盘 ====================

function loadDashboard() {
    fetch('/api/admin/stats')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const stats = data.data;
                document.getElementById('total-blogs').textContent = stats.totalBlogs;
                document.getElementById('published-blogs').textContent = stats.publishedBlogs;
                document.getElementById('draft-blogs').textContent = stats.draftBlogs;
                document.getElementById('total-users').textContent = stats.totalUsers;
            }
        })
        .catch(error => {
            console.error('加载统计信息失败:', error);
        });
}

// ==================== 博客管理 ====================

function loadBlogs() {
    const statusFilter = document.getElementById('blog-status-filter').value;
    let url = '/api/admin/blogs?pageNum=1&pageSize=100';
    if (statusFilter) {
        url += `&published=${statusFilter}`;
    }
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                renderBlogsTable(data.data.pageInfo.data);
            }
        })
        .catch(error => {
            console.error('加载博客列表失败:', error);
        });
}

function renderBlogsTable(blogs) {
    const container = document.getElementById('blogs-table-container');
    
    if (blogs.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8">
                <i class="fa fa-file-text-o text-4xl text-gray-300 mb-4"></i>
                <p class="text-gray-500">暂无博客</p>
            </div>
        `;
        return;
    }
    
    const html = `
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">标题</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作者</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分类</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建时间</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${blogs.map(blog => `
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900">${blog.title}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900">${blog.username || '未知'}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900">${blog.categoryName || '未分类'}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${blog.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                                    ${blog.published ? '已发布' : '草稿'}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ${formatDate(blog.createTime)}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button onclick="toggleBlogPublish(${blog.id}, ${!blog.published})" class="text-blue-600 hover:text-blue-900 mr-3">
                                    ${blog.published ? '设为草稿' : '发布'}
                                </button>
                                <button onclick="deleteBlog(${blog.id})" class="text-red-600 hover:text-red-900">
                                    删除
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    container.innerHTML = html;
}

function toggleBlogPublish(blogId, published) {
    fetch(`/api/admin/blogs/${blogId}/publish?published=${published}`, {
        method: 'PUT'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadBlogs();
        } else {
            alert('操作失败: ' + data.message);
        }
    })
    .catch(error => {
        console.error('操作失败:', error);
        alert('操作失败');
    });
}

function deleteBlog(blogId) {
    showModal('确认删除', '确定要删除这篇博客吗？此操作不可恢复。', () => {
        fetch(`/api/admin/blogs/${blogId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loadBlogs();
            } else {
                alert('删除失败: ' + data.message);
            }
        })
        .catch(error => {
            console.error('删除失败:', error);
            alert('删除失败');
        });
    });
}

// ==================== 分类管理 ====================

function loadCategories() {
    fetch('/api/admin/categories')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                renderCategoriesTable(data.data);
            }
        })
        .catch(error => {
            console.error('加载分类列表失败:', error);
        });
}

function renderCategoriesTable(categories) {
    const container = document.getElementById('categories-table-container');
    
    if (categories.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8">
                <i class="fa fa-folder text-4xl text-gray-300 mb-4"></i>
                <p class="text-gray-500">暂无分类</p>
            </div>
        `;
        return;
    }
    
    const html = `
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名称</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">描述</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建时间</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${categories.map(category => `
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900">${category.name}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900">${category.description || '-'}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ${formatDate(category.createTime)}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button onclick="editCategory(${category.id}, '${category.name}', '${category.description || ''}')" class="text-blue-600 hover:text-blue-900 mr-3">
                                    编辑
                                </button>
                                <button onclick="deleteCategory(${category.id})" class="text-red-600 hover:text-red-900">
                                    删除
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    container.innerHTML = html;
}

function showAddCategoryForm() {
    showCategoryForm('添加分类', null);
}

function editCategory(id, name, description) {
    showCategoryForm('编辑分类', { id, name, description });
}

function showCategoryForm(title, category) {
    document.getElementById('form-modal-title').textContent = title;
    
    const formBody = `
        <div class="mb-4">
            <label for="category-name" class="block text-sm font-medium text-gray-700 mb-2">分类名称</label>
            <input type="text" id="category-name" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value="${category ? category.name : ''}" required>
        </div>
        <div class="mb-4">
            <label for="category-description" class="block text-sm font-medium text-gray-700 mb-2">分类描述</label>
            <textarea id="category-description" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3">${category ? category.description : ''}</textarea>
        </div>
    `;
    
    document.getElementById('form-modal-body').innerHTML = formBody;
    
    // 绑定表单提交事件
    document.getElementById('form-modal-form').onsubmit = function(e) {
        e.preventDefault();
        const name = document.getElementById('category-name').value;
        const description = document.getElementById('category-description').value;
        
        const categoryData = { name, description };
        const url = category ? `/api/admin/categories/${category.id}` : '/api/admin/categories';
        const method = category ? 'PUT' : 'POST';
        
        if (category) {
            categoryData.id = category.id;
        }
        
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(categoryData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                hideFormModal();
                loadCategories();
            } else {
                alert('操作失败: ' + data.message);
            }
        })
        .catch(error => {
            console.error('操作失败:', error);
            alert('操作失败');
        });
    };
    
    showFormModal();
}

function deleteCategory(categoryId) {
    showModal('确认删除', '确定要删除这个分类吗？此操作不可恢复。', () => {
        fetch(`/api/admin/categories/${categoryId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loadCategories();
            } else {
                alert('删除失败: ' + data.message);
            }
        })
        .catch(error => {
            console.error('删除失败:', error);
            alert('删除失败');
        });
    });
}

// ==================== 标签管理 ====================

function loadTags() {
    fetch('/api/admin/tags')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                renderTagsTable(data.data);
            }
        })
        .catch(error => {
            console.error('加载标签列表失败:', error);
        });
}

function renderTagsTable(tags) {
    const container = document.getElementById('tags-table-container');
    
    if (tags.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8">
                <i class="fa fa-tags text-4xl text-gray-300 mb-4"></i>
                <p class="text-gray-500">暂无标签</p>
            </div>
        `;
        return;
    }
    
    const html = `
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名称</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建时间</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${tags.map(tag => `
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900">${tag.name}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ${formatDate(tag.createTime)}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button onclick="editTag(${tag.id}, '${tag.name}')" class="text-blue-600 hover:text-blue-900 mr-3">
                                    编辑
                                </button>
                                <button onclick="deleteTag(${tag.id})" class="text-red-600 hover:text-red-900">
                                    删除
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    container.innerHTML = html;
}

function showAddTagForm() {
    showTagForm('添加标签', null);
}

function editTag(id, name) {
    showTagForm('编辑标签', { id, name });
}

function showTagForm(title, tag) {
    document.getElementById('form-modal-title').textContent = title;
    
    const formBody = `
        <div class="mb-4">
            <label for="tag-name" class="block text-sm font-medium text-gray-700 mb-2">标签名称</label>
            <input type="text" id="tag-name" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value="${tag ? tag.name : ''}" required>
        </div>
    `;
    
    document.getElementById('form-modal-body').innerHTML = formBody;
    
    // 绑定表单提交事件
    document.getElementById('form-modal-form').onsubmit = function(e) {
        e.preventDefault();
        const name = document.getElementById('tag-name').value;
        
        const tagData = { name };
        const url = tag ? `/api/admin/tags/${tag.id}` : '/api/admin/tags';
        const method = tag ? 'PUT' : 'POST';
        
        if (tag) {
            tagData.id = tag.id;
        }
        
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tagData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                hideFormModal();
                loadTags();
            } else {
                alert('操作失败: ' + data.message);
            }
        })
        .catch(error => {
            console.error('操作失败:', error);
            alert('操作失败');
        });
    };
    
    showFormModal();
}

function deleteTag(tagId) {
    showModal('确认删除', '确定要删除这个标签吗？此操作不可恢复。', () => {
        fetch(`/api/admin/tags/${tagId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loadTags();
            } else {
                alert('删除失败: ' + data.message);
            }
        })
        .catch(error => {
            console.error('删除失败:', error);
            alert('删除失败');
        });
    });
}

// ==================== 用户管理 ====================

function loadUsers() {
    fetch('/api/admin/users')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                renderUsersTable(data.data);
            }
        })
        .catch(error => {
            console.error('加载用户列表失败:', error);
        });
}

function renderUsersTable(users) {
    const container = document.getElementById('users-table-container');
    
    if (users.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8">
                <i class="fa fa-users text-4xl text-gray-300 mb-4"></i>
                <p class="text-gray-500">暂无用户</p>
            </div>
        `;
        return;
    }
    
    const html = `
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户名</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">昵称</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">邮箱</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">角色</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">注册时间</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${users.map(user => `
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900">${user.username}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900">${user.nickname || '-'}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900">${user.email || '-'}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}">
                                    ${user.role === 'ADMIN' ? '管理员' : '普通用户'}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ${formatDate(user.createTime)}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button onclick="toggleUserRole(${user.id}, '${user.role}')" class="text-blue-600 hover:text-blue-900 mr-3">
                                    ${user.role === 'ADMIN' ? '设为普通用户' : '设为管理员'}
                                </button>
                                <button onclick="deleteUser(${user.id})" class="text-red-600 hover:text-red-900">
                                    删除
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    container.innerHTML = html;
}

function toggleUserRole(userId, currentRole) {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    const roleText = newRole === 'ADMIN' ? '管理员' : '普通用户';
    
    showModal('确认操作', `确定要将此用户设为${roleText}吗？`, () => {
        fetch(`/api/admin/users/${userId}/role?role=${newRole}`, {
            method: 'PUT'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loadUsers();
            } else {
                alert('操作失败: ' + data.message);
            }
        })
        .catch(error => {
            console.error('操作失败:', error);
            alert('操作失败');
        });
    });
}

function deleteUser(userId) {
    showModal('确认删除', '确定要删除这个用户吗？此操作不可恢复。', () => {
        fetch(`/api/admin/users/${userId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loadUsers();
            } else {
                alert('删除失败: ' + data.message);
            }
        })
        .catch(error => {
            console.error('删除失败:', error);
            alert('删除失败');
        });
    });
}

// ==================== 工具函数 ====================

function showModal(title, message, onConfirm) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').textContent = message;
    
    document.getElementById('modal-confirm').onclick = function() {
        hideModal();
        if (onConfirm) onConfirm();
    };
    
    document.getElementById('modal').classList.remove('hidden');
}

function hideModal() {
    document.getElementById('modal').classList.add('hidden');
}

function showFormModal() {
    document.getElementById('form-modal').classList.remove('hidden');
}

function hideFormModal() {
    document.getElementById('form-modal').classList.add('hidden');
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    try {
        const date = new Date(dateStr);
        return date.toLocaleString('zh-CN');
    } catch (e) {
        return dateStr;
    }
}
