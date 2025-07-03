// 增强版心情记录页面功能
class MoodDiary {
    constructor() {
        this.selectedMood = 'happy';
        this.selectedWeather = 'sunny';
        this.selectedIntensity = 3;
        this.tags = [];
        this.entries = this.loadEntries();
        this.moodMap = this.initializeMoodMap();
        this.weatherMap = this.initializeWeatherMap();
        this.isAutoSaving = false;
        this.init();
    }

    // 初始化心情映射
    initializeMoodMap() {
        return {
            happy: { emoji: '😊', label: '开心', color: '#10ac84', intensity: 8 },
            excited: { emoji: '🤩', label: '兴奋', color: '#ff6b6b', intensity: 9 },
            calm: { emoji: '😌', label: '平静', color: '#74b9ff', intensity: 7 },
            grateful: { emoji: '🙏', label: '感恩', color: '#a29bfe', intensity: 8 },
            love: { emoji: '🥰', label: '幸福', color: '#fd79a8', intensity: 9 },
            tired: {
                emoji: '😴', label: '疲惫', color: #fd79a8', intensity: 4 },
            anxious: { emoji: '😰', label: '焦虑', color: '#fdcb6e', intensity: 3 },
        sad: { emoji: '😢', label: '难过', color: '#e17055', intensity: 2 },
        angry: { emoji: '😠', label: '愤怒', color: '#e84393', intensity: 2 },
        confused: { emoji: '😕', label: '困惑', color: '#636e72', intensity: 4 }
    };
}

// 初始化天气映射
initializeWeatherMap() {
    return {
        sunny: { emoji: '☀️', label: '晴朗', color: '#fdcb6e' },
        cloudy: { emoji: '☁️', label: '多云', color: '#74b9ff' },
        rainy: { emoji: '🌧️', label: '雨天', color: '#81ecec' },
        snowy: { emoji: '❄️', label: '雪天', color: '#ddd' }
    };
}

init() {
    this.updateDateTime();
    this.bindEvents();
    this.bindAdvancedEvents();
    this.loadTodayEntry();
    this.updateStatistics();
    this.generateMiniCalendar();
    this.displayRecentEntries();
    this.setupAutoSave();
    this.initializeAnimations();

    // 定时更新时间
    setInterval(() => this.updateDateTime(), 60000);
}

// 更新日期时间显示
updateDateTime() {
    const now = new Date();
    const dateOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    };
    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit'
    };

    const dateStr = now.toLocaleDateString('zh-CN', dateOptions);
    const timeStr = now.toLocaleTimeString('zh-CN', timeOptions);

    const dateElement = document.getElementById('currentDate');
    const timeElement = document.getElementById('currentTime');

    if (dateElement) dateElement.textContent = dateStr;
    if (timeElement) timeElement.textContent = timeStr;
}

// 加载心情记录
loadEntries() {
    const defaultEntries = [
        {
            id: this.generateId(),
            date: '2024-01-14',
            mood: 'calm',
            title: '宁静的周日午后',
            content: '今天在家休息，泡了一壶好茶，读了几页喜欢的书。窗外阳光温和，内心感到前所未有的平静。有时候慢下来真的很好，让心灵得到滋养。',
            tags: ['休息', '阅读', '茶', '阳光'],
            weather: 'sunny',
            intensity: 3,
            timestamp: '2024-01-14T15:30:00Z'
        },
        {
            id: this.generateId(),
            date: '2024-01-13',
            mood: 'happy',
            title: '朋友聚会的快乐时光',
            content: '和朋友们一起聚餐，大家分享着近期的生活点滴。笑声不断，美食相伴，这种简单的快乐真的很珍贵。感恩身边有这么多温暖的人。',
            tags: ['朋友', '聚餐', '笑声', '感恩'],
            weather: 'cloudy',
            intensity: 4,
            timestamp: '2024-01-13T19:15:00Z'
        },
        {
            id: this.generateId(),
            date: '2024-01-12',
            mood: 'excited',
            title: '项目成功完成！',
            content: '经过几周的努力，项目终于顺利完成了！看到最终的成果，内心充满了成就感和兴奋。团队的配合也很棒，这种协作的快乐让人难忘。',
            tags: ['工作', '成就', '团队', '完成'],
            weather: 'sunny',
            intensity: 5,
            timestamp: '2024-01-12T18:00:00Z'
        }
    ];

    return JSON.parse(localStorage.getItem('moodEntries')) || defaultEntries;
}

