// LifeSync 首页功能脚本

document.addEventListener('DOMContentLoaded', function () {
    // 初始化首页功能
    initializeDashboard();

    // 加载今日数据
    loadTodayData();

    // 启动数字动画
    animateNumbers();

    // 更新活动时间线
    updateActivityTimeline();
});

// 初始化仪表盘
function initializeDashboard() {
    console.log('初始化首页仪表盘');

    // 检查用户登录状态
    const isLoggedIn = checkLoginStatus();
    if (!isLoggedIn) {
        showGuestMode();
    }

    // 设置定时更新
    setInterval(updateRealTimeData, 30000); // 每30秒更新一次
}

// 检查登录状态
function checkLoginStatus() {
    const userToken = LifeSync.Storage.get('userToken');
    return userToken !== null;
}

// 显示访客模式
function showGuestMode() {
    const dashboardCards = document.querySelectorAll('.dashboard-card');
    dashboardCards.forEach(card => {
        const overlay = document.createElement('div');
        overlay.className = 'guest-overlay';
        overlay.innerHTML = `
            <div class="guest-message">
                <p>🔐 请先登录查看个人数据</p>
                <a href="login.html" class="btn btn-primary">立即登录</a>
            </div>
        `;
        card.style.position = 'relative';
        card.appendChild(overlay);
    });
}

// 加载今日数据
function loadTodayData() {
    // 模拟从本地存储加载数据
    const todayData = {
        focusTime: LifeSync.Storage.get('todayFocusTime', 0),
        completedHabits: LifeSync.Storage.get('completedHabits', []),
        currentMood: LifeSync.Storage.get('currentMood', { icon: '😊', text: '今天感觉不错' }),
        goalProgress: LifeSync.Storage.get('goalProgress', [])
    };

    updateDashboardData(todayData);
}

// 更新仪表盘数据
function updateDashboardData(data) {
    // 更新专注时间
    const focusTimeElement = document.getElementById('todayFocusTime');
    if (focusTimeElement) {
        const hours = Math.floor(data.focusTime / 60);
        const minutes = data.focusTime % 60;
        focusTimeElement.textContent = `${hours}小时${minutes}分钟`;
    }

    // 更新心情显示
    const moodIcon = document.querySelector('.mood-icon');
    const moodText = document.querySelector('.mood-text');
    if (moodIcon && moodText) {
        moodIcon.textContent = data.currentMood.icon;
        moodText.textContent = data.currentMood.text;
    }

    // 更新习惯进度
    updateHabitProgress(data.completedHabits);

    // 更新目标进度
    updateGoalProgress(data.goalProgress);
}

// 更新习惯进度
function updateHabitProgress(completedHabits) {
    const progressItems = document.querySelectorAll('.progress-item');
    progressItems.forEach((item, index) => {
        const progressBar = item.querySelector('.progress-fill');
        const progressText = item.querySelector('.progress-text');

        // 模拟进度数据
        const mockProgress = [80, 100, 60]; // 对应喝水、阅读、运动
        const mockTexts = ['8/10', '✓', '30/50分钟'];

        if (progressBar && progressText) {
            progressBar.style.width = `${mockProgress[index] || 0}%`;
            progressText.textContent = mockTexts[index] || '0%';
        }
    });
}

// 更新目标进度
function updateGoalProgress(goalProgress) {
    const goalItems = document.querySelectorAll('.goal-item');
    goalItems.forEach((item, index) => {
        const progressBar = item.querySelector('.progress-fill');
        const progressPercentage = item.querySelector('.progress-percentage');

        // 模拟目标进度
        const mockProgress = [75, 60];

        if (progressBar && progressPercentage) {
            const progress = mockProgress[index] || 0;
            progressBar.style.width = `${progress}%`;
            progressPercentage.textContent = `${progress}%`;
        }
    });
}

// 数字动画效果
function animateNumbers() {
    const numberElements = document.querySelectorAll('.stat-number');

    numberElements.forEach(element => {
        const targetNumber = parseInt(element.textContent.replace(/,/g, ''));
        animateNumber(element, 0, targetNumber, 2000);
    });
}

// 数字递增动画
function animateNumber(element, start, end, duration) {
    const startTime = performance.now();

    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // 使用缓动函数
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentNumber = Math.round(start + (end - start) * easeOut);

        element.textContent = currentNumber.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }

    requestAnimationFrame(updateNumber);
}

