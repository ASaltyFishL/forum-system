// ==================== 博客管理 ====================

function showAddBlogForm() {
    document.getElementById('form-modal-title').textContent = '新建博客';
    
    const formBody = `
        <div class="mb-4">
            <label for="admin-blog-title" class="block text-sm font-medium text-gray-700 mb-2">博客标题 *</label>
            <input type="text" id="admin-blog-title" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
        </div>
        <div class="mb-4">
            <label for="admin-blog-content" class="block text-sm font-medium text-gray-700 mb-2">博客内容 *</label>
            <textarea id="admin-blog-content" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" rows="6" required></textarea>
        </div>
        <div class="mb-4">
            <label for="admin-blog-category" class="block text-sm font-medium text-gray-700 mb-2">分类 *</label>
            <select id="admin-blog-category" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                <option value="">请选择分类</option>
            </select>
        </div>
        <div class="mb-4">
            <label for="admin-blog-tags" class="block text-sm font-medium text-gray-700 mb-2">标签</label>
            <select id="admin-blog-tags" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" multiple>
                <!-- 标签选项将通过JavaScript动态加载 -->
            </select>
            <p class="text-sm text-gray-500 mt-1">按住Ctrl键可多选标签</p>
        </div>
        <div class="mb-4">
            <label for="admin-blog-published" class="block text-sm font-medium text-gray-700 mb-2">发布状态</label>
            <select id="admin-blog-published" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="true">立即发布</option>
                <option value="false">保存为草稿</option>
            </select>
        </div>
    `;
    
    document.getElementById('form-modal-body').innerHTML = formBody;
    
    // 加载分类和标签选项
    loadAdminBlogOptions();
    
    // 绑定表单提交事件
    document.getElementById('form-modal-form').onsubmit = function(e) {
        e.preventDefault();
        const title = document.getElementById('admin-blog-title').value;
        const content = document.getElementById('admin-blog-content').value;
        const categoryId = document.getElementById('admin-blog-category').value;
        const published = document.getElementById('admin-blog-published').value === 'true';
        const selectedTags = Array.from(document.getElementById('admin-blog-tags').selectedOptions).map(option => ({
            id: parseInt(option.value),
            name: option.text
        }));
        
        if (!title || !content || !categoryId) {
            alert('请填写所有必填字段');
            return;
        }
        
        const blogData = {
            title,
            content,
            categoryId: parseInt(categoryId),
            published,
            tags: selectedTags
        };
        
        fetch('/api/blogs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(blogData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                hideFormModal();
                loadBlogs();
                alert('博客创建成功！');
            } else {
                alert('创建失败: ' + data.message);
            }
        })
        .catch(error => {
            console.error('创建博客失败:', error);
            alert('创建失败: ' + error.message);
        });
    };
    
    showFormModal();
}

function loadAdminBlogOptions() {
    // 加载分类选项
    fetch('/api/categories')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const categorySelect = document.getElementById('admin-blog-category');
                categorySelect.innerHTML = '<option value="">请选择分类</option>';
                data.data.forEach(category => {
                    categorySelect.innerHTML += `<option value="${category.id}">${category.name}</option>`;
                });
            }
        })
        .catch(error => {
            console.error('加载分类失败:', error);
        });
    
    // 加载标签选项
    fetch('/api/tags')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const tagSelect = document.getElementById('admin-blog-tags');
                tagSelect.innerHTML = ''; // 清空现有选项
                data.data.forEach(tag => {
                    const option = document.createElement('option');
                    option.value = tag.id;
                    option.textContent = tag.name;
                    tagSelect.appendChild(option);
                });
            }
        })
        .catch(error => {
            console.error('加载标签失败:', error);
        });
}
