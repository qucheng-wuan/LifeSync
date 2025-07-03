// 个人资料页面功能
class ProfileManager {
    constructor() {
        this.userProfile = this.loadProfile();
        this.achievements = this.loadAchievements();
        this.activities = this.loadActivities();
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateProfileDisplay();
        this.renderAchievements();
        this.renderActivities();
        this.setupToggleSwitches();
    }

    // 加载用户资料
    loadProfile() {
        const defaultProfile = {
            name: '张三',
            email: 'zhangsan@example.com',
            phone: '138****1234',
            birthday: '1995-06-15',
            occupation: '软件工程师',
            location: '北京市',
            bio: '热爱生活，追求高效的时间管理和健康的生活方式。',
            title: '生活管理专家',
            avatar: null,
            preferences: {
                emailNotification: true,
                pushNotification: false,
                darkMode: false,
                autoBackup: true,
                dataAnalysis: true,
                privacyProtection: true
            }
        };

        return JSON.parse(localStorage.getItem('userProfile')) || defaultProfile;
    }

    // 加载成就数据
    loadAchievements() {
        return [
            { icon: '🏃‍♂️', title: '运动达人', desc: '连续运动30天' },
            { icon: '📚', title: '学习之星', desc: '完成100小时学习' },
            { icon: '😊', title: '快乐生活', desc: '连续记录心情21天' },
            { icon: '⏰', title: '时间管理', desc: '专注时长超过500小时' },
            { icon: '🎯', title: '目标达成', desc: '完成10个长期目标' },
            { icon: '🌟', title: '全面发展', desc: '各项能力均衡提升' }
        ];
    }

    // 加载活动记录
    loadActivities() {
        return [
            { icon: '✅', text: '完成了晨练习惯', time: '2小时前', type: 'habit' },
            { icon: '😊', text: '记录了今日心情', time: '3小时前', type: 'mood' },
            { icon: '⏰', text: '完成了2小时专注工作', time: '5小时前', type: 'focus' },
            { icon: '🏆', text: '获得了"连续记录"成就', time: '昨天', type: 'achievement' },
            { icon: '📚', text: '完成了情绪训练课程', time: '昨天', type: 'training' },
            { icon: '📝', text: '更新了个人目标', time: '2天前', type: 'goal' },
            { icon: '🎯', text: '达成了月度目标', time: '3天前', type: 'goal' },
            { icon: '💭', text: '写了一篇反思日记', time: '3天前', type: 'reflection' }
        ];
    }

    // 绑定事件
    bindEvents() {
        // 表单提交
        document.getElementById('profileForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProfile();
        });

        // 头像上传
        document.getElementById('avatarInput')?.addEventListener('change', (e) => {
            this.handleAvatarUpload(e);
        });