// 生成唯一ID
generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 保存记录
saveEntries() {
    localStorage.setItem('moodEntries', JSON.stringify(this.entries));
    this.updateStatistics();
    this.generateMiniCalendar();
    this.displayRecentEntries();
}

// 绑定基础事件
bindEvents() {
    // 心情选择
    document.querySelectorAll('.mood-option').forEach(option => {
        option.addEventListener('click', (e) => {
            this.selectMood(option);
        });
    });

    // 天气选择
    document.querySelectorAll('.weather-option').forEach(option => {
        option.addEventListener('click', (e) => {
            this.selectWeather(option);
        });
    });

    // 强度选择
    document.querySelectorAll('.intensity-option').forEach(option => {
        option.addEventListener('click', (e) => {
            this.selectIntensity(option);
        });
    });

    // 标签相关
    const tagInput = document.getElementById('tagInput');
    if (tagInput) {
        tagInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && tagInput.value.trim()) {
                e.preventDefault();
                this.addTag(tagInput.value.trim());
                tagInput.value = '';
            }
        });
    }

    // 建议标签
    document.querySelectorAll('.suggested-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            this.addTag(tag.dataset.tag);
        });
    });

    // 表单提交
    const form = document.getElementById('diaryForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEntry();
        });
    }

    // 全局函数
    window.addTagFromInput = () => {
        const tagInput = document.getElementById('tagInput');
        if (tagInput && tagInput.value.trim()) {
            this.addTag(tagInput.value.trim());
            tagInput.value = '';
        }
    };
}

// 绑定高级事件
bindAdvancedEvents() {
    // 表单输入自动保存
    ['diaryTitle', 'diaryContent'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', () => {
                this.scheduleAutoSave();
            });
        }
    });

    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 's':
                    e.preventDefault();
                    this.saveEntry();
                    break;
                case 'd':
                    e.preventDefault();
                    this.saveDraft();
                    break;
            }
        }
    });
}

// 选择心情
selectMood(option) {
    // 移除其他选中状态
    document.querySelectorAll('.mood-option').forEach(o => {
        o.classList.remove('selected');
    });

    // 添加选中状态
    option.classList.add('selected');
    this.selectedMood = option.dataset.mood;

    // 更新头部显示
    this.updateHeaderMood();

    // 添加选择动画效果
    this.addSelectAnimation(option);
}

// 选择天气
selectWeather(option) {
    document.querySelectorAll('.weather-option').forEach(o => {
        o.classList.remove('selected');
    });
    option.classList.add('selected');
    this.selectedWeather = option.dataset.weather;
    this.addSelectAnimation(option);
}

// 选择强度
selectIntensity(option) {
    document.querySelectorAll('.intensity-option').forEach(o => {
        o.classList.remove('selected');
    });
    option.classList.add('selected');
    this.selectedIntensity = parseInt(option.dataset.intensity);
    this.addSelectAnimation(option);
}

// 添加选择动画
addSelectAnimation(element) {
    element.style.transform = 'scale(1.1)';
    setTimeout(() => {
        element.style.transform = '';
    }, 200);
}

// 更新头部心情显示
updateHeaderMood() {
    const mood = this.moodMap[this.selectedMood];
    if (!mood) return;

    const displayElement = document.getElementById('currentMoodDisplay');
    const textElement = document.getElementById('currentMoodText');

    if (displayElement) {
        displayElement.textContent = mood.emoji;
        displayElement.style.background = `linear-gradient(135deg, ${mood.color}20, ${mood.color}40)`;
    }
    if (textElement) {
        textElement.textContent = mood.label;
    }
}

