// 身份验证相关功能
document.addEventListener('DOMContentLoaded', function() {
    // 注册表单提交
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegister();
        });
    }

    // 登录表单提交
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }

    // 退出登录按钮
    const logoutBtn = document.getElementById('logout-btn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});

// 处理注册
function handleRegister() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    if (!username || !password) {
        showModal('注册失败', '用户名和密码不能为空');
        return;
    }

    showLoading('正在注册...');

    fetch('/api/user/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
        .then(response => response.json())
        .then(data => {
            hideLoading();

            if (data.success) {
                showModal('注册成功', '您已成功注册，可以登录了', function() {
                    showPage('login');
                });
            } else {
                showModal('注册失败', data.message);
            }
        })
        .catch(error => {
            hideLoading();
            showModal('注册失败', '网络错误，请稍后重试');
            console.error('Registration error:', error);
        });
}

// 处理登录
function handleLogin() { 
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    if (!username || !password) {
        showModal('登录失败', '用户名和密码不能为空');
        return;
    }

    showLoading('正在登录...');
    
    console.log('准备发送登录请求...');

    fetch('/api/user/login', { 
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        credentials: 'include',
        mode: 'cors',
        cache: 'no-cache', // 禁用缓存
        redirect: 'follow', // 允许重定向
        body: JSON.stringify({ 
            username: username, 
            password: password 
        })
    })
    .then(response => {
        console.log('收到登录响应:', response);
        console.log('响应状态:', response.status);
        console.log('响应头:', response.headers);
        
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('用户名或密码错误');
            } else if (response.status === 404) {
                throw new Error('登录服务不可用');
            } else if (response.status === 405) {
                throw new Error('请求方法不允许，请联系管理员');
            } else {
                throw new Error('登录失败：' + response.status);
            }
        }
        return response.json();
    })
    .then(data => {
        console.log('登录数据:', data);
        hideLoading();
        if (data.success) {
            // 保存用户信息到本地存储
            console.log('保存用户信息:', data.data);
            
            // 确保data.data包含id字段
            if (!data.data || !data.data.id) {
                console.error('用户信息中缺少ID字段:', data.data);
                showModal('登录成功但用户ID缺失', '请联系管理员');
                return;
            }
            
            localStorage.setItem('user', JSON.stringify(data.data));
            console.log('保存到localStorage的用户信息:', localStorage.getItem('user'));
            
            // 更新UI
            updateAuthUI(true);
            // 跳转到首页
            showPage('home');
            showModal('登录成功', '欢迎回来！');
        } else {
            throw new Error(data.message || '登录失败');
        }
    })
    .catch(error => {
        console.error('登录错误:', error);
        hideLoading();
        showModal('登录失败', error.message);
    });
}

// 处理退出登录
function handleLogout() {
    // 移除本地存储中的用户信息
    localStorage.removeItem('user');

    // 更新导航栏
    updateAuthUI(false);

    // 显示登录页
    showPage('login');

    showModal('退出成功', '您已成功退出登录');
}

// 检查用户登录状态
function checkAuthStatus() {
    const user = localStorage.getItem('user');

    if (user) {
        updateAuthUI(true);
    } else {
        updateAuthUI(false);
    }
}

// 更新认证UI
function updateAuthUI(isLoggedIn) {
    const authLinks = document.getElementById('auth-links');
    const userLinks = document.getElementById('user-links');
    const createTopicBtn = document.getElementById('create-topic-btn');
    const replyFormContainer = document.getElementById('reply-form-container');

    if (isLoggedIn) {
        const user = JSON.parse(localStorage.getItem('user'));

        document.getElementById('username-display').textContent = user.username;

        authLinks.classList.add('hidden');
        userLinks.classList.remove('hidden');
        userLinks.classList.add('flex');


        createTopicBtn.classList.remove('hidden');
        replyFormContainer.classList.remove('hidden');
    } else {
        authLinks.classList.remove('hidden');
        userLinks.classList.add('hidden');
        userLinks.classList.remove('flex');


        createTopicBtn.classList.add('hidden');
        replyFormContainer.classList.add('hidden');
    }
}

// 获取当前用户ID
function getCurrentUserId() {
    const user = localStorage.getItem('user');
    if (user) {
        return JSON.parse(user).id;
    }
    return null;
}