        // 快速操作按钮
        this.bindQuickActions();
    }

    // 绑定快速操作
    bindQuickActions() {
        // 这些函数会在HTML中直接调用
        window.uploadAvatar = () => {
            document.getElementById('avatarInput')?.click();
        };

        window.exportData = () => {
            this.exportUserData();
        };

        window.backupData = () => {
            this.backupUserData();
        };
    }

    // 更新资料显示
    updateProfileDisplay() {
        // 更新头部信息
        document.getElementById('userName').textContent = this.userProfile.name;
        document.getElementById('userTitle').textContent = this.userProfile.title;

        // 更新统计数据
        this.updateStats();

        // 填充表单
        this.fillForm();
    }

    // 更新统计数据
    updateStats() {
        // 计算使用天数
        const startDate = new Date('2024-01-01');
        const today = new Date();
        const totalDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));

        // 从各模块获取统计数据
        const habits = JSON.parse(localStorage.getItem('habits')) || [];
        const moodEntries = JSON.parse(localStorage.getItem('moodEntries')) || [];
        const achievements = this.achievements;

        // 更新显示
        document.getElementById('totalDays').textContent = totalDays;
        document.getElementById('totalHabits').textContent = habits.length;
        document.getElementById('achievementCount').textContent = achievements.length;
        document.getElementById('moodEntries').textContent = moodEntries.length;
    }

    // 填充表单
    fillForm() {
        const profile = this.userProfile;
        document.getElementById('displayName').value = profile.name;
        document.getElementById('email').value = profile.email;
        document.getElementById('phone').value = profile.phone;
        document.getElementById('birthday').value = profile.birthday;
        document.getElementById('occupation').value = profile.occupation;
        document.getElementById('location').value = profile.location;
        document.getElementById('bio').value = profile.bio;
    }

    // 设置切换开关
    setupToggleSwitches() {
        document.querySelectorAll('.toggle-switch').forEach(toggle => {
            const setting = toggle.dataset.setting;
            const isActive = this.userProfile.preferences[setting];

            if (isActive) {
                toggle.classList.add('active');
            }

            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
                this.userProfile.preferences[setting] = toggle.classList.contains('active');
                this.saveProfile();
            });
        });
    }

    // 处理头像上传
    handleAvatarUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const avatarImg = document.getElementById('userAvatar');
                avatarImg.src = e.target.result;
                this.userProfile.avatar = e.target.result;
                this.saveProfile();
                this.showNotification('头像上传成功！', 'success');
            };
            reader.readAsDataURL(file);
        }
    }

    // 保存资料
    saveProfile() {
        // 获取表单数据
        this.userProfile.name = document.getElementById('displayName').value;
        this.userProfile.email = document.getElementById('email').value;
        this.userProfile.phone = document.getElementById('phone').value;
        this.userProfile.birthday = document.getElementById('birthday').value;
        this.userProfile.occupation = document.getElementById('occupation').value;
        this.userProfile.location = document.getElementById('location').value;
        this.userProfile.bio = document.getElementById('bio').value;

        // 保存到本地存储
        localStorage.setItem('userProfile', JSON.stringify(this.userProfile));

        // 更新显示
        this.updateProfileDisplay();

        // 显示成功消息
        this.showNotification('个人资料已保存！', 'success');
    }

    // 渲染成就
    renderAchievements() {
        const container = document.getElementById('achievementsContainer');
        if (!container) return;

        container.innerHTML = this.achievements.map(achievement => `
            <div class="achievement-item">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-title">${achievement.title}</div>
                <div class="achievement-desc">${achievement.desc}</div>
            </div>
        `).join('');
    }

    // 渲染活动记录
    renderActivities() {
        const container = document.getElementById('activityFeed');
        if (!container) return;

        container.innerHTML = this.activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon" style="background: ${this.getActivityColor(activity.type)};">
                    ${activity.icon}
                </div>
                <div class="activity-content">
                    <div class="activity-text">${activity.text}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `).join('');
    }

    // 获取活动颜色
    getActivityColor(type) {
        const colors = {
            habit: '#00b894',
            mood: '#fd79a8',
            focus: '#667eea',
            achievement: '#fdcb6e',
            training: '#a29bfe',
            goal: '#00cec9',
            reflection: '#74b9ff'
        };
        return colors[type] || '#666';
    }

    // 导出用户数据
    exportUserData() {
        const userData = {
            profile: this.userProfile,
            habits: JSON.parse(localStorage.getItem('habits')) || [],
            moodEntries: JSON.parse(localStorage.getItem('moodEntries')) || [],
            focusHistory: JSON.parse(localStorage.getItem('focusHistory')) || [],
            achievements: this.achievements,
            trainingProgress: JSON.parse(localStorage.getItem('trainingProgress')) || {},
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `lifesync_data_${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        this.showNotification('数据导出成功！', 'success');
    }

    // 备份用户数据
    backupUserData() {
        const backupData = {
            profile: this.userProfile,
            habits: JSON.parse(localStorage.getItem('habits')) || [],
            moodEntries: JSON.parse(localStorage.getItem('moodEntries')) || [],
            settings: JSON.parse(localStorage.getItem('settings')) || {},
            backupDate: new Date().toISOString()
        };

        localStorage.setItem('backup_' + Date.now(), JSON.stringify(backupData));
        this.showNotification('数据备份完成！', 'success');
    }

    // 显示通知
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#00b894' : '#74b9ff'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // 获取用户资料
    getProfile() {
        return this.userProfile;
    }

    // 更新资料
    updateProfile(updates) {
        Object.assign(this.userProfile, updates);
        this.saveProfile();
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.profileManager = new ProfileManager();
});

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style); 