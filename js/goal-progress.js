/**
 * 进度追踪管理类
 * 功能：显示目标进度、统计分析、风险预警等
 */
class ProgressTracker {
    constructor() {
        this.goals = JSON.parse(localStorage.getItem('userGoals')) || [];
        this.init();
    }

    /**
     * 初始化
     */
    init() {
        this.loadSampleData();
        this.updateStats();
        this.renderProgressCards();
        this.updateStatistics();
    }

    /**
     * 加载示例数据
     */
    loadSampleData() {
        if (this.goals.length === 0) {
            this.goals = [
                {
                    id: 1,
                    title: '每周阅读2本书',
                    description: '通过阅读提升个人知识水平',
                    category: 'learning',
                    priority: 'high',
                    deadline: '2024-12-31',
                    target: 104,
                    current: 75,  // 已读75本
                    status: 'active',
                    createdAt: new Date('2024-01-01').toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: 2,
                    title: '减重10公斤',
                    description: '通过合理饮食和运动达到理想体重',
                    category: 'health',
                    priority: 'high',
                    deadline: '2024-08-30',
                    target: 10,
                    current: 3.5,
                    status: 'active',
                    createdAt: new Date('2024-02-01').toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: 3,
                    title: '学习Python编程',
                    description: '掌握Python基础和高级技能',
                    category: 'learning',
                    priority: 'medium',
                    deadline: '2024-09-30',
                    target: 100,
                    current: 45,
                    status: 'active',
                    createdAt: new Date('2024-03-01').toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: 4,
                    title: '提升英语口语',
                    description: '通过练习达到流利对话水平',
                    category: 'learning',
                    priority: 'low',
                    deadline: '2024-06-30',
                    target: 100,
                    current: 100,
                    status: 'completed',
                    createdAt: new Date('2024-01-01').toISOString(),
                    updatedAt: new Date('2024-05-15').toISOString()
                }
            ];
            localStorage.setItem('userGoals', JSON.stringify(this.goals));
        }
    }

    /**
     * 更新统计数据
     */
    updateStats() {
        const activeGoals = this.goals.filter(g => g.status === 'active');
        const completedGoals = this.goals.filter(g => g.status === 'completed');
        const totalGoals = this.goals.length;

        // 计算平均进度
        const avgProgress = activeGoals.length > 0
            ? Math.round(activeGoals.reduce((sum, goal) => {
                return sum + (goal.target > 0 ? (goal.current / goal.target) * 100 : 0);
            }, 0) / activeGoals.length)
            : 0;

        // 计算风险目标数量（进度落后的目标）
        const riskGoals = activeGoals.filter(goal => {
            if (goal.target === 0) return false;
            const progress = (goal.current / goal.target) * 100;
            const timeLeft = new Date(goal.deadline) - new Date();
            const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
            return progress < 50 && daysLeft < 90; // 进度小于50%且时间少于90天
        }).length;

        // 更新页面显示
        this.updateElement('totalGoals', activeGoals.length);
        this.updateElement('avgProgress', `${avgProgress}%`);
        this.updateElement('completedGoals', completedGoals.length);
        this.updateElement('riskGoals', riskGoals);
    }

    /**
     * 渲染进度卡片
     */
    renderProgressCards() {
        const progressSection = document.querySelector('.goals-progress-section');
        if (!progressSection) return;

        const activeGoals = this.goals.filter(g => g.status === 'active');

        let cardsHtml = '<h3 class="section-title">🎯 目标进度详情</h3>';

        activeGoals.forEach(goal => {
            cardsHtml += this.createProgressCard(goal);
        });

        progressSection.innerHTML = cardsHtml;
    }

