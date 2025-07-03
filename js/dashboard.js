// 数据概览仪表盘功能
class Dashboard {
    constructor() {
        this.data = this.loadAllData();
        this.stats = this.calculateStats();
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateStats();
        this.renderGoals();
        this.renderActivities();
    }

    // 加载所有数据
    loadAllData() {
        return {
            habits: JSON.parse(localStorage.getItem('habits')) || [],
            moodEntries: JSON.parse(localStorage.getItem('moodEntries')) || [],
            focusHistory: JSON.parse(localStorage.getItem('focusHistory')) || [],
            achievements: JSON.parse(localStorage.getItem('achievements')) || [],
            trainingProgress: JSON.parse(localStorage.getItem('trainingProgress')) || {},
            goals: JSON.parse(localStorage.getItem('goals')) || []
        };
    }

    // 计算统计数据
    calculateStats() {
        const today = new Date();
        const thisWeek = this.getThisWeekData();
        const thisMonth = this.getThisMonthData();

        return {
            habits: {
                total: this.data.habits.length,
                active: this.data.habits.filter(h => h.active).length,
                monthlyGrowth: this.calculateHabitGrowth()
            },
            focus: {
                total: this.calculateTotalFocusHours(),
                weeklyHours: thisWeek.focusHours,
                weeklyGrowth: this.calculateFocusGrowth()
            },
            mood: {
                average: this.calculateAverageMood(),
                monthlyImprovement: this.calculateMoodImprovement()
            },
            achievements: {
                total: this.data.achievements.length,
                monthlyNew: this.calculateNewAchievements()
            }
        };
    }

