// LifeSync - 公共JavaScript文件

document.addEventListener('DOMContentLoaded', function () {
    // 初始化页面
    initializePage();

    // 高亮当前页面菜单项
    highlightCurrentPage();

    // 添加面包屑导航
    addBreadcrumb();

    // 页面加载动画
    pageLoadAnimation();

    // 初始化下拉菜单
    initDropdownMenus();
});

// 初始化页面通用功能
function initializePage() {
    console.log('LifeSync 页面已加载');

    // 检查本地存储支持
    if (typeof (Storage) !== "undefined") {
        console.log('本地存储支持正常');
    } else {
        console.log('浏览器不支持本地存储');
    }
}

// 高亮当前页面菜单项
function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// 添加面包屑导航
function addBreadcrumb() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const breadcrumbMap = {
        'index.html': '首页',
        'search.html': '首页 > 搜索功能',
        'habit-detail.html': '首页 > 习惯详情',
        'login.html': '首页 > 登录注册',
        'pomodoro.html': '首页 > 时间管理 > 番茄钟',
        'calendar.html': '首页 > 时间管理 > 日程安排',
        'time-stats.html': '首页 > 时间管理 > 时间统计',
        'habits.html': '首页 > 习惯养成 > 习惯列表',
        'habit-tracker.html': '首页 > 习惯养成 > 习惯打卡',
        'achievements.html': '首页 > 习惯养成 > 成就系统',
        'mood-record.html': '首页 > 心情日记 > 记录心情',
        'diary-list.html': '首页 > 心情日记 > 日记列表',
        'mood-analysis.html': '首页 > 心情日记 > 情感分析',
        'goals.html': '首页 > 目标管理 > 目标列表',
        'goal-planning.html': '首页 > 目标管理 > 目标规划',
        'progress-tracking.html': '首页 > 目标管理 > 进度追踪',
        'profile.html': '首页 > 个人中心',
        'settings.html': '首页 > 个人中心 > 设置',
        'help.html': '首页 > 帮助中心',
        'feedback.html': '首页 > 用户反馈'
    };

    const mainContent = document.querySelector('.main-content');
    if (breadcrumbMap[currentPage] && mainContent) {
        const existingBreadcrumb = document.querySelector('.breadcrumb');
        if (!existingBreadcrumb) {
            const breadcrumb = document.createElement('nav');
            breadcrumb.className = 'breadcrumb';
            breadcrumb.innerHTML = `<p>📍 ${breadcrumbMap[currentPage]}</p>`;
            mainContent.prepend(breadcrumb);
        }
    }
}

// 页面加载动画
function pageLoadAnimation() {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.style.opacity = '0';
        mainContent.style.transform = 'translateY(20px)';

        setTimeout(() => {
            mainContent.style.transition = 'all 0.5s ease';
            mainContent.style.opacity = '1';
            mainContent.style.transform = 'translateY(0)';
        }, 100);
    }
}

// 初始化下拉菜单
function initDropdownMenus() {
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', function () {
            const menu = this.querySelector('.dropdown-menu');
            if (menu) {
                menu.style.display = 'block';
            }
        });

        dropdown.addEventListener('mouseleave', function () {
            const menu = this.querySelector('.dropdown-menu');
            if (menu) {
                menu.style.display = 'none';
            }
        });
    });
}

// HTML实体编码函数（XSS防护）
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 安全的DOM内容设置
function setTextContent(elementId, content) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = content; // 使用textContent而不是innerHTML
    }
}

// 格式化日期
function formatDate(date) {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(date).toLocaleDateString('zh-CN', options);
}

// 生成随机ID
function generateId() {
    return 'id_' + Math.random().toString(36).substr(2, 9);
}

// 显示通知消息
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 8px;
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 本地存储操作
const Storage = {
    set: function (key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('存储数据失败:', e);
        }
    },

    get: function (key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('读取数据失败:', e);
            return defaultValue;
        }
    },

    remove: function (key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('删除数据失败:', e);
        }
    }
};

// 导出全局函数
window.LifeSync = {
    escapeHtml,
    setTextContent,
    formatDate,
    generateId,
    showNotification,
    Storage
}; 