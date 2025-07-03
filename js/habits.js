// 习惯管理页面功能
class HabitsManager {
    constructor() {
        this.habits = this.loadHabits();
        this.currentCategory = 'all';
        this.init();
    }

    init() {
        this.renderHabits();
        this.updateStats();
        this.bindEvents();
        this.initFormHandlers();
    }

    // 加载习惯数据
    loadHabits() {
        const defaultHabits = [
            {
                id: 1,
                name: '晨练',
                description: '每天早上30分钟有氧运动',
                category: 'health',
                frequency: 'daily',
                color: '#28a745',
                target: 21,
                currentStreak: 15,
                completedToday: true,
                createdAt: '2024-01-01'
            },
            {
                id: 2,
                name: '阅读',
                description: '每天阅读30分钟专业书籍',
                category: 'learning',
                frequency: 'daily',
                color: '#ffc107',
                target: 30,
                currentStreak: 8,
                completedToday: false,
                createdAt: '2024-01-05'
            },
            {
                id: 3,
                name: '写日记',
                description: '记录每天的感悟和思考',
                category: 'personal',
                frequency: 'daily',
                color: '#667eea',
                target: 21,
                currentStreak: 12,
                completedToday: true,
                createdAt: '2024-01-03'
            }
        ];

        return JSON.parse(localStorage.getItem('habits')) || defaultHabits;
    }

    // 保存习惯数据
    saveHabits() {
        localStorage.setItem('habits', JSON.stringify(this.habits));
    }

    // 渲染习惯列表
    renderHabits() {
        const container = document.getElementById('habitsList');
        const filteredHabits = this.currentCategory === 'all'
            ? this.habits
            : this.habits.filter(habit => habit.category === this.currentCategory);

        container.innerHTML = filteredHabits.map(habit => this.createHabitCard(habit)).join('');
    }

    // 创建习惯卡片
    createHabitCard(habit) {
        const icon = this.getCategoryIcon(habit.category);
        const completedClass = habit.completedToday ? 'completed' : '';

        return `
            <div class="habit-card ${completedClass}" data-id="${habit.id}" style="--habit-color: ${habit.color}">
                <div class="habit-header">
                    <div class="habit-icon" style="background: ${habit.color}">
                        ${icon}
                    </div>
                    <div class="habit-info">
                        <div class="habit-title">${habit.name}</div>
                        <div class="habit-description">${habit.description}</div>
                        <div class="habit-stats">
                            <span>🔥 连击: ${habit.currentStreak}天</span>
                            <span>🎯 目标: ${habit.target}天</span>
                            <span>📅 ${habit.frequency === 'daily' ? '每日' : '每周'}</span>
                        </div>
                    </div>
                    <div class="habit-actions">
                        <button class="action-btn check ${habit.completedToday ? 'completed' : ''}" 
                                onclick="habitsManager.toggleHabit(${habit.id})">
                            ${habit.completedToday ? '✓' : '○'}
                        </button>
                        <button class="action-btn" onclick="habitsManager.editHabit(${habit.id})">编辑</button>
                        <button class="action-btn" onclick="habitsManager.deleteHabit(${habit.id})">删除</button>
                    </div>
                </div>
            </div>
        `;
    }

    // 获取分类图标
    getCategoryIcon(category) {
        const icons = {
            health: '🏃‍♂️',
            learning: '📚',
            work: '💼',
            personal: '⭐'
        };
        return icons[category] || '⭐';
    }

    // 更新统计数据
    updateStats() {
        const totalHabits = this.habits.length;
        const completedToday = this.habits.filter(h => h.completedToday).length;
        const maxStreak = Math.max(...this.habits.map(h => h.currentStreak));
        const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

        document.getElementById('totalHabits').textContent = totalHabits;
        document.getElementById('completedToday').textContent = completedToday;
        document.getElementById('streak').textContent = maxStreak;
        document.getElementById('completionRate').textContent = completionRate + '%';

        // 更新分类统计
        this.updateCategoryStats();
    }

