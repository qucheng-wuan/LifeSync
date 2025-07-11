/**
 * 目标设定管理类
 * 功能：目标创建、编辑、删除、筛选、统计分析等
 */
class GoalsManager {
    constructor() {
        this.goals = JSON.parse(localStorage.getItem('userGoals')) || [];
        this.selectedCategory = 'personal';
        this.selectedPriority = 'medium';
        this.currentFilter = 'all';

        this.init();
    }

    /**
     * 初始化
     */
    init() {
        this.setupEventListeners();
        this.loadSampleData();
        this.renderGoals();
        this.updateStats();
        this.updatePageStats();
    }

    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        // 表单提交
        const goalForm = document.getElementById('goalForm');
        if (goalForm) {
            goalForm.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // 分类选择器
        const categoryOptions = document.querySelectorAll('.category-option');
        categoryOptions.forEach(option => {
            option.addEventListener('click', (e) => this.selectCategory(e));
        });

        // 优先级选择器
        const priorityOptions = document.querySelectorAll('.priority-option');
        priorityOptions.forEach(option => {
            option.addEventListener('click', (e) => this.selectPriority(e));
        });

        // 筛选标签
        const filterTabs = document.querySelectorAll('.filter-tab');
        filterTabs.forEach(tab => {
            tab.addEventListener('click', (e) => this.filterGoals(e));
        });
    }

    /**
     * 加载示例数据
     */
    loadSampleData() {
        if (this.goals.length === 0) {
            this.goals = [
                {
                    id: Date.now() + 1,
                    title: '每周阅读2本书',
                    description: '通过阅读提升个人知识水平和思维能力，培养良好的学习习惯',
                    category: 'learning',
                    priority: 'high',
                    deadline: '2024-12-31',
                    target: 104, // 一年52周 * 2本
                    current: 15,
                    status: 'active',
                    createdAt: new Date('2024-01-01').toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: Date.now() + 2,
                    title: '减重10公斤',
                    description: '通过合理饮食和规律运动，达到理想体重，提升身体健康',
                    category: 'health',
                    priority: 'high',
                    deadline: '2024-06-30',
                    target: 10,
                    current: 3.5,
                    status: 'active',
                    createdAt: new Date('2024-01-15').toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: Date.now() + 3,
                    title: '学习Python编程',
                    description: '掌握Python基础语法和常用库，能够独立开发小项目',
                    category: 'learning',
                    priority: 'medium',
                    deadline: '2024-08-31',
                    target: 100, // 学习进度百分比
                    current: 45,
                    status: 'active',
                    createdAt: new Date('2024-02-01').toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: Date.now() + 4,
                    title: '存钱买车',
                    description: '积累足够资金购买人生第一辆汽车，提升生活品质',
                    category: 'financial',
                    priority: 'medium',
                    deadline: '2024-12-31',
                    target: 200000,
                    current: 85000,
                    status: 'active',
                    createdAt: new Date('2023-10-01').toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: Date.now() + 5,
                    title: '提升英语口语',
                    description: '通过口语练习和交流，达到流利对话水平',
                    category: 'learning',
                    priority: 'low',
                    deadline: '2024-09-30',
                    target: 100,
                    current: 100,
                    status: 'completed',
                    createdAt: new Date('2023-12-01').toISOString(),
                    updatedAt: new Date('2024-01-20').toISOString()
                }
            ];
            this.saveGoals();
        }
    }

    /**
     * 选择分类
     */
    selectCategory(e) {
        // 移除所有选中状态
        document.querySelectorAll('.category-option').forEach(option => {
            option.classList.remove('selected');
        });

        // 添加选中状态
        e.target.classList.add('selected');
        this.selectedCategory = e.target.dataset.category;
    }

    /**
     * 选择优先级
     */
    selectPriority(e) {
        // 移除所有选中状态
        document.querySelectorAll('.priority-option').forEach(option => {
            option.classList.remove('selected');
        });

        // 添加选中状态
        e.target.classList.add('selected');
        this.selectedPriority = e.target.dataset.priority;
    }