// 添加标签
addTag(tagText) {
    if (!tagText || this.tags.includes(tagText) || this.tags.length >= 8) {
        return;
    }

    this.tags.push(tagText);
    this.updateTagsDisplay();
    this.showNotification(`标签 "${tagText}" 已添加`, 'success');
}

// 移除标签
removeTag(tagText) {
    this.tags = this.tags.filter(tag => tag !== tagText);
    this.updateTagsDisplay();
}

// 更新标签显示
updateTagsDisplay() {
    const container = document.getElementById('tagsDisplay');
    if (!container) return;

    container.innerHTML = this.tags.map(tag => `
            <div class="tag">
                <span>${tag}</span>
                <button class="tag-remove" onclick="moodDiary.removeTag('${tag}')" type="button">×</button>
            </div>
        `).join('');
}

// 加载今日记录
loadTodayEntry() {
    const today = new Date().toISOString().split('T')[0];
    const todayEntry = this.entries.find(entry => entry.date === today);

    if (todayEntry) {
        this.loadEntry(todayEntry);
        this.showNotification('已加载今日记录', 'info');
    } else {
        this.resetForm();
    }
}

// 加载指定记录
loadEntry(entry) {
    document.getElementById('diaryTitle').value = entry.title || '';
    document.getElementById('diaryContent').value = entry.content || '';
    this.selectedMood = entry.mood || 'happy';
    this.selectedWeather = entry.weather || 'sunny';
    this.selectedIntensity = entry.intensity || 3;
    this.tags = entry.tags || [];

    this.updateSelections();
    this.updateTagsDisplay();
}

// 更新所有选择状态
updateSelections() {
    // 更新心情选择
    document.querySelectorAll('.mood-option').forEach(option => {
        option.classList.toggle('selected', option.dataset.mood === this.selectedMood);
    });

    // 更新天气选择
    document.querySelectorAll('.weather-option').forEach(option => {
        option.classList.toggle('selected', option.dataset.weather === this.selectedWeather);
    });

    // 更新强度选择
    document.querySelectorAll('.intensity-option').forEach(option => {
        option.classList.toggle('selected', parseInt(option.dataset.intensity) === this.selectedIntensity);
    });

    this.updateHeaderMood();
}

// 重置表单
resetForm() {
    document.getElementById('diaryTitle').value = '';
    document.getElementById('diaryContent').value = '';
    this.tags = [];
    this.selectedMood = 'happy';
    this.selectedWeather = 'sunny';
    this.selectedIntensity = 3;
    this.updateSelections();
    this.updateTagsDisplay();
}

// 保存记录
saveEntry() {
    const title = document.getElementById('diaryTitle').value.trim();
    const content = document.getElementById('diaryContent').value.trim();

    if (!title && !content) {
        this.showNotification('请至少填写标题或内容', 'warning');
        return;
    }

    const today = new Date().toISOString().split('T')[0];
    const existingIndex = this.entries.findIndex(entry => entry.date === today);

    const entryData = {
        id: existingIndex >= 0 ? this.entries[existingIndex].id : this.generateId(),
        date: today,
        mood: this.selectedMood,
        title: title || '今日心情',
        content: content,
        tags: [...this.tags],
        weather: this.selectedWeather,
        intensity: this.selectedIntensity,
        timestamp: new Date().toISOString()
    };

    if (existingIndex >= 0) {
        this.entries[existingIndex] = entryData;
        this.showNotification('心情记录已更新！', 'success');
    } else {
        this.entries.unshift(entryData);
        this.showNotification('心情记录已保存！', 'success');
    }

    this.saveEntries();
    this.addSaveAnimation();
}

// 保存草稿
saveDraft() {
    const draftData = {
        mood: this.selectedMood,
        weather: this.selectedWeather,
        intensity: this.selectedIntensity,
        title: document.getElementById('diaryTitle').value,
        content: document.getElementById('diaryContent').value,
        tags: [...this.tags],
        timestamp: new Date().toISOString()
    };

    localStorage.setItem('moodDiaryDraft', JSON.stringify(draftData));
    this.showNotification('草稿已保存', 'info');
}

