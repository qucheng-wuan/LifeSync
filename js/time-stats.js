// 时间统计分析功能
class TimeStatsManager {
    constructor() {
        this.currentPeriod = 'week';
        this.statsData = {
            today: { totalTime: 8.5, focusTime: 6.2, efficiency: 73, breakTime: 2.3 },
            week: { totalTime: 42.5, focusTime: 28.2, efficiency: 66, breakTime: 14.3 },
            month: { totalTime: 185.5, focusTime: 125.8, efficiency: 68, breakTime: 59.7 },
            year: { totalTime: 2156.8, focusTime: 1468.2, efficiency: 68, breakTime: 688.6 }
        };

        this.activityData = [
            { name: '工作项目', icon: '💼', time: 6.5, percentage: 38, color: '#667eea' },
            { name: '学习充电', icon: '📚', time: 3.2, percentage: 19, color: '#28a745' },
            { name: '运动健身', icon: '🏃', time: 2.1, percentage: 12, color: '#ffc107' },
            { name: '娱乐放松', icon: '🎮', time: 2.8, percentage: 16, color: '#dc3545' },
            { name: '其他事项', icon: '📋', time: 2.9, percentage: 15, color: '#6c757d' }
        ];

        this.weeklyData = [
            { day: '周一', workTime: 8.5, efficiency: 85, tasks: '6/8' },
            { day: '周二', workTime: 7.2, efficiency: 72, tasks: '4/6' },
            { day: '周三', workTime: 9.1, efficiency: 91, tasks: '8/9' },
            { day: '周四', workTime: 6.8, efficiency: 68, tasks: '5/7' },
            { day: '周五', workTime: 7.9, efficiency: 79, tasks: '6/8' },
            { day: '周六', workTime: 3.0, efficiency: 60, tasks: '2/4' },
            { day: '周日', workTime: 0, efficiency: 0, tasks: '0/0' }
        ];

        this.initializeElements();
        this.bindEvents();
        this.updateStats();
        this.renderCharts();
    }

    initializeElements() {
        this.totalTimeElement = document.getElementById('totalTime');
        this.focusTimeElement = document.getElementById('focusTime');
        this.efficiencyElement = document.getElementById('efficiency');
        this.breakTimeElement = document.getElementById('breakTime');
        this.timeChartElement = document.getElementById('timeChart');
    }

