// 文件：src/main/resources/static/js/replies.js

// 获取当前用户ID
function getCurrentUserId() {
    const user = localStorage.getItem('user');
    if (user) {
        return JSON.parse(user).id;
    }
    return null;
}

// 获取当前主题ID
function getCurrentTopicId() {
    return localStorage.getItem('currentTopicId');
}

// 加载回复列表
function loadReplies(topicId) {
    if (!topicId) {
        topicId = getCurrentTopicId();
        if (!topicId) {
            console.error('没有选择帖子，无法加载回复');
            return;
        }
    }
    
    const repliesContainer = document.getElementById('replies-container');
    if (!repliesContainer) {
        console.error('找不到回复列表容器');
        return;
    }
    
    // 显示加载中的状态
    let loadingHtml = `
        <h3 class="text-xl font-bold text-gray-800 mb-4">回复列表</h3>
        <div class="text-center text-gray-500 py-10">
            <i class="fa fa-spinner fa-spin text-2xl mb-2"></i>
            <p>正在加载回复...</p>
        </div>
    `;
    repliesContainer.innerHTML = loadingHtml;
    
    // 发送请求获取回复列表
    fetch(`/api/topics/${topicId}/replies`)
        .then(response => {
            if (!response.ok) {
                throw new Error('获取回复列表失败: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                renderReplies(data.data);
            } else {
                throw new Error(data.message || '获取回复列表失败');
            }
        })
        .catch(error => {
            console.error('加载回复列表错误:', error);
            let errorHtml = `
                <h3 class="text-xl font-bold text-gray-800 mb-4">回复列表</h3>
                <div class="text-center text-red-500 py-10">
                    <i class="fa fa-exclamation-circle text-2xl mb-2"></i>
                    <p>加载回复失败: ${error.message}</p>
                    <button onclick="loadReplies(${topicId})" class="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                        <i class="fa fa-refresh mr-2"></i>重新加载
                    </button>
                </div>
            `;
            repliesContainer.innerHTML = errorHtml;
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

// 渲染回复列表
function renderReplies(replies) {
    const repliesContainer = document.getElementById('replies-container');
    
    let html = `<h3 class="text-xl font-bold text-gray-800 mb-4">回复列表 (${replies.length})</h3>`;
    
    if (replies.length === 0) {
        html += `
            <div class="text-center text-gray-500 py-10">
                <i class="fa fa-comments-o text-2xl mb-2"></i>
                <p>暂无回复，快来发表第一条回复吧！</p>
            </div>
        `;
    } else {
        replies.forEach((reply, index) => {
            console.log('回复数据:', reply);
            // 使用reply中的username，如果为空则显示"未知用户"
            const username = reply.username || '未知用户';
            
            html += `
                <div class="bg-white rounded-lg shadow-md overflow-hidden mb-4">
                    <div class="p-6">
                        <div class="flex justify-between items-start mb-4">
                            <div class="flex items-center">
                                <div class="bg-blue-500 rounded-full h-10 w-10 flex items-center justify-center text-white font-bold">
                                    ${index + 1}
                                </div>
                                <div class="ml-3">
                                    <p class="text-gray-700">用户: ${username}</p>
                                </div>
                            </div>
                            <span class="text-sm text-gray-500">
                                <i class="fa fa-clock-o mr-1"></i> ${formatDate(reply.createTime)}
                            </span>
                        </div>
                        <div class="text-gray-600 whitespace-pre-wrap">${reply.content}</div>
                    </div>
                </div>
            `;
        });
    }
    
    repliesContainer.innerHTML = html;
}

// 发表回复
function handleCreateReply() {
    const content = document.getElementById('reply-content').value;
    const topicId = getCurrentTopicId();
    const userId = getCurrentUserId();
    
    if (!userId) {
        showModal('发表失败', '请先登录再发表回复');
        return;
    }
    
    if (!topicId) {
        showModal('发表失败', '无法确定回复的帖子');
        return;
    }
    
    if (!content.trim()) {
        showModal('发表失败', '回复内容不能为空');
        return;
    }
    
    showLoading('正在发表回复...');
    
    fetch(`/api/topics/${topicId}/replies?userId=${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content: content
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('发表回复失败：' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        hideLoading();
        if (data.success) {
            // 清空回复框
            document.getElementById('reply-content').value = '';
            // 显示成功消息
            showModal('发表成功', '回复已成功发表');
            // 重新加载回复列表
            loadReplies(topicId);
        } else {
            throw new Error(data.message || '发表回复失败');
        }
    })
    .catch(error => {
        hideLoading();
        showModal('发表失败', error.message);
        console.error('发表回复错误:', error);
    });
}

// 初始化事件监听
document.addEventListener('DOMContentLoaded', () => {
    // 回复表单提交
    const replyForm = document.getElementById('reply-form');
    if (replyForm) {
        replyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleCreateReply();
        });
    }
});