    // 获取本周数据
    getThisWeekData() {
        const today = new Date();
        const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));

        return {
            focusHours: this.data.focusHistory
                .filter(entry => new Date(entry.date) >= weekStart)
                .reduce((sum, entry) => sum + entry.duration, 0) / 60
        };
    }

    // 获取本月数据
    getThisMonthData() {
        const today = new Date();
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

        return {
            habits: this.data.habits.filter(habit => new Date(habit.createdAt) >= monthStart),
            moodEntries: this.data.moodEntries.filter(entry => new Date(entry.date) >= monthStart)
        };
    }

    // 计算习惯增长
    calculateHabitGrowth() {
        const thisMonth = this.getThisMonthData().habits.length;
        return Math.max(0, thisMonth);
    }

    // 计算总专注时长
    calculateTotalFocusHours() {
        return Math.round(
            this.data.focusHistory.reduce((sum, entry) => sum + entry.duration, 0) / 60
        );
    }

    // 计算专注时长增长
    calculateFocusGrowth() {
        const thisWeek = this.getThisWeekData().focusHours;
        const lastWeek = 45; // 模拟数据
        return Math.round(((thisWeek - lastWeek) / lastWeek) * 100);
    }

    // 计算平均心情
    calculateAverageMood() {
        if (this.data.moodEntries.length === 0) return 0;

        const moodScores = {
            sad: 2, anxious: 3, tired: 4,
            calm: 6, happy: 8, excited: 10
        };

        const total = this.data.moodEntries.reduce((sum, entry) => {
            return sum + (moodScores[entry.mood] || 5);
        }, 0);

        return (total / this.data.moodEntries.length).toFixed(1);
    }

    // 计算心情改善
    calculateMoodImprovement() {
        return 0.5; // 模拟数据
    }

    // 计算新成就
    calculateNewAchievements() {
        return 4; // 模拟数据
    }

    // 绑定事件
    bindEvents() {
        // 全局函数供HTML调用
        window.exportAllData = () => {
            this.exportAllData();
        };

        window.generateReport = () => {
            this.generateReport();
        };
    }

    // 更新统计显示
    updateStats() {
        const stats = this.stats;

        // 更新数字显示
        document.querySelector('.stat-card.habits .stat-number').textContent = stats.habits.active;
        document.querySelector('.stat-card.time .stat-number').textContent = stats.focus.total;
        document.querySelector('.stat-card.mood .stat-number').textContent = stats.mood.average;
        document.querySelector('.stat-card.achievements .stat-number').textContent = stats.achievements.total;

        // 更新变化指标
        this.updateChangeIndicators(stats);
    }

    // 更新变化指标
    updateChangeIndicators(stats) {
        const changes = [
            { selector: '.stat-card.habits .stat-change', value: `+${stats.habits.monthlyGrowth} 本月` },
            { selector: '.stat-card.time .stat-change', value: `+${stats.focus.weeklyGrowth}% 本周` },
            { selector: '.stat-card.mood .stat-change', value: `+${stats.mood.monthlyImprovement} 较上月` },
            { selector: '.stat-card.achievements .stat-change', value: `+${stats.achievements.monthlyNew} 本月` }
        ];

        changes.forEach(change => {
            const element = document.querySelector(change.selector);
            if (element) {
                element.textContent = change.value;
            }
        });
    }

    // 渲染目标
    renderGoals() {
        const goals = [
            { title: '每日运动30分钟', progress: 70, current: 21, total: 30, unit: '天' },
            { title: '早起习惯养成', progress: 50, current: 15, total: 30, unit: '天' },
            { title: '每日阅读计划', progress: 67, current: 8, total: 12, unit: '本' }
        ];

        const container = document.querySelector('.goals-panel');
        const goalItems = container.querySelectorAll('.goal-item');

        goals.forEach((goal, index) => {
            if (goalItems[index]) {
                const titleEl = goalItems[index].querySelector('.goal-title');
                const descEl = goalItems[index].querySelector('div[style*="font-size: 0.9rem"]');
                const progressBar = goalItems[index].querySelector('.goal-fill');

                if (titleEl) titleEl.textContent = goal.title;
                if (descEl) descEl.textContent = `本月进度：${goal.current}/${goal.total}${goal.unit}`;
                if (progressBar) {
                    setTimeout(() => {
                        progressBar.style.width = goal.progress + '%';
                    }, index * 200);
                }
            }
        });
    }

    // 渲染活动
    renderActivities() {
        const activities = [
            { icon: '✅', text: '完成了晨练习惯', time: '2小时前', color: '#00b894' },
            { icon: '😊', text: '记录了今日心情', time: '3小时前', color: '#fd79a8' },
            { icon: '⏰', text: '完成了2小时专注工作', time: '5小时前', color: '#667eea' },
            { icon: '🏆', text: '获得了"连续记录"成就', time: '昨天', color: '#fdcb6e' },
            { icon: '📚', text: '完成了情绪训练课程', time: '昨天', color: '#a29bfe' }
        ];

        const timeline = document.querySelector('.activity-timeline');
        if (timeline) {
            timeline.innerHTML = activities.map(activity => `
                <div class="timeline-item">
                    <div class="timeline-icon" style="background: ${activity.color};">${activity.icon}</div>
                    <div class="timeline-content">
                        <div class="timeline-text">${activity.text}</div>
                        <div class="timeline-time">${activity.time}</div>
                    </div>
                </div>
            `).join('');
        }
    }

    // 导出所有数据
    exportAllData() {
        const exportData = {
            ...this.data,
            stats: this.stats,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `lifesync_dashboard_${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        this.showNotification('数据导出成功！', 'success');
    }

    // 生成报告
    generateReport() {
        const report = this.generateTextReport();

        const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `lifesync_report_${new Date().toISOString().split('T')[0]}.txt`;
        link.click();

        this.showNotification('报告生成成功！', 'success');
    }

    // 生成文本报告
    generateTextReport() {
        const stats = this.stats;
        const date = new Date().toLocaleDateString('zh-CN');

        return `
LifeSync 个人数据报告
生成日期：${date}

=== 总体概况 ===
• 活跃习惯：${stats.habits.active} 个
• 总专注时长：${stats.focus.total} 小时
• 平均心情指数：${stats.mood.average}/10
• 获得成就：${stats.achievements.total} 个

=== 本月亮点 ===
• 新增习惯：${stats.habits.monthlyGrowth} 个
• 专注时长增长：${stats.focus.weeklyGrowth}%
• 心情改善：+${stats.mood.monthlyImprovement}
• 新获成就：${stats.achievements.monthlyNew} 个

=== 数据分析 ===
1. 习惯管理表现优秀，坚持度高
2. 专注能力持续提升，效率显著改善
3. 情绪状态整体积极，心理健康良好
4. 成就获得频率稳定，进步明显

=== 建议 ===
• 继续保持良好的习惯执行力
• 适当增加休息时间，避免过度疲劳
• 保持积极心态，定期进行情绪调节
• 设定更具挑战性的目标，推动进一步成长

报告结束
        `.trim();
    }

    // 显示通知
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
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

    // 刷新数据
    refreshData() {
        this.data = this.loadAllData();
        this.stats = this.calculateStats();
        this.updateStats();
        this.renderGoals();
        this.renderActivities();
    }

    // 获取统计数据
    getStats() {
        return this.stats;
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
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