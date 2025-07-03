// 情绪训练功能
class MoodTraining {
    constructor() {
        this.activeTab = 'courses';
        this.breathingTimer = null;
        this.breathingSeconds = 0;
        this.breathingPhase = 'prepare'; // prepare, inhale, hold, exhale
        this.breathingCycle = 0;
        this.isBreathingActive = false;
        this.trainingProgress = this.loadProgress();
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateProgressDisplay();
    }

    // 加载训练进度
    loadProgress() {
        const defaultProgress = {
            mindfulness: 65,
            breathing: 80,
            cognitive: 40,
            regulation: 55,
            positive: 30,
            interpersonal: 25,
            totalSessions: 42,
            achievements: ['初学者', '坚持练习7天', '冥想达人', '情绪稳定', '深呼吸专家']
        };

        return JSON.parse(localStorage.getItem('trainingProgress')) || defaultProgress;
    }

    // 保存训练进度
    saveProgress() {
        localStorage.setItem('trainingProgress', JSON.stringify(this.trainingProgress));
    }

    // 绑定事件
    bindEvents() {
        // 标签导航
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // 呼吸练习控制按钮
        document.getElementById('startBreathing')?.addEventListener('click', () => {
            this.startBreathingExercise();
        });

        document.getElementById('pauseBreathing')?.addEventListener('click', () => {
            this.pauseBreathingExercise();
        });

        document.getElementById('resetBreathing')?.addEventListener('click', () => {
            this.resetBreathingExercise();
        });

        // 反思保存按钮
        document.querySelector('.save-btn')?.addEventListener('click', () => {
            this.saveReflection();
        });
    }

    // 切换标签
    switchTab(tabName) {
        this.activeTab = tabName;

        // 更新标签样式
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // 显示对应面板
        document.querySelectorAll('.training-content, .exercise-panel').forEach(panel => {
            panel.style.display = 'none';
        });

        if (tabName === 'courses') {
            document.getElementById('coursesPanel').style.display = 'block';
        } else if (tabName === 'exercises') {
            document.getElementById('exercisesPanel').style.display = 'block';
        } else if (tabName === 'progress') {
            document.getElementById('progressPanel').style.display = 'block';
            this.updateProgressDisplay();
        } else if (tabName === 'resources') {
            document.getElementById('resourcesPanel').style.display = 'block';
        }
    }

    // 开始呼吸练习
    startBreathingExercise() {
        if (this.isBreathingActive) return;

        this.isBreathingActive = true;
        this.breathingPhase = 'prepare';
        this.breathingCycle = 0;

        const circle = document.getElementById('breathingCircle');
        const text = document.getElementById('breathingText');
        const guide = document.getElementById('guideText');

        // 准备阶段
        text.textContent = '准备开始...';
        guide.textContent = '找一个舒适的位置，准备开始4-7-8呼吸练习...';

        setTimeout(() => {
            this.startBreathingCycle();
        }, 2000);

        // 开始计时
        this.breathingTimer = setInterval(() => {
            this.breathingSeconds++;
            this.updateTimer();
        }, 1000);
    }

    // 开始呼吸循环
    startBreathingCycle() {
        if (!this.isBreathingActive) return;

        const circle = document.getElementById('breathingCircle');
        const text = document.getElementById('breathingText');
        const guide = document.getElementById('guideText');

        // 吸气阶段 (4秒)
        this.breathingPhase = 'inhale';
        circle.classList.remove('exhale');
        circle.classList.add('inhale');
        text.textContent = '吸气';
        guide.textContent = '慢慢地通过鼻子深深吸气，数到4...';

        setTimeout(() => {
            if (!this.isBreathingActive) return;

            // 屏息阶段 (7秒)
            this.breathingPhase = 'hold';
            circle.classList.remove('inhale');
            text.textContent = '屏息';
            guide.textContent = '屏住呼吸，数到7...';

            setTimeout(() => {
                if (!this.isBreathingActive) return;

                // 呼气阶段 (8秒)
                this.breathingPhase = 'exhale';
                circle.classList.add('exhale');
                text.textContent = '呼气';
                guide.textContent = '慢慢地通过嘴巴呼气，数到8...';

                setTimeout(() => {
                    if (!this.isBreathingActive) return;

                    this.breathingCycle++;

                    if (this.breathingCycle < 4) {
                        // 继续下一个循环
                        this.startBreathingCycle();
                    } else {
                        // 完成练习
                        this.completeBreathingExercise();
                    }
                }, 8000);
            }, 7000);
        }, 4000);
    }

