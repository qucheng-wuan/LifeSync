// 日历日程管理功能
class CalendarManager {
    constructor() {
        this.currentDate = new Date();
        this.events = [];
        this.selectedDate = null;

        this.loadEvents();
        this.initializeElements();
        this.bindEvents();
        this.renderCalendar();
        this.renderTodayEvents();
    }

    initializeElements() {
        this.calendarGrid = document.getElementById('calendarGrid');
        this.currentMonthElement = document.getElementById('currentMonth');
        this.prevMonthBtn = document.getElementById('prevMonth');
        this.nextMonthBtn = document.getElementById('nextMonth');
        this.todayBtn = document.getElementById('todayBtn');
        this.eventForm = document.getElementById('eventForm');
        this.todayEventsContainer = document.getElementById('todayEvents');
    }

    bindEvents() {
        // 导航按钮事件
        this.prevMonthBtn.addEventListener('click', () => this.previousMonth());
        this.nextMonthBtn.addEventListener('click', () => this.nextMonth());
        this.todayBtn.addEventListener('click', () => this.goToToday());

        // 事件表单提交
        this.eventForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addEvent();
        });
    }

    renderCalendar() {
        // 更新月份显示
        const monthNames = [
            '1月', '2月', '3月', '4月', '5月', '6月',
            '7月', '8月', '9月', '10月', '11月', '12月'
        ];
        this.currentMonthElement.textContent =
            `${this.currentDate.getFullYear()}年${monthNames[this.currentDate.getMonth()]}`;

        // 清除现有日期单元格（保留表头）
        const cells = this.calendarGrid.querySelectorAll('.calendar-cell');
        cells.forEach(cell => cell.remove());

        // 获取当月第一天和最后一天
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);

        // 获取第一天是星期几（0=周日，1=周一...）
        const startDay = firstDay.getDay();

        // 获取上个月的最后几天
        const prevMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 0);
        const prevMonthDays = prevMonth.getDate();

        // 渲染上个月的日期
        for (let i = startDay - 1; i >= 0; i--) {
            const day = prevMonthDays - i;
            const cell = this.createDateCell(day, true);
            this.calendarGrid.appendChild(cell);
        }

        // 渲染当月日期
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const cell = this.createDateCell(day, false);

            // 检查是否是今天
            const today = new Date();
            if (this.currentDate.getFullYear() === today.getFullYear() &&
                this.currentDate.getMonth() === today.getMonth() &&
                day === today.getDate()) {
                cell.classList.add('today');
            }

            this.calendarGrid.appendChild(cell);
        }

        // 计算需要填充的下个月日期数量
        const totalCells = this.calendarGrid.children.length - 7; // 减去表头
        const remainingCells = 42 - totalCells; // 6行 x 7列 = 42个单元格

        // 渲染下个月的日期
        for (let day = 1; day <= remainingCells; day++) {
            const cell = this.createDateCell(day, true);
            this.calendarGrid.appendChild(cell);
        }
    }

    createDateCell(day, isOtherMonth) {
        const cell = document.createElement('div');
        cell.className = `calendar-cell ${isOtherMonth ? 'other-month' : ''}`;

        const dateNumber = document.createElement('div');
        dateNumber.className = 'date-number';
        dateNumber.textContent = day;
        cell.appendChild(dateNumber);

        // 如果不是其他月份的日期，添加点击事件和事件显示
        if (!isOtherMonth) {
            cell.addEventListener('click', () => this.selectDate(day));

            // 显示当天的事件
            const dayEvents = this.getEventsForDate(
                this.currentDate.getFullYear(),
                this.currentDate.getMonth(),
                day
            );

            dayEvents.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.className = 'event-item';
                eventElement.textContent = event.title;
                eventElement.style.background = this.getEventColor(event.category);
                cell.appendChild(eventElement);
            });
        }

        return cell;
    }

    selectDate(day) {
        // 移除之前的选中状态
        document.querySelectorAll('.calendar-cell.selected').forEach(cell => {
            cell.classList.remove('selected');
        });

        // 添加新的选中状态
        event.currentTarget.classList.add('selected');

        // 设置选中日期
        this.selectedDate = new Date(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth(),
            day
        );

        // 更新表单中的日期
        const dateInput = document.getElementById('eventDate');
        if (dateInput) {
            dateInput.value = this.formatDateForInput(this.selectedDate);
        }
    }

    formatDateForInput(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    getEventsForDate(year, month, day) {
        return this.events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getFullYear() === year &&
                eventDate.getMonth() === month &&
                eventDate.getDate() === day;
        });
    }

    getEventColor(category) {
        const colors = {
            work: '#667eea',
            personal: '#28a745',
            important: '#ff6b6b',
            reminder: '#ffc107'
        };
        return colors[category] || '#667eea';
    }

    addEvent() {
        const title = document.getElementById('eventTitle').value.trim();
        const date = document.getElementById('eventDate').value;
        const time = document.getElementById('eventTime').value;
        const description = document.getElementById('eventDescription').value.trim();

        if (!title || !date) {
            alert('请填写事件标题和日期');
            return;
        }

        const event = {
            id: Date.now(),
            title: title,
            date: date,
            time: time,
            description: description,
            category: 'work', // 默认类别
            createdAt: new Date().toISOString()
        };

        this.events.push(event);
        this.saveEvents();
        this.renderCalendar();
        this.renderTodayEvents();

        // 清空表单
        this.eventForm.reset();

        // 显示成功消息
        this.showNotification('事件已成功添加！');
    }

    renderTodayEvents() {
        const today = new Date();
        const todayEvents = this.getEventsForDate(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );

        if (todayEvents.length === 0) {
            this.todayEventsContainer.innerHTML = `
                <div style="text-align: center; color: #666; padding: 2rem;">
                    今天暂无安排
                </div>
            `;
            return;
        }

        this.todayEventsContainer.innerHTML = '';

        todayEvents.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = 'event-list-item';
            eventElement.innerHTML = `
                <div><strong>${event.time || '全天'}</strong> - ${event.title}</div>
                <div>${event.description || ''}</div>
            `;
            this.todayEventsContainer.appendChild(eventElement);
        });
    }

    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.renderCalendar();
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.renderCalendar();
    }

    goToToday() {
        this.currentDate = new Date();
        this.renderCalendar();
    }

    showNotification(message) {
        // 创建临时通知元素
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideInRight 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // 3秒后自动移除
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    loadEvents() {
        try {
            const savedEvents = localStorage.getItem('calendarEvents');
            if (savedEvents) {
                this.events = JSON.parse(savedEvents);
            }
        } catch (error) {
            console.error('Error loading calendar events:', error);
            this.events = [];
        }
    }

    saveEvents() {
        try {
            localStorage.setItem('calendarEvents', JSON.stringify(this.events));
        } catch (error) {
            console.error('Error saving calendar events:', error);
        }
    }
}

// 快速添加事件函数
function quickAddEvent() {
    const input = document.getElementById('quickEventInput');
    const text = input.value.trim();

    if (!text) return;

    // 简单解析自然语言（这里只是示例，实际可以更复杂）
    const today = new Date();
    const event = {
        id: Date.now(),
        title: text,
        date: today.toISOString().split('T')[0],
        time: '',
        description: '',
        category: 'personal',
        createdAt: new Date().toISOString()
    };

    if (window.calendarManager) {
        window.calendarManager.events.push(event);
        window.calendarManager.saveEvents();
        window.calendarManager.renderCalendar();
        window.calendarManager.renderTodayEvents();
        window.calendarManager.showNotification('快速事件已添加！');
    }

    input.value = '';
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function () {
    // 初始化日历管理器
    window.calendarManager = new CalendarManager();

    // 设置页面高亮
    highlightCurrentPage();

    // 初始化面包屑导航
    initBreadcrumb();

    // 设置今天的日期为默认值
    const todayInput = document.getElementById('eventDate');
    if (todayInput) {
        const today = new Date();
        todayInput.value = today.toISOString().split('T')[0];
    }
});

// 添加CSS动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style); 