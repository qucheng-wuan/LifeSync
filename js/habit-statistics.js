// 习惯数据统计功能
class HabitStatistics {
    constructor() {
        this.habits = this.loadHabits();
        this.currentPeriod = 'month';
        this.statsData = this.generateStatsData();
        this.init();
    }

    init() {
        this.updateStats();
        this.updateInsights();
        this.renderHabitRanking();
        this.bindEvents();
    }

    // 加载习惯数据
    loadHabits() {
        const defaultHabits = [
            {
                id: 1,
                name: '晨练',
                category: 'health',
                completionRate: 100,
                totalCompletions: 30,
                currentStreak: 15
            },
            {
                id: 2,
                name: '喝水',
                category: 'health',
                completionRate: 95,
                totalCompletions: 28,
                currentStreak: 12
            },
            {
                id: 3,
                name: '阅读',
                category: 'learning',
                completionRate: 78,
                totalCompletions: 23,
                currentStreak: 5
            },
            {
                id: 4,
                name: '冥想',
                category: 'health',
                completionRate: 85,
                totalCompletions: 25,
                currentStreak: 8
            },
            {
                id: 5,
                name: '学习编程',
                category: 'learning',
                completionRate: 70,
                totalCompletions: 21,
                currentStreak: 3
            }
        ];

        return JSON.parse(localStorage.getItem('habits')) || defaultHabits;
    }

    // 生成统计数据
    generateStatsData() {
        const totalCompletions = this.habits.reduce((sum, habit) => sum + habit.totalCompletions, 0);
        const averageRate = Math.round(this.habits.reduce((sum, habit) => sum + habit.completionRate, 0) / this.habits.length);
        const longestStreak = Math.max(...this.habits.map(h => h.currentStreak));
        const activeHabits = this.habits.length;

        return {
            totalCompletions,
            averageRate,
            longestStreak,
            activeHabits
        };
    }

    // 更新统计数据
    updateStats() {
        const statCards = document.querySelectorAll('.stat-card .stat-value');
        if (statCards.length >= 4) {
            statCards[0].textContent = `${this.statsData.averageRate}%`;
            statCards[1].textContent = this.statsData.totalCompletions;
            statCards[2].textContent = this.statsData.longestStreak;
            statCards[3].textContent = this.statsData.activeHabits;
        }
    }

    // 更新智能洞察
    updateInsights() {
        const bestHabit = this.habits.reduce((best, habit) =>
            habit.completionRate > best.completionRate ? habit : best
        );

        const worstHabit = this.habits.reduce((worst, habit) =>
            habit.completionRate < worst.completionRate ? habit : worst
        );

        const insights = document.querySelectorAll('.insight-card');
        if (insights.length >= 2) {
            insights[0].querySelector('p').textContent =
                `您的"${bestHabit.name}"习惯表现优异，完成率达${bestHabit.completionRate}%！建议保持当前节奏。`;

            insights[1].querySelector('p').textContent =
                `"${worstHabit.name}"习惯完成率偏低，建议调整时间安排或降低目标难度。`;
        }
    }

    // 渲染习惯排行榜
    renderHabitRanking() {
        const habitList = document.querySelector('.habit-list');
        if (!habitList) return;

        const sortedHabits = [...this.habits].sort((a, b) => b.completionRate - a.completionRate);

        habitList.innerHTML = sortedHabits.map(habit => `
            <li class="habit-item">
                <span>${this.getHabitIcon(habit.category)} ${habit.name}</span>
                <div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${habit.completionRate}%"></div>
                    </div>
                    <small>${habit.completionRate}%</small>
                </div>
            </li>
        `).join('');
    }

    // 获取习惯图标
    getHabitIcon(category) {
        const icons = {
            health: '🏃‍♂️',
            learning: '📚',
            work: '💼',
            personal: '⭐'
        };
        return icons[category] || '⭐';
    }

    // 绑定事件
    bindEvents() {
        // 时间筛选按钮
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentPeriod = btn.dataset.period;
                this.refreshData();
            });
        });
    }

    // 刷新数据
    refreshData() {
        // 模拟根据不同时间周期刷新数据
        console.log(`刷新${this.currentPeriod}数据`);
        this.updateStats();
        this.updateInsights();
        this.renderHabitRanking();
    }
}

// 初始化
const habitStatistics = new HabitStatistics(); 