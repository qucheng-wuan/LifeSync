// 成就徽章系统功能
class AchievementsSystem {
    constructor() {
        this.achievements = this.initAchievements();
        this.userStats = this.loadUserStats();
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.updateUserLevel();
        this.updateStats();
        this.renderAchievements();
        this.bindEvents();
    }

    // 初始化成就数据
    initAchievements() {
        return [
            {
                id: 1,
                title: '习惯新手',
                description: '创建你的第一个习惯',
                icon: '🎯',
                rarity: 'common',
                unlocked: true,
                progress: 100,
                maxProgress: 100,
                unlockedDate: '2024-01-05',
                category: 'beginner'
            },
            {
                id: 2,
                title: '连击达人',
                description: '连续打卡7天',
                icon: '🔥',
                rarity: 'common',
                unlocked: true,
                progress: 100,
                maxProgress: 100,
                unlockedDate: '2024-01-12',
                category: 'streak'
            },
            {
                id: 3,
                title: '坚持不懈',
                description: '连续打卡30天',
                icon: '💪',
                rarity: 'rare',
                unlocked: true,
                progress: 100,
                maxProgress: 100,
                unlockedDate: '2024-02-04',
                category: 'streak'
            },
            {
                id: 4,
                title: '习惯专家',
                description: '连续打卡100天',
                icon: '💎',
                rarity: 'epic',
                unlocked: false,
                progress: 89,
                maxProgress: 100,
                category: 'streak'
            },
            {
                id: 5,
                title: '多元发展',
                description: '同时维持5个不同类型的习惯',
                icon: '🌟',
                rarity: 'rare',
                unlocked: true,
                progress: 100,
                maxProgress: 100,
                unlockedDate: '2024-01-28',
                category: 'diversity'
            },
            {
                id: 6,
                title: '完美主义者',
                description: '单周完成率达到100%',
                icon: '✨',
                rarity: 'epic',
                unlocked: true,
                progress: 100,
                maxProgress: 100,
                unlockedDate: '2024-02-10',
                category: 'completion'
            },
            {
                id: 7,
                title: '习惯大师',
                description: '连续打卡365天',
                icon: '👑',
                rarity: 'legendary',
                unlocked: false,
                progress: 89,
                maxProgress: 365,
                category: 'streak'
            },
            {
                id: 8,
                title: '健康守护者',
                description: '完成100次健康相关习惯',
                icon: '🏃‍♂️',
                rarity: 'rare',
                unlocked: true,
                progress: 100,
                maxProgress: 100,
                unlockedDate: '2024-02-15',
                category: 'health'
            },
            {
                id: 9,
                title: '学习达人',
                description: '完成50次学习相关习惯',
                icon: '📚',
                rarity: 'common',
                unlocked: false,
                progress: 38,
                maxProgress: 50,
                category: 'learning'
            }
        ];
    }

    // 加载用户统计数据
    loadUserStats() {
        return {
            level: 8,
            experience: 2450,
            nextLevelExp: 3000,
            totalAchievements: this.achievements.filter(a => a.unlocked).length,
            totalExperience: 2450,
            longestStreak: 15,
            totalDays: 89
        };
    }

    // 更新用户等级
    updateUserLevel() {
        const expPercentage = (this.userStats.experience / this.userStats.nextLevelExp) * 100;
        document.querySelector('.exp-progress').style.width = `${expPercentage}%`;
    }

    // 更新统计数据
    updateStats() {
        document.querySelector('.stat-card:nth-child(1) .stat-value').textContent = this.userStats.totalAchievements;
        document.querySelector('.stat-card:nth-child(2) .stat-value').textContent = this.userStats.totalExperience;
        document.querySelector('.stat-card:nth-child(3) .stat-value').textContent = this.userStats.longestStreak;
        document.querySelector('.stat-card:nth-child(4) .stat-value').textContent = this.userStats.totalDays;
    }

    // 渲染成就
    renderAchievements() {
        const container = document.getElementById('achievementsGrid');
        const filteredAchievements = this.filterAchievements();

        container.innerHTML = filteredAchievements.map(achievement =>
            this.createAchievementCard(achievement)
        ).join('');
    }

    // 筛选成就
    filterAchievements() {
        switch (this.currentFilter) {
            case 'unlocked':
                return this.achievements.filter(a => a.unlocked);
            case 'locked':
                return this.achievements.filter(a => !a.unlocked);
            case 'rare':
                return this.achievements.filter(a => a.rarity !== 'common');
            default:
                return this.achievements;
        }
    }