// 自动保存设置
setupAutoSave() {
    this.loadDraft();
}

// 加载草稿
loadDraft() {
    const draft = localStorage.getItem('moodDiaryDraft');
    if (draft) {
        try {
            const draftData = JSON.parse(draft);
            const today = new Date().toISOString().split('T')[0];
            const todayEntry = this.entries.find(entry => entry.date === today);

            // 如果今天没有正式记录，则加载草稿
            if (!todayEntry && draftData.title) {
                this.loadEntry(draftData);
                this.showNotification('已加载未保存的草稿', 'info');
            }
        } catch (e) {
            console.warn('草稿数据加载失败:', e);
        }
    }
}

// 计划自动保存
scheduleAutoSave() {
    if (this.autoSaveTimer) {
        clearTimeout(this.autoSaveTimer);
    }

    this.autoSaveTimer = setTimeout(() => {
        this.saveDraft();
    }, 3000); // 3秒后自动保存草稿
}

// 生成迷你日历
generateMiniCalendar() {
    const container = document.getElementById('miniCalendar');
    if (!container) return;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    // 更新月份显示
    const monthElement = document.getElementById('calendarMonth');
    if (monthElement) {
        monthElement.textContent = `${year}年${month + 1}月`;
    }

    // 获取本月的天数和第一天是星期几
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    let calendarHTML = '';

    // 添加星期标题
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    weekDays.forEach(day => {
        calendarHTML += `<div style="font-weight: bold; color: #666; font-size: 0.7rem;">${day}</div>`;
    });

    // 添加空白格子
    for (let i = 0; i < firstDayOfWeek; i++) {
        calendarHTML += `<div class="calendar-day"></div>`;
    }

    // 添加日期
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const entry = this.entries.find(e => e.date === dateStr);
        const isToday = day === now.getDate();

        let classes = ['calendar-day'];
        if (entry) classes.push('has-mood');
        if (isToday) classes.push('today');

        const emoji = entry ? this.moodMap[entry.mood]?.emoji || '😊' : '';

        calendarHTML += `
                <div class="${classes.join(' ')}" data-date="${dateStr}" title="${entry ? entry.title : ''}" onclick="moodDiary.selectCalendarDate('${dateStr}')">
                    <div style="font-size: 0.7rem;">${day}</div>
                    ${emoji ? `<div style="font-size: 0.8rem; margin-top: -2px;">${emoji}</div>` : ''}
                </div>
            `;
    }

    container.innerHTML = calendarHTML;
}

// 选择日历日期
selectCalendarDate(dateStr) {
    const entry = this.entries.find(e => e.date === dateStr);
    if (entry) {
        this.loadEntry(entry);
        this.showNotification(`已加载 ${dateStr} 的记录`, 'info');
    } else {
        const date = new Date(dateStr);
        const today = new Date();
        if (date <= today) {
            this.resetForm();
            this.showNotification(`准备记录 ${dateStr} 的心情`, 'info');
        } else {
            this.showNotification('不能记录未来的心情哦', 'warning');
        }
    }
}

// 更新统计信息
updateStatistics() {
    const totalEntries = this.entries.length;
    const today = new Date();

    // 计算连续记录天数
    let streakDays = 0;
    let currentDate = new Date(today);

    while (true) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const hasEntry = this.entries.some(entry => entry.date === dateStr);

        if (hasEntry) {
            streakDays++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            break;
        }
    }

    // 计算平均心情
    const moodScores = this.entries.map(entry => {
        return this.moodMap[entry.mood]?.intensity || 5;
    });
    const avgMood = moodScores.length > 0 ?
        (moodScores.reduce((sum, score) => sum + score, 0) / moodScores.length).toFixed(1) : '0.0';

    // 计算积极情绪占比
    const positiveMoods = ['happy', 'excited', 'calm', 'grateful', 'love'];
    const positiveCount = this.entries.filter(entry => positiveMoods.includes(entry.mood)).length;
    const positiveRate = totalEntries > 0 ? Math.round((positiveCount / totalEntries) * 100) : 0;

    // 更新显示
    this.updateStatElement('totalEntries', totalEntries);
    this.updateStatElement('streakDays', streakDays);
    this.updateStatElement('avgMood', avgMood);
    this.updateStatElement('positiveRate', `${positiveRate}%`);
}

