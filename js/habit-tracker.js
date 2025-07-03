// 习惯打卡页面功能
class HabitTracker {
    constructor() {
        this.habits = this.loadHabits();
        this.currentWeek = this.getCurrentWeek();
        this.motivationalQuotes = [
            { text: "成功是一个过程，不是一个事件。", author: "托尼·罗宾斯" },
            { text: "你的习惯决定了你的未来。", author: "亚里士多德" },
            { text: "小小的改变，大大的不同。", author: "BJ福格" },
            { text: "坚持是成功的唯一秘诀。", author: "本杰明·富兰克林" }
        ];
        this.init();
    }

    init() {
        this.updateDateInfo();
        this.renderHabits();
        this.updateProgress();
        this.renderWeeklyCalendar();
        this.showRandomQuote();
        this.bindEvents();
    }

    // 加载习惯数据
    loadHabits() {
        const defaultHabits = [
            {
                id: 1,
                name: '晨练',
                description: '30分钟有氧运动',
                category: 'health',
                color: '#28a745',
                currentStreak: 15,
                completedToday: true,
                icon: '🏃‍♂️'
            },
            {
                id: 2,
                name: '阅读',
                description: '阅读30分钟',
                category: 'learning',
                color: '#ffc107',
                currentStreak: 8,
                completedToday: false,
                icon: '📚'
            },
            {
                id: 3,
                name: '冥想',
                description: '10分钟正念冥想',
                category: 'health',
                color: '#667eea',
                currentStreak: 12,
                completedToday: true,
                icon: '🧘‍♀️'
            },
            {
                id: 4,
                name: '写日记',
                description: '记录今日感悟',
                category: 'personal',
                color: '#dc3545',
                currentStreak: 5,
                completedToday: false,
                icon: '📝'
            }
        ];

        return JSON.parse(localStorage.getItem('habits')) || defaultHabits;
    }

    // 保存习惯数据
    saveHabits() {
        localStorage.setItem('habits', JSON.stringify(this.habits));
    }

    // 更新日期信息
    updateDateInfo() {
        const now = new Date();
        const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

        document.getElementById('currentDate').textContent = now.getDate();
        document.getElementById('weekDay').textContent = days[now.getDay()];
        document.getElementById('monthYear').textContent = `${months[now.getMonth()]} ${now.getFullYear()}`;
    }

    // 渲染习惯卡片
    renderHabits() {
        const container = document.getElementById('habitsGrid');
        container.innerHTML = this.habits.map(habit => this.createHabitCard(habit)).join('');
    }

    // 创建习惯卡片
    createHabitCard(habit) {
        const completedClass = habit.completedToday ? 'completed' : '';
        const buttonText = habit.completedToday ? '✅ 已完成' : '⭕ 打卡';
        const buttonClass = habit.completedToday ? 'completed' : '';

        return `
            <div class="habit-card ${completedClass}" style="--habit-color: ${habit.color}">
                <div class="habit-info">
                    <div class="habit-icon" style="background: ${habit.color}">
                        ${habit.icon}
                    </div>
                    <div class="habit-details">
                        <h3>${habit.name}</h3>
                        <p>${habit.description}</p>
                    </div>
                </div>
                <div class="habit-stats">
                    <span>目标: 每日完成</span>
                    <span>分类: ${this.getCategoryName(habit.category)}</span>
                </div>
                <div class="streak-info">
                    <span class="streak-value">${habit.currentStreak}</span> 天连击
                </div>
                <button class="check-button ${buttonClass}" onclick="habitTracker.toggleHabit(${habit.id})">
                    ${buttonText}
                </button>
            </div>
        `;
    }

    // 获取分类名称
    getCategoryName(category) {
        const names = {
            health: '健康',
            learning: '学习',
            work: '工作',
            personal: '个人'
        };
        return names[category] || '其他';
    }

    // 切换习惯完成状态
    toggleHabit(id) {
        const habit = this.habits.find(h => h.id === id);
        if (!habit) return;

        // 创建涟漪效果
        const button = event.target;
        this.createRippleEffect(button, event);

        habit.completedToday = !habit.completedToday;

        if (habit.completedToday) {
            habit.currentStreak += 1;
            this.showAchievementNotification(habit);
        } else {
            habit.currentStreak = Math.max(0, habit.currentStreak - 1);
        }

        this.saveHabits();
        this.renderHabits();
        this.updateProgress();
        this.renderWeeklyCalendar();
    }

