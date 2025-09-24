// 文件：src/main/resources/webapp/js/comments.js

// 获取当前用户ID
function getCurrentUserId() {
    const user = localStorage.getItem('user');
    if (user) {
        return JSON.parse(user).id;
    }
    return null;
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
    
    // 添加评论表单
    const currentUserId = getCurrentUserId();
    if (currentUserId) {
        html += `
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <h4 class="text-lg font-semibold text-gray-800 mb-4">发表评论</h4>
                <div class="mb-4">
                    <textarea id="comment-content" rows="4" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="写下你的评论..."></textarea>
                </div>
                <button onclick="submitComment()" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded">
                    <i class="fa fa-paper-plane mr-2"></i>发表评论
                </button>
            </div>
        `;
    }
    
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
                            <h4 class="font-semibold text-gray-800">${comment.username || '匿名用户'}</h4>
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

// 提交评论
function submitComment() {
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
            approved: false // 新评论需要审核
        })
    })
        .then(response => response.json())
        .then(data => {
            hideLoading();
            
            if (data.success) {
                document.getElementById('comment-content').value = '';
                showModal('评论提交成功', '评论已提交，等待审核通过后显示', function() {
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