    // 暂停呼吸练习
    pauseBreathingExercise() {
        this.isBreathingActive = false;

        if (this.breathingTimer) {
            clearInterval(this.breathingTimer);
            this.breathingTimer = null;
        }

        const circle = document.getElementById('breathingCircle');
        const text = document.getElementById('breathingText');
        const guide = document.getElementById('guideText');

        circle.classList.remove('inhale', 'exhale');
        text.textContent = '已暂停';
        guide.textContent = '练习已暂停，点击开始继续...';
    }

    // 重置呼吸练习
    resetBreathingExercise() {
        this.isBreathingActive = false;
        this.breathingSeconds = 0;
        this.breathingCycle = 0;

        if (this.breathingTimer) {
            clearInterval(this.breathingTimer);
            this.breathingTimer = null;
        }

        const circle = document.getElementById('breathingCircle');
        const text = document.getElementById('breathingText');
        const guide = document.getElementById('guideText');

        circle.classList.remove('inhale', 'exhale');
        text.textContent = '准备开始';
        guide.textContent = '找一个舒适的位置坐下，闭上眼睛，让我们开始4-7-8呼吸法练习...';

        this.updateTimer();
    }

    // 完成呼吸练习
    completeBreathingExercise() {
        this.isBreathingActive = false;

        if (this.breathingTimer) {
            clearInterval(this.breathingTimer);
            this.breathingTimer = null;
        }

        const circle = document.getElementById('breathingCircle');
        const text = document.getElementById('breathingText');
        const guide = document.getElementById('guideText');

        circle.classList.remove('inhale', 'exhale');
        text.textContent = '练习完成';
        guide.textContent = '太棒了！你已经完成了4个完整的呼吸循环。现在请花一点时间感受身体的变化...';

        // 更新进度
        this.trainingProgress.breathing = Math.min(100, this.trainingProgress.breathing + 5);
        this.trainingProgress.totalSessions++;
        this.saveProgress();

        // 显示完成通知
        this.showNotification('呼吸练习完成！继续保持这种平静的状态。', 'success');
    }

