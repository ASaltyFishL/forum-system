// 应用程序主逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 初始化页面
    initPage();
    // 初始化导航栏
    initNavbar();
    // 初始化页面导航
    initPageNavigation();
    // 初始化模态框
    initModal();
    // 检查用户登录状态
    checkAuthStatus();
});

// 初始化页面
function initPage() {
    // 显示首页
    showPage('home');
}

// 初始化导航栏
function initNavbar() {
    const navbar = document.getElementById('navbar');
    
    // 导航栏滚动效果
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // 向下滚动，隐藏导航栏
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // 向上滚动，显示导航栏
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// 初始化页面导航
function initPageNavigation() {
    // 获取所有带有 data-page 属性的链接
    const pageLinks = document.querySelectorAll('[data-page]');
    
    // 为每个链接添加点击事件监听器
    pageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // 阻止默认的链接行为
            const pageName = this.getAttribute('data-page');
            showPage(pageName);
        });
    });
}

// 显示指定的页面
function showPage(pageName) {
    // 隐藏所有页面
    const pages = document.querySelectorAll('.page-content');
    pages.forEach(page => page.classList.add('hidden'));
    
    // 显示指定的页面
    const targetPage = document.getElementById(pageName + '-page');
    if (targetPage) {
        targetPage.classList.remove('hidden');
    }

    // 如果是博客列表页面，加载博客
    if (pageName === 'blogs') {
        loadBlogs();
    }
    // 如果是博客详情页面，加载博客详情
    else if (pageName === 'blog-detail') {
        // 从localStorage获取博客ID，如果没有则尝试获取第一篇博客的ID
        let blogId = localStorage.getItem('currentBlogId');
        if (!blogId) {
            console.log('没有找到当前博客ID，尝试获取第一篇博客的ID...');
            
            // 先尝试获取第一篇博客的ID
            fetch('/api/blogs?page=1&pageSize=1')
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('获取博客列表失败');
                })
                .then(data => {
                    if (data.success && data.data && data.data.pageInfo && data.data.pageInfo.data && data.data.pageInfo.data.length > 0) {
                        blogId = data.data.pageInfo.data[0].id;
                        localStorage.setItem('currentBlogId', blogId);
                        loadBlogDetail(blogId);
                    } else {
                        // 如果没有博客，显示提示信息
                        const blogDetailContainer = document.getElementById('blog-detail-container');
                        if (blogDetailContainer) {
                            blogDetailContainer.innerHTML = `
                                <div class="text-center text-gray-500 py-10">
                                    <i class="fa fa-file-text-o text-2xl mb-2"></i>
                                    <p>暂无博客内容</p>
                                    <button onclick="showPage('blogs')" class="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                                        <i class="fa fa-list mr-2"></i>查看博客列表
                                    </button>
                                </div>
                            `;
                        }
                    }
                })
                .catch(error => {
                    console.error('获取博客ID失败:', error);
                    loadBlogDetail(); // 调用原始函数，让它处理没有ID的情况
                });
        } else {
            loadBlogDetail(blogId);
        }
    }
}

// 初始化模态框
function initModal() {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    const closeModal = document.getElementById('close-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    
    function hideModal() {
        modal.classList.add('hidden');
        modalContent.classList.add('scale-95', 'opacity-0');
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', hideModal);
    }
    
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', hideModal);
    }
    
    // 点击模态框背景关闭
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            hideModal();
        }
    });
}

// 显示模态框
function showModal(title, message, callback) {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    modalTitle.textContent = title;
    modalBody.textContent = message;
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        modalContent.classList.remove('scale-95', 'opacity-0');
    }, 10);
    
    // 如果提供了回调函数，在关闭模态框时执行
    if (callback) {
        const modalCloseBtn = document.getElementById('modal-close-btn');
        const closeModal = document.getElementById('close-modal');
        
        const handleClose = function() {
            callback();
            modalCloseBtn.removeEventListener('click', handleClose);
            closeModal.removeEventListener('click', handleClose);
        };
        
        modalCloseBtn.addEventListener('click', handleClose);
        closeModal.addEventListener('click', handleClose);
    }
}

// 显示加载指示器
function showLoading(message = '加载中...') {
    const loading = document.getElementById('loading-indicator');
    const loadingText = document.getElementById('loading-text');
    
    if (loadingText) {
        loadingText.textContent = message;
    }
    
    if (loading) {
        loading.classList.remove('hidden');
    }
}

// 隐藏加载指示器
function hideLoading() {
    const loading = document.getElementById('loading-indicator');
    if (loading) {
        loading.classList.add('hidden');
    }
}