    /**
     * 处理表单提交
     */
    handleSubmit(e) {
        e.preventDefault();

        const goalTitle = document.getElementById('goalTitle').value.trim();
        const goalDescription = document.getElementById('goalDescription').value.trim();
        const goalDeadline = document.getElementById('goalDeadline').value;
        const goalTarget = parseFloat(document.getElementById('goalTarget').value) || 0;

        // 验证必填字段
        if (!goalTitle) {
            this.showNotification('请输入目标标题', 'warning');
            return;
        }

        // SMART目标验证
        const smartValidation = this.validateSMART(goalTitle, goalDescription, goalDeadline, goalTarget);
        if (!smartValidation.isValid) {
            this.showNotification(smartValidation.message, 'warning');
            return;
        }

        // 创建新目标
        const newGoal = {
            id: Date.now(),
            title: goalTitle,
            description: goalDescription,
            category: this.selectedCategory,
            priority: this.selectedPriority,
            deadline: goalDeadline,
            target: goalTarget,
            current: 0,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.goals.unshift(newGoal);
        this.saveGoals();
        this.renderGoals();
        this.updateStats();
        this.updatePageStats();

        // 重置表单
        e.target.reset();
        this.resetSelections();

        this.showNotification('目标创建成功！', 'success');
    }

    /**
     * SMART目标验证
     */
    validateSMART(title, description, deadline, target) {
        const validation = { isValid: true, message: '' };

        // S - Specific 具体的
        if (title.length < 3) {
            validation.isValid = false;
            validation.message = 'SMART原则：目标标题应该更具体明确（至少3个字符）';
            return validation;
        }

        // M - Measurable 可衡量的
        if (target <= 0 && !description.includes('完成') && !description.includes('达到')) {
            validation.isValid = false;
            validation.message = 'SMART原则：目标应该是可衡量的，请设定目标数值或在描述中明确衡量标准';
            return validation;
        }

        // T - Time-bound 有时限的
        if (!deadline) {
            validation.isValid = false;
            validation.message = 'SMART原则：目标应该有明确的截止日期';
            return validation;
        }

        const deadlineDate = new Date(deadline);
        const today = new Date();
        if (deadlineDate <= today) {
            validation.isValid = false;
            validation.message = 'SMART原则：截止日期应该在未来';
            return validation;
        }

        return validation;
    }

    /**
     * 重置选择状态
     */
    resetSelections() {
        // 重置分类选择
        document.querySelectorAll('.category-option').forEach(option => {
            option.classList.remove('selected');
        });
        document.querySelector('.category-option[data-category="personal"]').classList.add('selected');
        this.selectedCategory = 'personal';

        // 重置优先级选择
        document.querySelectorAll('.priority-option').forEach(option => {
            option.classList.remove('selected');
        });
        document.querySelector('.priority-option[data-priority="medium"]').classList.add('selected');
        this.selectedPriority = 'medium';
    }

    /**
     * 筛选目标
     */
    filterGoals(e) {
        // 移除所有活跃状态
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });

        // 添加活跃状态
        e.target.classList.add('active');
        this.currentFilter = e.target.dataset.filter;

