// 日程规划工具功能
class SchedulePlanner {
    constructor() {
        this.currentDate = new Date();
        this.events = [];
        this.templates = {
            productive: this.getProductiveTemplate(),
            balanced: this.getBalancedTemplate(),
            learning: this.getLearningTemplate(),
            creative: this.getCreativeTemplate()
        };

        this.loadData();
        this.initializeElements();
        this.bindEvents();
        this.renderTimeline();
        this.updateStats();
    }

    initializeElements() {
        this.currentDateElement = document.getElementById('currentDate');
        this.timelineElement = document.getElementById('timeline');
        this.quickAddForm = document.getElementById('quickAddForm');
        this.prevDayBtn = document.getElementById('prevDay');
        this.nextDayBtn = document.getElementById('nextDay');
    }

    bindEvents() {
        // 日期导航
        this.prevDayBtn.addEventListener('click', () => this.previousDay());
        this.nextDayBtn.addEventListener('click', () => this.nextDay());

        // 快速添加表单
        this.quickAddForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addQuickEvent();
        });
    }

    renderTimeline() {
        this.updateDateDisplay();

        const timeSlots = this.generateTimeSlots();
        const dayEvents = this.getEventsForDate(this.currentDate);

        this.timelineElement.innerHTML = timeSlots.map(slot => {
            const event = dayEvents.find(e => e.startTime === slot.time);

            if (event) {
                return this.renderEventSlot(slot.time, event);
            } else {
                return this.renderEmptySlot(slot.time);
            }
        }).join('');
    }

    generateTimeSlots() {
        const slots = [];
        for (let hour = 8; hour <= 22; hour += 2) {
            slots.push({
                time: `${hour.toString().padStart(2, '0')}:00`,
                hour: hour
            });
        }
        return slots;
    }

    renderEventSlot(time, event) {
        const typeClasses = {
            work: 'work',
            personal: 'personal',
            break: 'break',
            important: 'important'
        };

        return `
            <div class="time-slot">
                <div class="time-label">${time}</div>
                <div class="time-marker"></div>
                <div class="event-block ${typeClasses[event.type] || 'work'}" 
                     onclick="editEvent('${event.id}')">
                    <div class="event-title">${event.title}</div>
                    <div class="event-description">${event.description}</div>
                </div>
            </div>
        `;
    }

    renderEmptySlot(time) {
        return `
            <div class="time-slot">
                <div class="time-label">${time}</div>
                <div class="time-marker"></div>
                <div class="empty-slot" onclick="addEvent('${time}')">
                    + 点击添加事件
                </div>
            </div>
        `;
    }

    updateDateDisplay() {
        const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        const months = ['1月', '2月', '3月', '4月', '5月', '6月',
            '7月', '8月', '9月', '10月', '11月', '12月'];

        const year = this.currentDate.getFullYear();
        const month = months[this.currentDate.getMonth()];
        const day = this.currentDate.getDate();
        const weekday = weekdays[this.currentDate.getDay()];

        this.currentDateElement.textContent = `${year}年${month}${day}日 ${weekday}`;
    }

    addQuickEvent() {
        const title = document.getElementById('eventTitle').value.trim();
        const time = document.getElementById('eventTime').value;
        const type = document.getElementById('eventType').value;
        const description = document.getElementById('eventDescription').value.trim();

        if (!title || !time) {
            this.showNotification('请填写事件标题和时间', 'error');
            return;
        }

        const event = {
            id: Date.now().toString(),
            title: title,
            description: description,
            startTime: time,
            type: type,
            date: this.formatDate(this.currentDate),
            createdAt: new Date().toISOString()
        };

        this.events.push(event);
        this.saveData();
        this.renderTimeline();
        this.updateStats();
        this.quickAddForm.reset();

        this.showNotification('事件已添加到日程！');
    }

    applyTemplate(templateName) {
        const template = this.templates[templateName];
        if (!template) return;

        // 清除当天的事件
        this.events = this.events.filter(event =>
            event.date !== this.formatDate(this.currentDate)
        );

        // 添加模板事件
        template.forEach(templateEvent => {
            const event = {
                ...templateEvent,
                id: Date.now().toString() + Math.random(),
                date: this.formatDate(this.currentDate),
                createdAt: new Date().toISOString()
            };
            this.events.push(event);
        });

        this.saveData();
        this.renderTimeline();
        this.updateStats();

        this.showNotification(`已应用${this.getTemplateName(templateName)}模板！`);
    }

    getTemplateName(templateName) {
        const names = {
            productive: '高效工作日',
            balanced: '工作生活平衡',
            learning: '学习充电日',
            creative: '创意工作日'
        };
        return names[templateName] || templateName;
    }

    getProductiveTemplate() {
        return [
            { title: '晨间准备', description: '查看日程，准备工作', startTime: '08:00', type: 'personal' },
            { title: '核心工作', description: '处理重要任务', startTime: '09:00', type: 'work' },
            { title: '团队沟通', description: '团队会议或协作', startTime: '11:00', type: 'work' },
            { title: '午餐休息', description: '放松用餐', startTime: '12:00', type: 'break' },
            { title: '项目推进', description: '专注项目开发', startTime: '14:00', type: 'work' },
            { title: '邮件处理', description: '回复邮件，处理沟通', startTime: '16:00', type: 'work' },
            { title: '总结复盘', description: '总结今日工作', startTime: '18:00', type: 'personal' }
        ];
    }

    getBalancedTemplate() {
        return [
            { title: '晨间锻炼', description: '跑步或瑜伽', startTime: '08:00', type: 'personal' },
            { title: '工作时间', description: '专注工作任务', startTime: '10:00', type: 'work' },
            { title: '午餐时间', description: '健康用餐', startTime: '12:00', type: 'break' },
            { title: '下午工作', description: '处理工作事务', startTime: '14:00', type: 'work' },
            { title: '休息放松', description: '短暂休息', startTime: '16:00', type: 'break' },
            { title: '个人时间', description: '兴趣爱好或社交', startTime: '18:00', type: 'personal' },
            { title: '晚间阅读', description: '读书学习', startTime: '20:00', type: 'personal' }
        ];
    }

    getLearningTemplate() {
        return [
            { title: '晨间阅读', description: '技术文章或书籍', startTime: '08:00', type: 'personal' },
            { title: '在线课程', description: '专业技能学习', startTime: '10:00', type: 'personal' },
            { title: '午餐休息', description: '放松用餐', startTime: '12:00', type: 'break' },
            { title: '实践练习', description: '动手练习新技能', startTime: '14:00', type: 'work' },
            { title: '知识整理', description: '总结学习笔记', startTime: '16:00', type: 'personal' },
            { title: '技术交流', description: '参与社区讨论', startTime: '18:00', type: 'personal' },
            { title: '复习巩固', description: '回顾今日所学', startTime: '20:00', type: 'personal' }
        ];
    }

    getCreativeTemplate() {
        return [
            { title: '灵感收集', description: '浏览设计作品', startTime: '08:00', type: 'personal' },
            { title: '创意构思', description: '头脑风暴和设计', startTime: '10:00', type: 'work' },
            { title: '午餐时间', description: '户外散步激发灵感', startTime: '12:00', type: 'break' },
            { title: '原型制作', description: '制作设计原型', startTime: '14:00', type: 'work' },
            { title: '反馈收集', description: '获取他人意见', startTime: '16:00', type: 'work' },
            { title: '优化改进', description: '完善创意作品', startTime: '18:00', type: 'work' },
            { title: '作品展示', description: '分享创意成果', startTime: '20:00', type: 'personal' }
        ];
    }

    getEventsForDate(date) {
        const dateStr = this.formatDate(date);
        return this.events.filter(event => event.date === dateStr);
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    updateStats() {
        const dayEvents = this.getEventsForDate(this.currentDate);
        const workEvents = dayEvents.filter(e => e.type === 'work');
        const totalEvents = dayEvents.length;
        const workHours = workEvents.length * 2; // 假设每个时段2小时
        const freeSlots = 8 - totalEvents; // 8个时段减去已安排的
        const utilization = Math.round((totalEvents / 8) * 100);

        // 更新统计显示
        const miniStats = document.querySelectorAll('.mini-stat-value');
        if (miniStats.length >= 4) {
            miniStats[0].textContent = totalEvents;
            miniStats[1].textContent = workHours + 'h';
            miniStats[2].textContent = freeSlots * 2 + 'h';
            miniStats[3].textContent = utilization + '%';
        }
    }

    previousDay() {
        this.currentDate.setDate(this.currentDate.getDate() - 1);
        this.renderTimeline();
        this.updateStats();
    }

    nextDay() {
        this.currentDate.setDate(this.currentDate.getDate() + 1);
        this.renderTimeline();
        this.updateStats();
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        const bgColor = type === 'error' ? '#dc3545' : '#28a745';

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideInRight 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    loadData() {
        try {
            const savedEvents = localStorage.getItem('schedulePlannerEvents');
            if (savedEvents) {
                this.events = JSON.parse(savedEvents);
            }
        } catch (error) {
            console.error('Error loading schedule data:', error);
            this.events = [];
        }
    }

    saveData() {
        try {
            localStorage.setItem('schedulePlannerEvents', JSON.stringify(this.events));
        } catch (error) {
            console.error('Error saving schedule data:', error);
        }
    }
}

// 全局函数
function addEvent(time) {
    // 设置时间到表单中
    document.getElementById('eventTime').value = time;
    // 滚动到表单
    document.getElementById('quickAddForm').scrollIntoView({ behavior: 'smooth' });
    // 聚焦到标题输入框
    document.getElementById('eventTitle').focus();
}

function editEvent(eventId) {
    // 这里可以实现编辑事件的功能
    console.log('Edit event:', eventId);
}

function applyTemplate(templateName) {
    if (window.schedulePlanner) {
        window.schedulePlanner.applyTemplate(templateName);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function () {
    // 初始化日程规划器
    window.schedulePlanner = new SchedulePlanner();

    // 设置页面高亮
    highlightCurrentPage();

    // 初始化面包屑导航
    initBreadcrumb();
}); 