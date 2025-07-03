// 现代化首页交互功能

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    initHeroAnimations();
    initDirectoryFilters();
    initVotingSystem();
    initScrollAnimations();
    initNewsletterForm();
    initUserInteractions();
});

// 导航栏交互
function initNavigation() {
    const nav = document.querySelector('.modern-nav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    // 滚动时导航栏效果
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(255, 255, 255, 0.98)';
            nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            nav.style.background = 'rgba(255, 255, 255, 0.95)';
            nav.style.boxShadow = 'none';
        }
    });

    // 移动端菜单切换
    if (navToggle) {
        navToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // 平滑滚动
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Hero区域动画
function initHeroAnimations() {
    // 数字动画
    const statNumbers = document.querySelectorAll('.stat-number');

    function animateNumbers() {
        statNumbers.forEach(stat => {
            const finalNumber = stat.textContent.replace(/[^\d]/g, '');
            if (finalNumber) {
                animateNumber(stat, 0, parseInt(finalNumber), 2000);
            }
        });
    }

    function animateNumber(element, start, end, duration) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }

            const originalText = element.textContent;
            const suffix = originalText.replace(/[\d,]/g, '');
            element.textContent = Math.floor(current).toLocaleString() + suffix;
        }, 16);
    }

    // 检查是否在视口中
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                observer.disconnect();
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        observer.observe(heroStats);
    }
}

// 目录过滤功能
function initDirectoryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const directoryCards = document.querySelectorAll('.directory-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // 移除所有active类
            filterBtns.forEach(b => b.classList.remove('active'));
            // 添加active类到当前按钮
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            directoryCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// 投票系统
function initVotingSystem() {
    const voteBtns = document.querySelectorAll('.vote-btn');

    voteBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const voteCount = this.parentElement.parentElement.querySelector('.votes');
            let currentVotes = parseInt(voteCount.textContent.replace(/[^\d]/g, ''));

            if (this.classList.contains('voted')) {
                // 取消投票
                currentVotes--;
                this.classList.remove('voted');
                this.innerHTML = '<i class="fas fa-heart"></i><span>投票</span>';
                this.style.borderColor = '#ced4da';
                this.style.color = '#6c757d';
            } else {
                // 投票
                currentVotes++;
                this.classList.add('voted');
                this.innerHTML = '<i class="fas fa-heart"></i><span>已投票</span>';
                this.style.borderColor = '#ff758c';
                this.style.color = '#ff758c';

                // 添加点击动画
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            }

            voteCount.textContent = currentVotes.toLocaleString() + ' 票';
        });
    });
}

// 滚动动画
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.nominee-card, .winner-card, .collection-card, .directory-card, .product-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// 新闻订阅表单
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    const newsletterInput = document.querySelector('.newsletter-input');
    const newsletterBtn = document.querySelector('.newsletter-btn');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = newsletterInput.value.trim();

            if (!isValidEmail(email)) {
                showNotification('请输入有效的邮箱地址', 'error');
                return;
            }

            // 显示加载状态
            newsletterBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 订阅中...';
            newsletterBtn.disabled = true;

            // 模拟API调用
            setTimeout(() => {
                showNotification('订阅成功！感谢您的关注', 'success');
                newsletterInput.value = '';
                newsletterBtn.innerHTML = '订阅';
                newsletterBtn.disabled = false;
            }, 1500);
        });
    }
}

// 用户交互功能
function initUserInteractions() {
    // 关注按钮
    const followBtns = document.querySelectorAll('.follow-btn');

    followBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            if (this.classList.contains('following')) {
                // 取消关注
                this.textContent = '关注';
                this.classList.remove('following');
                this.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
                showNotification('已取消关注', 'info');
            } else {
                // 关注
                this.textContent = '已关注';
                this.classList.add('following');
                this.style.background = '#10ac84';
                showNotification('关注成功', 'success');
            }
        });
    });

    // 产品购买按钮
    const productBtns = document.querySelectorAll('.product-btn');

    productBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const productTitle = this.parentElement.querySelector('.product-title').textContent;
            const price = this.parentElement.parentElement.querySelector('.product-price').textContent;

            if (price === '免费') {
                showNotification(`正在下载 "${productTitle}"...`, 'success');
                // 模拟下载
                setTimeout(() => {
                    showNotification('下载完成！', 'success');
                }, 2000);
            } else {
                showNotification(`正在跳转到 "${productTitle}" 的购买页面...`, 'info');
                // 这里可以跳转到购买页面
            }
        });
    });
}

// 工具函数
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;

    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
        font-weight: 500;
    `;

    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;

    document.body.appendChild(notification);

    // 显示动画
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // 自动隐藏
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        'success': '#10ac84',
        'error': '#ff3838',
        'warning': '#ff9f43',
        'info': '#667eea'
    };
    return colors[type] || '#667eea';
}

// 添加CSS动画类
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .notification {
        animation: slideInRight 0.3s ease;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
        }
        to {
            transform: translateX(0);
        }
    }
    
    .nav-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .nav-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .nav-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 80px;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            padding: 2rem;
            transform: translateY(-100%);
            transition: transform 0.3s ease;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .nav-menu.active {
            transform: translateY(0);
        }
        
        .nav-menu .nav-link {
            display: block;
            padding: 0.75rem 0;
            font-size: 1.1rem;
        }
        
        .nav-auth {
            margin-top: 1rem;
            flex-direction: column;
        }
    }
`;
document.head.appendChild(style);

// 性能优化：节流函数
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 为滚动事件添加节流
window.addEventListener('scroll', throttle(function () {
    // 滚动相关的优化处理
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // 视差效果（如果需要）
    const parallaxElements = document.querySelectorAll('.floating-card');
    parallaxElements.forEach((el, index) => {
        const speed = 0.5 + (index * 0.1);
        el.style.transform = `translateY(${scrollTop * speed}px)`;
    });
}, 16));

// 键盘导航支持
document.addEventListener('keydown', function (e) {
    // ESC键关闭移动端菜单
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }
});

// 触摸手势支持（移动端）
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', function (e) {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // 右滑手势关闭移动端菜单
    if (deltaX > 50 && Math.abs(deltaY) < 100) {
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }
});

console.log('🚀 LifeSync Modern Interface Loaded Successfully!'); 