    // 更新计时器显示
    updateTimer() {
        const timerDisplay = document.getElementById('timerDisplay');
        if (timerDisplay) {
            const minutes = Math.floor(this.breathingSeconds / 60);
            const seconds = this.breathingSeconds % 60;
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    // 开始课程
    startCourse(courseType) {
        const courses = {
            mindfulness: {
                title: '正念冥想基础',
                description: '开始你的正念冥想之旅...',
                progress: 'mindfulness'
            },
            breathing: {
                title: '深呼吸训练',
                description: '学习科学的呼吸方法...',
                progress: 'breathing'
            },
            cognitive: {
                title: '认知重构训练',
                description: '改变负面思维模式...',
                progress: 'cognitive'
            },
            regulation: {
                title: '情绪调节技巧',
                description: '掌握情绪管理策略...',
                progress: 'regulation'
            },
            positive: {
                title: '积极心理学实践',
                description: '培养积极心态...',
                progress: 'positive'
            },
            interpersonal: {
                title: '人际情绪智慧',
                description: '提升社交情商...',
                progress: 'interpersonal'
            }
        };

        const course = courses[courseType];
        if (!course) return;

        // 更新进度
        this.trainingProgress[course.progress] = Math.min(100, this.trainingProgress[course.progress] + 10);
        this.trainingProgress.totalSessions++;
        this.saveProgress();

        // 切换到练习面板
        this.switchTab('exercises');

        // 显示课程开始通知
        this.showNotification(`开始学习：${course.title}`, 'info');

        // 模拟课程内容
        const guide = document.getElementById('guideText');
        if (guide) {
            guide.textContent = `${course.description} 请跟随指导完成本次学习...`;
        }
    }

    // 保存练习反思
    saveReflection() {
        const textarea = document.querySelector('.journal-textarea');
        if (!textarea || !textarea.value.trim()) {
            this.showNotification('请先写下你的练习感受', 'warning');
            return;
        }

        const reflection = {
            date: new Date().toISOString().split('T')[0],
            time: new Date().toTimeString().split(' ')[0],
            content: textarea.value.trim(),
            type: 'reflection'
        };

        // 保存到本地存储
        let reflections = JSON.parse(localStorage.getItem('trainingReflections')) || [];
        reflections.push(reflection);

        // 只保留最近50条记录
        if (reflections.length > 50) {
            reflections = reflections.slice(-50);
        }

        localStorage.setItem('trainingReflections', JSON.stringify(reflections));

        // 清空文本框
        textarea.value = '';

        // 显示成功消息
        this.showNotification('练习反思已保存', 'success');

        // 更新自我觉察进度
        this.trainingProgress.cognitive = Math.min(100, this.trainingProgress.cognitive + 2);
        this.saveProgress();
    }

    // 更新进度显示
    updateProgressDisplay() {
        const progressItems = document.querySelectorAll('.progress-item');
        const progressData = [
            { key: 'mindfulness', name: '正念冥想' },
            { key: 'breathing', name: '深呼吸练习' },
            { key: 'cognitive', name: '认知重构' },
            { key: 'regulation', name: '情绪调节' }
        ];

        progressItems.forEach((item, index) => {
            if (index < progressData.length) {
                const data = progressData[index];
                const progress = this.trainingProgress[data.key];

                const progressFill = item.querySelector('.progress-fill');
                const progressText = item.querySelector('span:last-child');

                if (progressFill) {
                    setTimeout(() => {
                        progressFill.style.width = progress + '%';
                    }, index * 200);
                }

                if (progressText) {
                    progressText.textContent = progress + '%';
                }
            }
        });

        // 更新成就显示
        this.updateAchievements();
    }

    // 更新成就显示
    updateAchievements() {
        const achievements = this.trainingProgress.achievements || [];

        // 检查新成就
        const newAchievements = this.checkNewAchievements();
        newAchievements.forEach(achievement => {
            if (!achievements.includes(achievement)) {
                achievements.push(achievement);
                this.showNotification(`🎉 获得新成就：${achievement}`, 'success');
            }
        });

        // 更新成就显示
        const achievementContainer = document.querySelector('.achievement-badge').parentElement;
        if (achievementContainer) {
            achievementContainer.innerHTML = achievements.map(achievement =>
                `<div class="achievement-badge">${achievement}</div>`
            ).join('');
        }

        this.trainingProgress.achievements = achievements;
        this.saveProgress();
    }

    // 检查新成就
    checkNewAchievements() {
        const achievements = [];
        const totalSessions = this.trainingProgress.totalSessions;

        if (totalSessions >= 1) achievements.push('初学者');
        if (totalSessions >= 7) achievements.push('坚持练习7天');
        if (totalSessions >= 30) achievements.push('训练达人');
        if (this.trainingProgress.mindfulness >= 80) achievements.push('冥想达人');
        if (this.trainingProgress.breathing >= 90) achievements.push('深呼吸专家');
        if (this.trainingProgress.regulation >= 70) achievements.push('情绪稳定');
        if (this.trainingProgress.cognitive >= 60) achievements.push('理性思维');
        if (this.trainingProgress.positive >= 50) achievements.push('积极心态');

        // 检查所有维度是否都达到50%以上
        const allAbove50 = Object.keys(this.trainingProgress).filter(key =>
            ['mindfulness', 'breathing', 'cognitive', 'regulation', 'positive', 'interpersonal'].includes(key)
        ).every(key => this.trainingProgress[key] >= 50);

        if (allAbove50) achievements.push('全面发展');

        return achievements;
    }

    // 显示通知
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // 3秒后自动移除
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // 获取通知颜色
    getNotificationColor(type) {
        const colors = {
            success: '#00b894',
            warning: '#fdcb6e',
            error: '#e17055',
            info: '#74b9ff'
        };
        return colors[type] || colors.info;
    }

    // 获取训练统计
    getTrainingStats() {
        const totalSessions = this.trainingProgress.totalSessions;
        const avgProgress = Object.keys(this.trainingProgress)
            .filter(key => ['mindfulness', 'breathing', 'cognitive', 'regulation', 'positive', 'interpersonal'].includes(key))
            .reduce((sum, key) => sum + this.trainingProgress[key], 0) / 6;

        return {
            totalSessions,
            avgProgress: Math.round(avgProgress),
            achievements: this.trainingProgress.achievements.length,
            streak: this.calculateStreak()
        };
    }

    // 计算连续训练天数
    calculateStreak() {
        // 简化实现，实际项目中应该根据训练日期计算
        return Math.floor(this.trainingProgress.totalSessions / 3);
    }

    // 导出训练数据
    exportTrainingData() {
        const data = {
            progress: this.trainingProgress,
            stats: this.getTrainingStats(),
            reflections: JSON.parse(localStorage.getItem('trainingReflections')) || [],
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `mood_training_data_${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        this.showNotification('训练数据已导出', 'success');
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.moodTraining = new MoodTraining();
});

// 全局函数供HTML调用
function startCourse(courseType) {
    if (window.moodTraining) {
        window.moodTraining.startCourse(courseType);
    }
}

// 添加CSS动画样式
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
    
    .breathing-circle {
        transition: transform 4s ease-in-out, background-color 1s ease;
    }
    
    .breathing-circle.inhale {
        animation: breatheIn 4s ease-in-out;
    }
    
    .breathing-circle.exhale {
        animation: breatheOut 8s ease-in-out;
    }
    
    @keyframes breatheIn {
        0% { transform: scale(1); }
        100% { transform: scale(1.3); }
    }
    
    @keyframes breatheOut {
        0% { transform: scale(1.3); }
        100% { transform: scale(0.8); }
    }
`;
document.head.appendChild(style); 