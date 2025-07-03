// 心情日历页面功能
class MoodCalendar {
    constructor() {
        this.currentDate = new Date();
        this.entries = this.loadEntries();
        this.moodEmojis = {
            happy: '😊',
            calm: '😌',
            excited: '🤩',
            tired: '😴',
            sad: '😢',
            anxious: '😰'
        };
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderCalendar();
        this.updateMonthDisplay();
    }

    // 加载心情记录
    loadEntries() {
        const defaultEntries = [
            { date: '2024-01-15', mood: 'happy', title: '愉快的一天' },
            { date: '2024-01-14', mood: 'calm', title: '平静思考' },
            { date: '2024-01-13', mood: 'excited', title: '兴奋的聚会' },
            { date: '2024-01-12', mood: 'happy', title: '工作顺利' },
            { date: '2024-01-11', mood: 'tired', title: '有点疲惫' },
            { date: '2024-01-10', mood: 'calm', title: '放松的晚上' },
            { date: '2024-01-09', mood: 'happy', title: '开心购物' },
            { date: '2024-01-08', mood: 'sad', title: '有些难过' },
            { date: '2024-01-07', mood: 'excited', title: '周末开始' },
            { date: '2024-01-06', mood: 'tired', title: '工作劳累' }
        ];

        return JSON.parse(localStorage.getItem('moodEntries')) || defaultEntries;
    }