        this.renderGoals();
    }

    /**
     * 渲染目标列表
     */
    renderGoals() {
        const goalsList = document.getElementById('goalsList');
        if (!goalsList) return;

        let filteredGoals = this.goals;

        // 应用筛选
        switch (this.currentFilter) {
            case 'active':
                filteredGoals = this.goals.filter(goal => goal.status === 'active');
                break;
            case 'completed':
                filteredGoals = this.goals.filter(goal => goal.status === 'completed');
                break;
            case 'paused':
                filteredGoals = this.goals.filter(goal => goal.status === 'paused');
                break;
            case 'high':
                filteredGoals = this.goals.filter(goal => goal.priority === 'high');
                break;
            default:
                filteredGoals = this.goals;
        }

        if (filteredGoals.length === 0) {
            goalsList.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #718096;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🎯</div>
                    <h3>暂无目标</h3>
                    <p>开始创建你的第一个目标吧！</p>
                </div>
            `;
            return;
        }

        goalsList.innerHTML = filteredGoals.map(goal => this.createGoalCard(goal)).join('');

        // 添加事件监听器
        this.attachGoalCardListeners();
    }

    /**
     * 创建目标卡片
     */
    createGoalCard(goal) {
        const progress = goal.target > 0 ? Math.min((goal.current / goal.target) * 100, 100) : 0;
        const categoryNames = {
            personal: '个人成长',
            career: '职业发展',
            health: '健康生活',
            learning: '学习教育',
            financial: '财务理财',
            relationship: '人际关系'
        };

        const priorityEmojis = {
            high: '🔥',
            medium: '⚡',
            low: '💫'
        };

        const statusNames = {
            active: '进行中',
            completed: '已完成',
            paused: '已暂停'
        };

        const daysLeft = goal.deadline ? Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : 0;
        const deadlineText = daysLeft > 0 ? `还剩 ${daysLeft} 天` : daysLeft === 0 ? '今天到期' : '已过期';
        const deadlineClass = daysLeft <= 3 ? 'urgent' : '';

        return `
            <div class="goal-card ${goal.priority}" data-goal-id="${goal.id}">
                <div class="goal-header">
                    <div>
                        <div class="goal-title">${goal.title}</div>
                        <div class="goal-category">${categoryNames[goal.category] || goal.category}</div>
                    </div>
                </div>
                
                <div class="goal-description">${goal.description}</div>
                
                <div class="goal-meta">
                    <div class="goal-deadline ${deadlineClass}">
                        📅 ${deadlineText}
                    </div>
                    <div class="goal-progress">
                        <span>${progress.toFixed(1)}%</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 1rem; display: flex; gap: 0.5rem; font-size: 0.8rem;">
                    <span style="background: #e2e8f0; padding: 0.2rem 0.5rem; border-radius: 10px;">
                        ${priorityEmojis[goal.priority]} ${goal.priority === 'high' ? '高' : goal.priority === 'medium' ? '中' : '低'}优先级
                    </span>
                    <span style="background: ${goal.status === 'completed' ? '#48bb78' : goal.status === 'active' ? '#4299e1' : '#ed8936'}; color: white; padding: 0.2rem 0.5rem; border-radius: 10px;">
                        ${statusNames[goal.status]}
                    </span>
                    ${goal.target > 0 ? `<span style="background: #667eea; color: white; padding: 0.2rem 0.5rem; border-radius: 10px;">
                        ${goal.current}/${goal.target}
                    </span>` : ''}
                </div>
            </div>
        `;
    }

    /**
     * 添加目标卡片事件监听器
     */
    attachGoalCardListeners() {
        const goalCards = document.querySelectorAll('.goal-card');
        goalCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const goalId = parseInt(card.dataset.goalId);
                this.showGoalDetail(goalId);
            });
        });
    }

    /**
     * 显示目标详情
     */
    showGoalDetail(goalId) {
        const goal = this.goals.find(g => g.id === goalId);
        if (!goal) return;

        // 这里可以实现目标详情模态框
        // 暂时用alert显示
        alert(`目标详情：\n标题：${goal.title}\n描述：${goal.description}\n进度：${goal.current}/${goal.target}`);
    }

    /**
     * 更新页面统计数据
     */
    updatePageStats() {
        const totalGoals = this.goals.length;
        const activeGoals = this.goals.filter(g => g.status === 'active').length;
        const completedGoals = this.goals.filter(g => g.status === 'completed').length;

        const totalGoalsEl = document.getElementById('totalGoals');
        const activeGoalsEl = document.getElementById('activeGoals');
        const completedGoalsEl = document.getElementById('completedGoals');

        if (totalGoalsEl) totalGoalsEl.textContent = totalGoals;
        if (activeGoalsEl) activeGoalsEl.textContent = activeGoals;
        if (completedGoalsEl) completedGoalsEl.textContent = completedGoals;
    }

    /**
     * 更新统计分析
     */
    updateStats() {
        // 计算完成率
        const completedGoals = this.goals.filter(g => g.status === 'completed').length;
        const totalGoals = this.goals.length;
        const completionRate = totalGoals > 0 ? ((completedGoals / totalGoals) * 100).toFixed(0) : 0;

        // 计算本月新增目标
        const thisMonth = new Date();
        const monthlyGoals = this.goals.filter(goal => {
            const createdDate = new Date(goal.createdAt);
            return createdDate.getMonth() === thisMonth.getMonth() &&
                createdDate.getFullYear() === thisMonth.getFullYear();
        }).length;

        // 计算连续完成天数（简化计算）
        const achievementStreak = 15; // 模拟数据

        // 找出最活跃的分类
        const categoryCount = {};
        this.goals.forEach(goal => {
            categoryCount[goal.category] = (categoryCount[goal.category] || 0) + 1;
        });
        const topCategoryKey = Object.keys(categoryCount).reduce((a, b) =>
            categoryCount[a] > categoryCount[b] ? a : b, 'personal');

        const categoryNames = {
            personal: '个人成长',
            career: '职业发展',
            health: '健康生活',
            learning: '学习教育',
            financial: '财务理财',
            relationship: '人际关系'
        };
        const topCategory = categoryNames[topCategoryKey] || '个人成长';

        // 更新页面显示
        const completionRateEl = document.getElementById('completionRate');
        const monthlyGoalsEl = document.getElementById('monthlyGoals');
        const achievementStreakEl = document.getElementById('achievementStreak');
        const topCategoryEl = document.getElementById('topCategory');

        if (completionRateEl) completionRateEl.textContent = `${completionRate}%`;
        if (monthlyGoalsEl) monthlyGoalsEl.textContent = monthlyGoals;
        if (achievementStreakEl) achievementStreakEl.textContent = achievementStreak;
        if (topCategoryEl) topCategoryEl.textContent = topCategory;
    }

    /**
     * 保存目标到本地存储
     */
    saveGoals() {
        localStorage.setItem('userGoals', JSON.stringify(this.goals));
    }

    /**
     * 显示通知
     */
    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#48bb78' : type === 'warning' ? '#ed8936' : '#4299e1'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // 滑入动画
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // 自动移除
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    const goalsManager = new GoalsManager();

    // 设置当前日期为默认截止日期（一个月后）
    const deadlineInput = document.getElementById('goalDeadline');
    if (deadlineInput) {
        const oneMonthLater = new Date();
        oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
        deadlineInput.value = oneMonthLater.toISOString().split('T')[0];
    }
});