// 更新活动时间线
function updateActivityTimeline() {
    const activityList = document.getElementById('activityList');
    if (!activityList) return;

    // 从本地存储获取活动记录
    const activities = LifeSync.Storage.get('recentActivities', []);

    if (activities.length === 0) {
        // 如果没有活动记录，显示默认内容
        return;
    }

    // 清空现有内容并添加新活动
    activityList.innerHTML = '';
    activities.slice(0, 5).forEach(activity => { // 只显示最近5条
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <span class="activity-time">${formatTimeAgo(activity.timestamp)}</span>
            <span class="activity-text">${LifeSync.escapeHtml(activity.text)}</span>
        `;
        activityList.appendChild(activityItem);
    });
}

// 格式化时间为相对时间
function formatTimeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    return `${days}天前`;
}

// 更新实时数据
function updateRealTimeData() {
    const now = new Date();
    const currentHour = now.getHours();

    // 根据时间段更新问候语
    updateGreeting(currentHour);

    // 更新统计数字
    updateStatsNumbers();
}

// 更新问候语
function updateGreeting(hour) {
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (!heroSubtitle) return;

    let greeting;
    if (hour < 6) greeting = '🌙 深夜好，注意休息哦';
    else if (hour < 12) greeting = '🌅 早上好，开启美好的一天';
    else if (hour < 18) greeting = '☀️ 下午好，继续加油吧';
    else greeting = '🌆 晚上好，今天辛苦了';

    heroSubtitle.textContent = greeting;
}

// 更新统计数字
function updateStatsNumbers() {
    // 模拟数据增长
    const userCountElement = document.getElementById('totalUsers');
    const habitCountElement = document.getElementById('totalHabits');
    const goalCountElement = document.getElementById('totalGoals');

    if (userCountElement) {
        const current = parseInt(userCountElement.textContent.replace(/,/g, ''));
        userCountElement.textContent = (current + Math.floor(Math.random() * 3)).toLocaleString();
    }

    if (habitCountElement) {
        const current = parseInt(habitCountElement.textContent.replace(/,/g, ''));
        habitCountElement.textContent = (current + Math.floor(Math.random() * 10)).toLocaleString();
    }

    if (goalCountElement) {
        const current = parseInt(goalCountElement.textContent.replace(/,/g, ''));
        goalCountElement.textContent = (current + Math.floor(Math.random() * 5)).toLocaleString();
    }
}

// 开始番茄钟（从首页快速启动）
function startPomodoro() {
    // 记录活动
    addActivity('开始了番茄钟专注计时');

    // 显示通知
    LifeSync.showNotification('番茄钟已启动，开始25分钟专注时间！', 'success');

    // 跳转到番茄钟页面
    setTimeout(() => {
        window.location.href = 'pomodoro.html?autostart=true';
    }, 1000);
}

// 记录心情（从首页快速记录）
function recordMood() {
    // 简单的心情选择弹窗
    const moods = ['😊', '😃', '😐', '😔', '😴'];
    const moodTexts = ['开心', '兴奋', '一般', '有点累', '想睡觉'];

    let moodHtml = '<div class="mood-selector">';
    moods.forEach((mood, index) => {
        moodHtml += `
            <button class="mood-btn" onclick="selectMood('${mood}', '${moodTexts[index]}')">
                ${mood}<br><span>${moodTexts[index]}</span>
            </button>
        `;
    });
    moodHtml += '</div>';

    // 这里可以创建一个模态框显示心情选择器
    // 简化版本：直接跳转到心情记录页面
    window.location.href = 'mood-record.html';
}

// 选择心情
function selectMood(icon, text) {
    const currentMood = { icon, text, timestamp: new Date().toISOString() };
    LifeSync.Storage.set('currentMood', currentMood);

    // 添加到活动记录
    addActivity(`记录了今日心情：${icon} ${text}`);

    // 更新页面显示
    const moodIcon = document.querySelector('.mood-icon');
    const moodText = document.querySelector('.mood-text');
    if (moodIcon && moodText) {
        moodIcon.textContent = icon;
        moodText.textContent = text;
    }

    LifeSync.showNotification('心情记录成功！', 'success');
}

// 添加活动记录
function addActivity(text) {
    const activities = LifeSync.Storage.get('recentActivities', []);
    activities.unshift({
        id: LifeSync.generateId(),
        text: text,
        timestamp: new Date().toISOString()
    });

    // 只保留最近20条记录
    if (activities.length > 20) {
        activities.splice(20);
    }

    LifeSync.Storage.set('recentActivities', activities);
    updateActivityTimeline();
}

// 导出全局函数
window.startPomodoro = startPomodoro;
window.recordMood = recordMood;
window.selectMood = selectMood; 