    // 绑定事件
    bindEvents() {
        // 上一月按钮
        document.getElementById('prevMonth')?.addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
            this.updateMonthDisplay();
        });

        // 下一月按钮
        document.getElementById('nextMonth')?.addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
            this.updateMonthDisplay();
        });
    }

    // 更新月份显示
    updateMonthDisplay() {
        const monthElement = document.getElementById('currentMonth');
        if (monthElement) {
            const year = this.currentDate.getFullYear();
            const month = this.currentDate.getMonth() + 1;
            monthElement.textContent = `${year}年${month}月`;
        }
    }

    // 渲染日历
    renderCalendar() {
        const daysGrid = document.getElementById('daysGrid');
        if (!daysGrid) return;

        daysGrid.innerHTML = '';

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        // 获取当月第一天和最后一天
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        // 获取第一天是星期几（调整为周日开始）
        const startDayOfWeek = firstDay.getDay();

        // 计算需要显示的总天数
        const totalCells = Math.ceil((lastDay.getDate() + startDayOfWeek) / 7) * 7;

        // 生成日历格子
        for (let i = 0; i < totalCells; i++) {
            const dayCell = this.createDayCell(i, startDayOfWeek, lastDay.getDate(), year, month);
            daysGrid.appendChild(dayCell);
        }
    }

    // 创建日期格子
    createDayCell(index, startDayOfWeek, monthDays, year, month) {
        const dayCell = document.createElement('div');
        dayCell.className = 'day-cell';

        const dayNumber = index - startDayOfWeek + 1;

        if (dayNumber > 0 && dayNumber <= monthDays) {
            // 当月日期
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
            const entry = this.findEntryByDate(dateStr);
            const isToday = this.isToday(dateStr);

            dayCell.innerHTML = this.createDayCellContent(dayNumber, entry, isToday);

            if (entry) {
                dayCell.classList.add('has-mood');
            }

            if (isToday) {
                dayCell.classList.add('today');
            }

            // 添加点击事件
            dayCell.addEventListener('click', () => {
                this.showDayDetail(dateStr, entry);
            });

        } else {
            // 上月或下月日期（灰色显示）
            dayCell.style.opacity = '0.3';
            dayCell.style.pointerEvents = 'none';

            if (dayNumber <= 0) {
                // 上月日期
                const prevMonth = new Date(year, month - 1, 0);
                const prevDay = prevMonth.getDate() + dayNumber;
                dayCell.innerHTML = `<div class="day-number">${prevDay}</div>`;
            } else {
                // 下月日期
                const nextDay = dayNumber - monthDays;
                dayCell.innerHTML = `<div class="day-number">${nextDay}</div>`;
            }
        }

        return dayCell;
    }

    // 创建日期格子内容
    createDayCellContent(dayNumber, entry, isToday) {
        let content = `<div class="day-number">${dayNumber}</div>`;

        if (entry) {
            const emoji = this.moodEmojis[entry.mood] || '😐';
            content += `<div class="day-mood">${emoji}</div>`;
        }

        return content;
    }

    // 根据日期查找记录
    findEntryByDate(dateStr) {
        return this.entries.find(entry => entry.date === dateStr);
    }

    // 检查是否为今天
    isToday(dateStr) {
        const today = new Date().toISOString().split('T')[0];
        return dateStr === today;
    }

    // 显示日期详情
    showDayDetail(dateStr, entry) {
        const modal = this.createDetailModal(dateStr, entry);
        document.body.appendChild(modal);

        // 添加关闭事件
        const closeBtn = modal.querySelector('.close-btn');
        const overlay = modal.querySelector('.modal-overlay');

        const closeModal = () => {
            modal.remove();
        };

        closeBtn?.addEventListener('click', closeModal);
        overlay?.addEventListener('click', closeModal);

        // ESC键关闭
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
    }

    // 创建详情模态框
    createDetailModal(dateStr, entry) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;
        modal.className = 'modal-overlay';

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            border-radius: 15px;
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            position: relative;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        `;

        const date = new Date(dateStr);
        const formattedDate = date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });

        modalContent.innerHTML = `
            <button class="close-btn" style="
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #666;
            ">&times;</button>
            
            <h3 style="margin-bottom: 1rem; color: #333;">${formattedDate}</h3>
            
            ${entry ? `
                <div style="text-align: center; margin-bottom: 1.5rem;">
                    <div style="font-size: 3rem; margin-bottom: 0.5rem;">
                        ${this.moodEmojis[entry.mood] || '😐'}
                    </div>
                    <div style="font-size: 1.2rem; font-weight: bold; color: #667eea;">
                        ${entry.title || '心情记录'}
                    </div>
                </div>
                
                ${entry.content ? `
                    <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                        <div style="font-weight: bold; margin-bottom: 0.5rem;">内容：</div>
                        <div style="line-height: 1.6;">${entry.content}</div>
                    </div>
                ` : ''}
                
                ${entry.tags && entry.tags.length > 0 ? `
                    <div style="margin-bottom: 1rem;">
                        <div style="font-weight: bold; margin-bottom: 0.5rem;">标签：</div>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                            ${entry.tags.map(tag => `
                                <span style="background: #667eea; color: white; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem;">
                                    ${tag}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <div style="text-align: center;">
                    <button onclick="location.href='mood-diary.html'" style="
                        background: #667eea;
                        color: white;
                        border: none;
                        padding: 0.8rem 1.5rem;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 1rem;
                    ">编辑记录</button>
                </div>
            ` : `
                <div style="text-align: center; color: #666;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📝</div>
                    <p style="margin-bottom: 1.5rem;">这一天还没有心情记录</p>
                    <button onclick="location.href='mood-diary.html'" style="
                        background: #ff758c;
                        color: white;
                        border: none;
                        padding: 0.8rem 1.5rem;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 1rem;
                    ">添加记录</button>
                </div>
            `}
        `;

        modal.appendChild(modalContent);
        return modal;
    }

    // 获取月度统计
    getMonthStats() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        const monthEntries = this.entries.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate.getFullYear() === year && entryDate.getMonth() === month;
        });

        return {
            totalDays: monthEntries.length,
            moodDistribution: this.calculateMoodDistribution(monthEntries),
            streak: this.calculateCurrentStreak()
        };
    }

    // 计算心情分布
    calculateMoodDistribution(entries) {
        const distribution = {};

        entries.forEach(entry => {
            distribution[entry.mood] = (distribution[entry.mood] || 0) + 1;
        });

        return distribution;
    }

    // 计算当前连续记录天数
    calculateCurrentStreak() {
        let streak = 0;
        const today = new Date();

        for (let i = 0; i < 365; i++) {
            const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
            const dateStr = checkDate.toISOString().split('T')[0];

            if (this.findEntryByDate(dateStr)) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    }

    // 导出日历数据
    exportCalendarData() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth() + 1;

        const monthEntries = this.entries.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate.getFullYear() === year && entryDate.getMonth() === month - 1;
        });

        const exportData = {
            month: `${year}年${month}月`,
            entries: monthEntries,
            stats: this.getMonthStats()
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `心情日历_${year}_${month}.json`;
        link.click();
    }
}

// 初始化
const moodCalendar = new MoodCalendar();

// 添加日历动画效果
const style = document.createElement('style');
style.textContent = `
    .day-cell {
        transition: all 0.3s ease;
    }
    
    .day-cell:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    
    .day-cell.has-mood {
        animation: moodPulse 2s infinite;
    }
    
    @keyframes moodPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
    }
    
    .nav-btn {
        transition: all 0.3s ease;
    }
    
    .nav-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }
`;
document.head.appendChild(style); 