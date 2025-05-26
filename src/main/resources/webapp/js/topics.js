// 文件：src/main/resources/static/js/topics.js

// 获取当前用户ID
function getCurrentUserId() {
    const user = localStorage.getItem('user');
    if (user) {
        return JSON.parse(user).id;
    }
    return null;
}

// 加载所有帖子列表
function loadTopics() {
    console.log('正在加载帖子列表...');
    const topicsContainer = document.getElementById('topics-container');
    if (!topicsContainer) {
        console.error('找不到帖子容器元素');
        return;
    }
    
    // 显示加载中状态
    topicsContainer.innerHTML = `
        <div class="text-center text-gray-500 py-10">
            <i class="fa fa-spinner fa-spin text-2xl mb-2"></i>
            <p>正在加载帖子...</p>
        </div>
    `;
    
    // 发送请求获取帖子列表
    fetch('/api/topics')
        .then(response => {
            console.log('收到帖子列表响应:', response);
            if (!response.ok) {
                throw new Error('获取帖子列表失败: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log('帖子列表数据:', data);
            if (data.success) {
                renderTopics(data.data);
            } else {
                throw new Error(data.message || '获取帖子列表失败');
            }
        })
        .catch(error => {
            console.error('加载帖子列表错误:', error);
            topicsContainer.innerHTML = `
                <div class="text-center text-red-500 py-10">
                    <i class="fa fa-exclamation-circle text-2xl mb-2"></i>
                    <p>加载帖子失败: ${error.message}</p>
                    <button onclick="loadTopics()" class="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
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

// 渲染帖子列表
function renderTopics(topics) {
    const topicsContainer = document.getElementById('topics-container');
    
    if (topics.length === 0) {
        topicsContainer.innerHTML = `
            <div class="text-center text-gray-500 py-10">
                <i class="fa fa-file-text-o text-2xl mb-2"></i>
                <p>暂无帖子</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    topics.forEach(topic => {
        console.log('帖子数据:', topic);
        // 使用topic.username，如果为空则显示"未知用户"
        const username = topic.username || '未知用户';
        
        html += `
            <div class="bg-white rounded-lg shadow-md overflow-hidden mb-4">
                <div class="p-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-2">
                        <a href="#" class="hover:text-blue-500 transition-colors" onclick="showTopicDetail(${topic.id}); return false;">
                            ${topic.title}
                        </a>
                    </h3>
                    <p class="text-gray-600 mb-4 line-clamp-2">${topic.content}</p>
                    <div class="flex justify-between items-center text-sm text-gray-500">
                        <span>
                            <i class="fa fa-user mr-1"></i> 作者: ${username}
                        </span>
                        <span>
                            <i class="fa fa-clock-o mr-1"></i> ${formatDate(topic.createTime)}
                        </span>
                    </div>
                </div>
            </div>
        `;
    });
    
    topicsContainer.innerHTML = html;
}

// 显示帖子详情
function showTopicDetail(topicId) {
    localStorage.setItem('currentTopicId', topicId);
    showPage('topic-detail');
    loadTopicDetail(topicId);
    loadReplies(topicId);
}

// 加载主题详情
function loadTopicDetail(topicId) {
    const topicDetailContainer = document.getElementById('topic-detail-container');
    
    if (!topicId) {
        topicId = localStorage.getItem('currentTopicId');
        if (!topicId) {
            topicDetailContainer.innerHTML = '没有选择帖子';
            return;
        }
    }
    
    // 显示加载中状态
    topicDetailContainer.innerHTML = `
        <div class="text-center text-gray-500 py-10">
            <i class="fa fa-spinner fa-spin text-2xl mb-2"></i>
            <p>正在加载帖子...</p>
        </div>
    `;
    
    fetch(`/api/topics/${topicId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                renderTopicDetail(data.data);
            } else {
                throw new Error(data.message || '加载帖子详情失败');
            }
        })
        .catch(error => {
            console.error('Error loading topic:', error);
            topicDetailContainer.innerHTML = `
                <div class="text-center text-red-500 py-10">
                    <i class="fa fa-exclamation-circle text-2xl mb-2"></i>
                    <p>加载帖子失败: ${error.message}</p>
                </div>
            `;
        });
}

// 渲染帖子详情
function renderTopicDetail(topic) {
    const topicDetailContainer = document.getElementById('topic-detail-container');
    const currentUserId = getCurrentUserId();
    console.log('当前用户ID:', currentUserId);
    console.log('帖子作者ID:', topic.userId);
    const isAuthor = currentUserId && currentUserId == topic.userId;
    
    // 使用topic.username，如果为空则显示"未知用户"
    const username = topic.username || '未知用户';
    
    const html = `
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-6">
                <div class="flex justify-between items-start mb-4">
                    <h2 class="text-2xl font-bold text-gray-800">${topic.title}</h2>
                    ${isAuthor ? `
                        <div class="flex space-x-2">
                            <button onclick="showEditTopicForm(${topic.id}, '${topic.title}', '${topic.content}')" class="text-blue-500 hover:text-blue-700">
                                <i class="fa fa-edit"></i> 编辑
                            </button>
                            <button onclick="deleteTopic(${topic.id})" class="text-red-500 hover:text-red-700">
                                <i class="fa fa-trash"></i> 删除
                            </button>
                        </div>
                    ` : ''}
                </div>
                <div class="mb-4 text-gray-600 whitespace-pre-wrap">${topic.content}</div>
                <div class="flex justify-between items-center text-sm text-gray-500">
                    <span>
                        <i class="fa fa-user mr-1"></i> 作者: ${username}
                    </span>
                    <span>
                        <i class="fa fa-clock-o mr-1"></i> ${formatDate(topic.createTime)}
                    </span>
                </div>
            </div>
        </div>
    `;
    
    topicDetailContainer.innerHTML = html;
}

// 创建新帖子
function handleCreateTopic() {
    const title = document.getElementById('topic-title').value;
    const content = document.getElementById('topic-content').value;
    const userId = getCurrentUserId();

    if (!userId) {
        showModal('创建失败', '请先登录再发布帖子');
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

    fetch(`/api/topics?userId=${userId}`, {
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
            throw new Error('创建帖子失败：' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        hideLoading();
        if (data.success) {
            showModal('创建成功', '帖子已成功发布', function() {
                // 清空表单
                document.getElementById('topic-title').value = '';
                document.getElementById('topic-content').value = '';
                // 跳转到帖子列表页
                showPage('topics');
            });
        } else {
            throw new Error(data.message || '创建帖子失败');
        }
    })
    .catch(error => {
        hideLoading();
        showModal('创建失败', error.message);
        console.error('创建帖子错误:', error);
    });
}

// 显示编辑帖子表单
function showEditTopicForm(topicId, title, content) {
    document.getElementById('update-topic-id').value = topicId;
    document.getElementById('update-topic-title').value = title;
    document.getElementById('update-topic-content').value = content;
    showPage('update-topic');
}

// 更新主题
function handleUpdateTopic() { 
    const topicId = document.getElementById('update-topic-id').value;
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

    // 构建包含userId的URL
    fetch(`/api/topics/${topicId}?userId=${userId}`, { 
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
            throw new Error('更新帖子失败：' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        hideLoading();
        if (data.success) {
            showModal('更新成功', '帖子已成功更新', function() {
                showTopicDetail(topicId);
            });
        } else {
            throw new Error(data.message || '更新帖子失败');
        }
    })
    .catch(error => {
        hideLoading();
        showModal('更新失败', error.message);
        console.error('更新帖子错误:', error);
    });
}

// 删除帖子
function deleteTopic(topicId) {
    const userId = getCurrentUserId();
    
    if (!userId) {
        showModal('删除失败', '请先登录');
        return;
    }
    
    if (!confirm('确定要删除这个帖子吗？此操作不可撤销。')) {
        return;
    }
    
    showLoading('正在删除...');
    
    fetch(`/api/topics/${topicId}?userId=${userId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('删除帖子失败：' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        hideLoading();
        if (data.success) {
            showModal('删除成功', '帖子已成功删除', function() {
                showPage('topics');
            });
        } else {
            throw new Error(data.message || '删除帖子失败');
        }
    })
    .catch(error => {
        hideLoading();
        showModal('删除失败', error.message);
        console.error('删除帖子错误:', error);
    });
}

// 初始化事件监听
document.addEventListener('DOMContentLoaded', () => {
    // 创建帖子表单提交
    const createTopicForm = document.getElementById('create-topic-form');
    if (createTopicForm) {
        createTopicForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleCreateTopic();
        });
    }
    
    // 更新帖子表单提交
    const updateTopicForm = document.getElementById('update-topic-form');
    if (updateTopicForm) {
        updateTopicForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleUpdateTopic();
        });
    }
    
    // 取消创建帖子
    const cancelCreateTopic = document.getElementById('cancel-create-topic');
    if (cancelCreateTopic) {
        cancelCreateTopic.addEventListener('click', function() {
            showPage('topics');
        });
    }
    
    // 取消更新帖子
    const cancelUpdateTopic = document.getElementById('cancel-update-topic');
    if (cancelUpdateTopic) {
        cancelUpdateTopic.addEventListener('click', function() {
            const topicId = document.getElementById('update-topic-id').value;
            showTopicDetail(topicId);
        });
    }
    
    // 创建帖子按钮
    const createTopicBtn = document.getElementById('create-topic-btn');
    if (createTopicBtn) {
        createTopicBtn.addEventListener('click', function() {
            showPage('create-topic');
        });
    }
});