    // 更新分类统计
    updateCategoryStats() {
        const categoryItems = document.querySelectorAll('.category-item');
        categoryItems.forEach(item => {
            const category = item.dataset.category;
            let count = 0;

            if (category === 'all') {
                count = this.habits.length;
            } else {
                count = this.habits.filter(h => h.category === category).length;
            }

            const countSpan = item.querySelector('span:last-child');
            if (countSpan) countSpan.textContent = count;
        });
    }

    // 绑定事件
    bindEvents() {
        // 分类筛选
        document.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelectorAll('.category-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                this.currentCategory = item.dataset.category;
                this.renderHabits();
            });
        });

        // 频率选择
        document.querySelectorAll('.frequency-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.frequency-option').forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
            });
        });

        // 颜色选择
        document.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
            });
        });
    }

    // 初始化表单处理
    initFormHandlers() {
        const form = document.getElementById('habitForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveHabitForm();
        });
    }

    // 显示添加习惯模态框
    showAddHabitModal() {
        document.getElementById('modalTitle').textContent = '添加新习惯';
        document.getElementById('habitForm').reset();
        document.querySelector('.frequency-option').classList.add('selected');
        document.querySelector('.color-option').classList.add('selected');
        document.getElementById('habitModal').classList.add('show');
    }

    // 关闭模态框
    closeHabitModal() {
        document.getElementById('habitModal').classList.remove('show');
    }

    // 保存习惯表单
    saveHabitForm() {
        const formData = {
            name: document.getElementById('habitName').value,
            description: document.getElementById('habitDescription').value,
            category: document.getElementById('habitCategory').value,
            frequency: document.querySelector('.frequency-option.selected').dataset.frequency,
            color: document.querySelector('.color-option.selected').dataset.color,
            target: parseInt(document.getElementById('habitTarget').value)
        };

        const habit = {
            id: Date.now(),
            ...formData,
            currentStreak: 0,
            completedToday: false,
            createdAt: new Date().toISOString().split('T')[0]
        };

        this.habits.push(habit);
        this.saveHabits();
        this.renderHabits();
        this.updateStats();
        this.closeHabitModal();

        this.showNotification('习惯添加成功！', 'success');
    }

    // 切换习惯完成状态
    toggleHabit(id) {
        const habit = this.habits.find(h => h.id === id);
        if (habit) {
            habit.completedToday = !habit.completedToday;
            if (habit.completedToday) {
                habit.currentStreak += 1;
                this.showNotification(`${habit.name} 打卡成功！连击 ${habit.currentStreak} 天`, 'success');
            } else {
                habit.currentStreak = Math.max(0, habit.currentStreak - 1);
            }
            this.saveHabits();
            this.renderHabits();
            this.updateStats();
        }
    }

    // 编辑习惯
    editHabit(id) {
        const habit = this.habits.find(h => h.id === id);
        if (habit) {
            document.getElementById('modalTitle').textContent = '编辑习惯';
            document.getElementById('habitName').value = habit.name;
            document.getElementById('habitDescription').value = habit.description;
            document.getElementById('habitCategory').value = habit.category;
            document.getElementById('habitTarget').value = habit.target;

            // 设置频率和颜色选择
            document.querySelectorAll('.frequency-option').forEach(option => {
                option.classList.toggle('selected', option.dataset.frequency === habit.frequency);
            });

            document.querySelectorAll('.color-option').forEach(option => {
                option.classList.toggle('selected', option.dataset.color === habit.color);
            });

            document.getElementById('habitModal').classList.add('show');

            // 存储正在编辑的习惯ID
            this.editingHabitId = id;
        }
    }

    // 删除习惯
    deleteHabit(id) {
        if (confirm('确定要删除这个习惯吗？')) {
            this.habits = this.habits.filter(h => h.id !== id);
            this.saveHabits();
            this.renderHabits();
            this.updateStats();
            this.showNotification('习惯已删除', 'info');
        }
    }

    // 显示通知
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : '#17a2b8'};
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

// 全局函数，供HTML调用
function showAddHabitModal() {
    habitsManager.showAddHabitModal();
}

function closeHabitModal() {
    habitsManager.closeHabitModal();
}

// 初始化
const habitsManager = new HabitsManager();

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
`;
document.head.appendChild(style); 