    /**
     * 创建进度卡片
     */
    createProgressCard(goal) {
        const progress = goal.target > 0 ? Math.min((goal.current / goal.target) * 100, 100) : 0;
        const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));

        // 判断进度状态
        let statusClass = 'on-track';
        let statusText = '进展顺利';

        if (progress < 30) {
            statusClass = 'at-risk';
            statusText = '需加油';
        } else if (progress < 70 && daysLeft < 60) {
            statusClass = 'at-risk';
            statusText = '需关注';
        }

        const categoryNames = {
            personal: '个人成长',
            career: '职业发展',
            health: '健康生活',
            learning: '学习教育',
            financial: '财务理财',
            relationship: '人际关系'
        };

        const priorityText = goal.priority === 'high' ? '高优先级' :
            goal.priority === 'medium' ? '中优先级' : '低优先级';

        // 计算相关指标
        const weeklyProgress = this.calculateWeeklyProgress(goal);
        const targetUnit = this.getTargetUnit(goal);

        return `
            <div class="goal-progress-card ${goal.priority}">
                <div class="goal-info">
                    <div>
                        <div class="goal-name">${goal.title}</div>
                        <div style="font-size: 0.9rem; color: #718096;">
                            ${categoryNames[goal.category] || goal.category} • ${priorityText}
                        </div>
                    </div>
                    <div class="goal-status ${statusClass}">${statusText}</div>
                </div>
                <div class="progress-details">
                    <div class="progress-info">
                        <div class="progress-bar-container">
                            <div class="progress-bar-large">
                                <div class="progress-fill-large" style="width: ${progress}%"></div>
                            </div>
                            <div class="progress-percentage">${progress.toFixed(1)}%</div>
                        </div>
                        <div class="progress-metrics">
                            <div class="metric-item">
                                📊 已完成: ${goal.current}/${goal.target}${targetUnit}
                            </div>
                            <div class="metric-item">
                                📅 剩余: ${daysLeft > 0 ? daysLeft + '天' : '已过期'}
                            </div>
                            <div class="metric-item">
                                ⚡ 周进度: ${weeklyProgress}
                            </div>
                        </div>
                    </div>
                </div>
                ${progress < 50 && daysLeft < 90 ? this.renderWarning() : ''}
            </div>
        `;
    }

    /**
     * 计算周进度
     */
    calculateWeeklyProgress(goal) {
        const totalWeeks = Math.ceil((new Date(goal.deadline) - new Date(goal.createdAt)) / (1000 * 60 * 60 * 24 * 7));
        const elapsedWeeks = Math.ceil((new Date() - new Date(goal.createdAt)) / (1000 * 60 * 60 * 24 * 7));

        if (elapsedWeeks === 0) return '暂无数据';

        const weeklyAvg = goal.current / elapsedWeeks;
        const unit = this.getTargetUnit(goal);

        return `${weeklyAvg.toFixed(1)}${unit}/周`;
    }

    /**
     * 获取目标单位
     */
    getTargetUnit(goal) {
        if (goal.title.includes('阅读') || goal.title.includes('书')) return '本';
        if (goal.title.includes('减重') || goal.title.includes('公斤')) return '公斤';
        if (goal.title.includes('学习') || goal.title.includes('编程')) return '%';
        return '';
    }

    /**
     * 渲染警告信息
     */
    renderWarning() {
        return `
            <div class="deadline-warning">
                ⚠️ 按当前进度，可能无法在截止日期前完成目标
            </div>
        `;
    }

    /**
     * 更新统计信息
     */
    updateStatistics() {
        // 这里可以添加更多的统计信息更新逻辑
        // 比如图表数据、趋势分析等
        this.updateInsights();
    }

    /**
     * 更新智能洞察
     */
    updateInsights() {
        const insights = this.generateInsights();
        const insightsSection = document.querySelector('.insights-section');

        if (insightsSection && insights.length > 0) {
            let insightsHtml = '<h3 class="section-title">💡 智能洞察与建议</h3>';

            insights.forEach(insight => {
                insightsHtml += `
                    <div class="insight-card">
                        <div class="insight-icon">${insight.icon}</div>
                        <div class="insight-title">${insight.title}</div>
                        <div class="insight-text">${insight.text}</div>
                    </div>
                `;
            });

            insightsSection.innerHTML = insightsHtml;
        }
    }

    /**
     * 生成智能洞察
     */
    generateInsights() {
        const insights = [];
        const activeGoals = this.goals.filter(g => g.status === 'active');

        // 分析高进度目标
        const highProgressGoals = activeGoals.filter(goal => {
            return goal.target > 0 && (goal.current / goal.target) > 0.7;
        });

        if (highProgressGoals.length > 0) {
            insights.push({
                icon: '🚀',
                title: '进度优秀',
                text: `您有${highProgressGoals.length}个目标进展良好，继续保持这种节奏，预计将提前完成目标！`
            });
        }

        // 分析风险目标
        const riskGoals = activeGoals.filter(goal => {
            if (goal.target === 0) return false;
            const progress = (goal.current / goal.target) * 100;
            const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
            return progress < 50 && daysLeft < 90;
        });

        if (riskGoals.length > 0) {
            insights.push({
                icon: '⚠️',
                title: '风险预警',
                text: `有${riskGoals.length}个目标存在完成风险，建议调整计划或增加投入时间，确保按时完成。`
            });
        }

        // 学习类目标分析
        const learningGoals = activeGoals.filter(goal => goal.category === 'learning');
        if (learningGoals.length > 0) {
            insights.push({
                icon: '🎯',
                title: '学习建议',
                text: '学习类目标建议制定具体的里程碑，通过实践项目巩固知识，提高学习效果。'
            });
        }

        return insights;
    }

    /**
     * 更新页面元素
     */
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new ProgressTracker();
}); 