    bindEvents() {
        // 时间段选择器
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentPeriod = e.target.dataset.period;
                this.updateStats();
                this.renderCharts();
            });
        });
    }

    updateStats() {
        const data = this.statsData[this.currentPeriod];

        this.totalTimeElement.textContent = data.totalTime;
        this.focusTimeElement.textContent = data.focusTime;
        this.efficiencyElement.textContent = data.efficiency + '%';
        this.breakTimeElement.textContent = data.breakTime;

        // 添加动画效果
        this.animateCountUp(this.totalTimeElement, 0, data.totalTime, 1000);
        this.animateCountUp(this.focusTimeElement, 0, data.focusTime, 1200);
        this.animateCountUp(this.efficiencyElement, 0, data.efficiency, 1400, '%');
        this.animateCountUp(this.breakTimeElement, 0, data.breakTime, 1600);
    }

    animateCountUp(element, start, end, duration, suffix = '') {
        const startTime = performance.now();
        const isDecimal = end % 1 !== 0;

        const updateCount = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const current = start + (end - start) * this.easeOutCubic(progress);

            if (isDecimal) {
                element.textContent = current.toFixed(1) + suffix;
            } else {
                element.textContent = Math.floor(current) + suffix;
            }

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            }
        };

        requestAnimationFrame(updateCount);
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    renderCharts() {
        this.renderTimeChart();
        this.renderActivityChart();
        this.updateProgressBars();
    }

    renderTimeChart() {
        // 这里可以集成真实的图表库，现在显示模拟的图表
        this.timeChartElement.innerHTML = `
            <div style="display: flex; align-items: end; height: 250px; gap: 15px; padding: 20px;">
                ${this.weeklyData.map((day, index) => `
                    <div style="display: flex; flex-direction: column; align-items: center; flex: 1;">
                        <div style="background: linear-gradient(to top, #667eea, #764ba2); 
                                   height: ${(day.workTime / 10) * 100}%; 
                                   width: 100%; 
                                   border-radius: 4px 4px 0 0;
                                   margin-bottom: 10px;
                                   min-height: 20px;
                                   position: relative;
                                   transition: all 0.3s ease;
                                   cursor: pointer;"
                             onmouseover="this.style.transform='scale(1.05)'"
                             onmouseout="this.style.transform='scale(1)'">
                            <div style="position: absolute; top: -25px; left: 50%; transform: translateX(-50%);
                                       background: #333; color: white; padding: 4px 8px; border-radius: 4px;
                                       font-size: 12px; white-space: nowrap; opacity: 0; transition: opacity 0.3s;"
                                 class="tooltip">${day.workTime}h</div>
                        </div>
                        <div style="font-size: 12px; color: #666;">${day.day}</div>
                    </div>
                `).join('')}
            </div>
            <div style="text-align: center; margin-top: 10px; color: #666; font-size: 14px;">
                每日工作时间分布 (小时)
            </div>
        `;

        // 添加悬停效果
        this.timeChartElement.querySelectorAll('[onmouseover]').forEach(bar => {
            bar.addEventListener('mouseenter', function () {
                this.querySelector('.tooltip').style.opacity = '1';
            });
            bar.addEventListener('mouseleave', function () {
                this.querySelector('.tooltip').style.opacity = '0';
            });
        });
    }

    renderActivityChart() {
        // 渲染活动类型分布的饼图模拟
        const total = this.activityData.reduce((sum, item) => sum + item.time, 0);
        let currentAngle = 0;

        const chartContainer = document.querySelector('.activity-list').parentElement;

        // 如果还没有饼图容器，创建一个
        if (!chartContainer.querySelector('.pie-chart')) {
            const pieChart = document.createElement('div');
            pieChart.className = 'pie-chart';
            pieChart.style.cssText = `
                width: 200px;
                height: 200px;
                border-radius: 50%;
                margin: 20px auto;
                position: relative;
                background: conic-gradient(
                    ${this.activityData.map(item => {
                const angle = (item.time / total) * 360;
                const color = item.color;
                const start = currentAngle;
                currentAngle += angle;
                return `${color} ${start}deg ${currentAngle}deg`;
            }).join(', ')}
                );
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            `;
            chartContainer.insertBefore(pieChart, chartContainer.querySelector('.activity-list'));
        }
    }

    updateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach((bar, index) => {
            const targetWidth = bar.style.width;
            bar.style.width = '0%';

            setTimeout(() => {
                bar.style.width = targetWidth;
            }, 200 + index * 100);
        });
    }

    generateInsights() {
        const insights = [
            {
                icon: '🎯',
                title: '效率最高时段',
                description: '您在上午9-11点的工作效率最高，平均效率达到92%。建议将重要任务安排在此时段完成。'
            },
            {
                icon: '⚠️',
                title: '分心时段分析',
                description: '下午2-4点是您容易分心的时段，建议安排轻松的任务或适当休息，避免重要工作安排在此时。'
            },
            {
                icon: '📈',
                title: '周期性模式',
                description: '您的工作效率呈现明显的周期性：周一、周三效率较高，周二、周四相对较低。建议合理调配任务难度。'
            },
            {
                icon: '💡',
                title: '优化建议',
                description: '建议增加番茄钟使用频率，现有数据显示使用番茄钟时的专注度比平时高35%。'
            }
        ];

        return insights;
    }

    exportData() {
        const exportData = {
            period: this.currentPeriod,
            stats: this.statsData[this.currentPeriod],
            activities: this.activityData,
            weeklyData: this.weeklyData,
            exportDate: new Date().toISOString(),
            insights: this.generateInsights()
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `time-stats-${this.currentPeriod}-${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        this.showNotification('数据导出成功！');
    }

    showNotification(message) {
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

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// 全局函数
function exportTimeStats() {
    if (window.timeStatsManager) {
        window.timeStatsManager.exportData();
    }
}

function refreshStats() {
    if (window.timeStatsManager) {
        window.timeStatsManager.updateStats();
        window.timeStatsManager.renderCharts();
        window.timeStatsManager.showNotification('数据已刷新！');
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function () {
    // 初始化时间统计管理器
    window.timeStatsManager = new TimeStatsManager();

    // 设置页面高亮
    highlightCurrentPage();

    // 初始化面包屑导航
    initBreadcrumb();

    // 添加导出按钮（如果页面有的话）
    const exportBtn = document.getElementById('exportStatsBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportTimeStats);
    }

    // 添加刷新按钮（如果页面有的话）
    const refreshBtn = document.getElementById('refreshStatsBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshStats);
    }
}); 