    // 创建成就卡片
    createAchievementCard(achievement) {
        const unlockedClass = achievement.unlocked ? 'unlocked' : 'locked';
        const rarityClass = `rarity-${achievement.rarity}`;
        const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;

        const unlockedDate = achievement.unlocked && achievement.unlockedDate
            ? `<div class="unlock-date">${achievement.unlockedDate}</div>`
            : '';

        const progressBar = !achievement.unlocked ? `
            <div class="achievement-progress">
                <div class="progress-fill" style="width: ${progressPercentage}%"></div>
            </div>
            <div class="progress-text">${achievement.progress}/${achievement.maxProgress}</div>
        ` : '';

        return `
            <div class="achievement-card ${unlockedClass}" onclick="achievementsSystem.showAchievementDetail(${achievement.id})">
                ${unlockedDate}
                <div class="achievement-icon ${rarityClass} ${unlockedClass}">
                    ${achievement.icon}
                </div>
                <div class="achievement-title">${achievement.title}</div>
                <div class="achievement-description">${achievement.description}</div>
                ${progressBar}
            </div>
        `;
    }

    // 显示成就详情
    showAchievementDetail(id) {
        const achievement = this.achievements.find(a => a.id === id);
        if (!achievement) return;

        const modal = this.createAchievementModal(achievement);
        document.body.appendChild(modal);

        setTimeout(() => modal.classList.add('show'), 100);
    }

    // 创建成就详情模态框
    createAchievementModal(achievement) {
        const modal = document.createElement('div');
        modal.className = 'achievement-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 1000;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const statusText = achievement.unlocked
            ? `<div style="color: #28a745; font-weight: bold;">✅ 已解锁</div>`
            : `<div style="color: #ffc107;">🔒 进度: ${achievement.progress}/${achievement.maxProgress}</div>`;

        modal.innerHTML = `
            <div style="background: white; border-radius: 15px; padding: 2rem; max-width: 400px; text-align: center;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">${achievement.icon}</div>
                <h3>${achievement.title}</h3>
                <p style="color: #666; margin: 1rem 0;">${achievement.description}</p>
                ${statusText}
                ${achievement.unlockedDate ? `<div style="margin-top: 1rem; color: #888;">解锁时间: ${achievement.unlockedDate}</div>` : ''}
                <div style="margin-top: 2rem;">
                    <button onclick="this.closest('.achievement-modal').remove()" 
                            style="background: #667eea; color: white; border: none; padding: 0.8rem 2rem; border-radius: 8px; cursor: pointer;">
                        关闭
                    </button>
                </div>
            </div>
        `;

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        return modal;
    }

    // 绑定事件
    bindEvents() {
        // 筛选标签
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentFilter = tab.dataset.filter;
                this.renderAchievements();
            });
        });

        // 分享按钮
        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const platform = btn.textContent.includes('微信') ? '微信' :
                    btn.textContent.includes('微博') ? '微博' :
                        btn.textContent.includes('邮件') ? '邮件' : '链接';
                this.shareAchievement(platform);
            });
        });
    }

    // 分享成就
    shareAchievement(platform) {
        const shareText = `我在 LifeSync 获得了 ${this.userStats.totalAchievements} 个成就，连续坚持 ${this.userStats.longestStreak} 天！一起养成好习惯吧！`;

        switch (platform) {
            case '微信':
                this.showShareModal('微信分享', shareText);
                break;
            case '微博':
                this.showShareModal('微博分享', shareText);
                break;
            case '邮件':
                window.location.href = `mailto:?subject=分享我的习惯成就&body=${encodeURIComponent(shareText)}`;
                break;
            case '链接':
                navigator.clipboard.writeText(shareText).then(() => {
                    this.showNotification('分享内容已复制到剪贴板！');
                });
                break;
        }
    }

    // 显示分享模态框
    showShareModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'share-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 1000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        modal.innerHTML = `
            <div style="background: white; border-radius: 15px; padding: 2rem; max-width: 400px;">
                <h3>${title}</h3>
                <p style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin: 1rem 0;">${content}</p>
                <div style="text-align: center;">
                    <button onclick="this.closest('.share-modal').remove()" 
                            style="background: #667eea; color: white; border: none; padding: 0.8rem 2rem; border-radius: 8px; cursor: pointer;">
                        关闭
                    </button>
                </div>
            </div>
        `;

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        document.body.appendChild(modal);
    }

    // 显示通知
    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// 初始化
const achievementsSystem = new AchievementsSystem();

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    .achievement-modal.show {
        opacity: 1;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
`;
document.head.appendChild(style); 