    // 创建涟漪效果
    createRippleEffect(button, event) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // 更新进度
    updateProgress() {
        const totalHabits = this.habits.length;
        const completedHabits = this.habits.filter(h => h.completedToday).length;
        const percentage = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

        document.getElementById('progressPercentage').textContent = `${percentage}%`;
        document.getElementById('completedCount').textContent = completedHabits;
        document.getElementById('totalCount').textContent = totalHabits;

        // 更新进度环
        const progressCircle = document.getElementById('progressCircle');
        const circumference = 2 * Math.PI * 65; // r=65
        const offset = circumference - (percentage / 100) * circumference;
        progressCircle.style.strokeDashoffset = offset;
    }

    // 获取当前周
    getCurrentWeek() {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());

        const week = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            week.push(day);
        }
        return week;
    }

    // 渲染周历
    renderWeeklyCalendar() {
        const container = document.getElementById('weeklyGrid');
        const days = ['日', '一', '二', '三', '四', '五', '六'];
        const today = new Date();

        container.innerHTML = this.currentWeek.map((date, index) => {
            const isToday = date.toDateString() === today.toDateString();
            const dayClass = isToday ? 'today' : '';
            const completedHabits = this.getCompletedHabitsForDate(date);
            const totalHabits = this.habits.length;
            const progressText = `${completedHabits}/${totalHabits}`;

            return `
                <div class="calendar-day ${dayClass}">
                    <div class="day-number">${days[index]}</div>
                    <div class="day-number">${date.getDate()}</div>
                    <div class="day-progress">${progressText}</div>
                </div>
            `;
        }).join('');

        // 更新周范围显示
        const firstDay = this.currentWeek[0];
        const lastDay = this.currentWeek[6];
        const weekRange = `${firstDay.getMonth() + 1}月${firstDay.getDate()}日 - ${lastDay.getMonth() + 1}月${lastDay.getDate()}日`;
        document.getElementById('weekRange').textContent = weekRange;
    }

    // 获取指定日期的完成习惯数
    getCompletedHabitsForDate(date) {
        // 简化处理，今天的数据用实际数据，其他日期用随机数据
        const today = new Date();
        if (date.toDateString() === today.toDateString()) {
            return this.habits.filter(h => h.completedToday).length;
        }
        // 模拟历史数据
        return Math.floor(Math.random() * this.habits.length);
    }

    // 显示随机励志语录
    showRandomQuote() {
        const quote = this.motivationalQuotes[Math.floor(Math.random() * this.motivationalQuotes.length)];
        document.getElementById('quoteText').textContent = `"${quote.text}"`;
        document.getElementById('quoteAuthor').textContent = `— ${quote.author}`;
    }

    // 显示成就通知
    showAchievementNotification(habit) {
        if (habit.currentStreak % 7 === 0 && habit.currentStreak > 0) {
            const notification = document.getElementById('achievementNotification');
            notification.querySelector('div:last-child').textContent = `${habit.name} 连续打卡${habit.currentStreak}天！`;
            notification.classList.add('show');

            setTimeout(() => {
                notification.classList.remove('show');
            }, 4000);
        }
    }

    // 绑定事件
    bindEvents() {
        // 周导航按钮
        document.getElementById('prevWeek').addEventListener('click', () => {
            this.currentWeek = this.currentWeek.map(date => {
                const newDate = new Date(date);
                newDate.setDate(date.getDate() - 7);
                return newDate;
            });
            this.renderWeeklyCalendar();
        });

        document.getElementById('nextWeek').addEventListener('click', () => {
            this.currentWeek = this.currentWeek.map(date => {
                const newDate = new Date(date);
                newDate.setDate(date.getDate() + 7);
                return newDate;
            });
            this.renderWeeklyCalendar();
        });

        // 点击通知关闭
        document.getElementById('achievementNotification').addEventListener('click', () => {
            document.getElementById('achievementNotification').classList.remove('show');
        });
    }
}

// 初始化
const habitTracker = new HabitTracker(); 