// 更新统计元素
updateStatElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

// 显示最近记录
displayRecentEntries() {
    const container = document.getElementById('recentEntries');
    if (!container) return;

    const recentEntries = this.entries.slice(0, 5);

    if (recentEntries.length === 0) {
        container.innerHTML = `
                <div style="text-align: center; color: #666; padding: 2rem;">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">📝</div>
                    <div>还没有心情记录</div>
                    <div style="font-size: 0.8rem; margin-top: 0.3rem;">开始记录你的第一条心情吧！</div>
                </div>
            `;
        return;
    }

    container.innerHTML = recentEntries.map(entry => {
        const mood = this.moodMap[entry.mood];
        const date = new Date(entry.date);
        const dateStr = date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });

        return `
                <div class="recent-entry" onclick="moodDiary.loadEntry(${JSON.stringify(entry).replace(/"/g, '&quot;')})">
                    <div class="entry-date">${dateStr}</div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span class="entry-mood">${mood?.emoji || '😊'}</span>
                        <span class="entry-title">${entry.title}</span>
                    </div>
                </div>
            `;
    }).join('');
}

// 初始化动画
initializeAnimations() {
    // 为心情选项添加悬停动画
    document.querySelectorAll('.mood-option').forEach(option => {
        option.addEventListener('mouseenter', () => {
            const icon = option.querySelector('.mood-icon');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(10deg)';
            }
        });

        option.addEventListener('mouseleave', () => {
            const icon = option.querySelector('.mood-icon');
            if (icon) {
                icon.style.transform = '';
            }
        });
    });
}

// 添加保存动画
addSaveAnimation() {
    const saveBtn = document.querySelector('.save-btn');
    if (saveBtn) {
        saveBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            saveBtn.style.transform = '';
        }, 150);
    }
}

// 显示通知
showNotification(message, type = 'info') {
    // 移除现有通知
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    const colors = {
        success: '#10ac84',
        warning: '#ff9f43',
        error: '#e74c3c',
        info: '#3742fa'
    };

    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 1000;
            font-weight: 500;
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            max-width: 300px;
        `;

    notification.textContent = message;
    document.body.appendChild(notification);

    // 滑入动画
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);

    // 自动消失
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 获取心情数据用于分析
getMoodData() {
    return {
        entries: this.entries,
        statistics: {
            total: this.entries.length,
            streak: this.calculateStreak(),
            averageMood: this.calculateAverageMood(),
            positiveRate: this.calculatePositiveRate()
        }
    };
}

// 计算连续天数
calculateStreak() {
    let streak = 0;
    let currentDate = new Date();

    while (true) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const hasEntry = this.entries.some(entry => entry.date === dateStr);

        if (hasEntry) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            break;
        }
    }

    return streak;
}

// 计算平均心情
calculateAverageMood() {
    if (this.entries.length === 0) return 0;

    const total = this.entries.reduce((sum, entry) => {
        return sum + (this.moodMap[entry.mood]?.intensity || 5);
    }, 0);

    return (total / this.entries.length).toFixed(1);
}

// 计算积极情绪占比
calculatePositiveRate() {
    if (this.entries.length === 0) return 0;

    const positiveMoods = ['happy', 'excited', 'calm', 'grateful', 'love'];
    const positiveCount = this.entries.filter(entry =>
        positiveMoods.includes(entry.mood)
    ).length;

    return Math.round((positiveCount / this.entries.length) * 100);
}
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.moodDiary = new MoodDiary();
});

// 导出用于其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MoodDiary;
} 