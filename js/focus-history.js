// 专注历史记录管理功能
class FocusHistoryManager {
    constructor() {
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.focusRecords = this.loadRecords();

        this.initializeElements();
        this.bindEvents();
        this.updateStats();
        this.renderRecords();
    }

    initializeElements() {
        this.recordsList = document.getElementById('recordsList');
        this.searchInput = document.getElementById('searchInput');
        this.filterBtns = document.querySelectorAll('.filter-btn');
    }

    bindEvents() {
        // 筛选按钮事件
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.renderRecords();
            });
        });

        // 搜索功能
        this.searchInput.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase().trim();
            this.renderRecords();
        });

        // 实时搜索防抖
        let searchTimeout;
        this.searchInput.addEventListener('keyup', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.renderRecords();
            }, 300);
        });
    }

    loadRecords() {
        // 从localStorage加载或使用默认数据
        try {
            const saved = localStorage.getItem('focusRecords');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.error('Error loading focus records:', error);
        }

        // 默认示例数据
        return [
            {
                id: 1,
                task: '代码重构 - 用户管理模块',
                description: '优化用户登录流程，提升代码可读性',
                duration: 25,
                score: 95,
                type: 'pomodoro',
                date: new Date().toISOString(),
                timeOfDay: '14:30'
            },
            {
                id: 2,
                task: '技术文档编写',
                description: '编写API接口说明文档',
                duration: 45,
                score: 88,
                type: 'deep',
                date: new Date().toISOString(),
                timeOfDay: '10:15'
            },
            {
                id: 3,
                task: '深度学习 - React Hooks',
                description: '学习useCallback和useMemo的使用场景',
                duration: 90,
                score: 92,
                type: 'deep',
                date: new Date(Date.now() - 86400000).toISOString(),
                timeOfDay: '16:20'
            },
            {
                id: 4,
                task: '晨间阅读',
                description: '阅读《深度工作》第三章',
                duration: 25,
                score: 85,
                type: 'pomodoro',
                date: new Date(Date.now() - 86400000).toISOString(),
                timeOfDay: '09:00'
            },
            {
                id: 5,
                task: '项目会议准备',
                description: '整理需求文档，准备演示材料',
                duration: 50,
                score: 78,
                type: 'deep',
                date: new Date(Date.now() - 172800000).toISOString(),
                timeOfDay: '15:45'
            },
            {
                id: 6,
                task: '算法练习',
                description: 'LeetCode刷题 - 动态规划专题',
                duration: 135,
                score: 96,
                type: 'deep',
                date: new Date(Date.now() - 172800000).toISOString(),
                timeOfDay: '11:30'
            }
        ];
    }

    saveRecords() {
        try {
            localStorage.setItem('focusRecords', JSON.stringify(this.focusRecords));
        } catch (error) {
            console.error('Error saving focus records:', error);
        }
    }

    addRecord(recordData) {
        const record = {
            id: Date.now(),
            ...recordData,
            date: new Date().toISOString()
        };

        this.focusRecords.unshift(record);
        this.saveRecords();
        this.updateStats();
        this.renderRecords();
    }

    updateStats() {
        const stats = this.calculateStats();

        // 更新统计卡片
        const statCards = document.querySelectorAll('.stat-value');
        if (statCards.length >= 5) {
            statCards[0].textContent = stats.totalSessions;
            statCards[1].textContent = stats.totalHours + 'h';
            statCards[2].textContent = stats.streakDays;
            statCards[3].textContent = stats.averageScore + '%';
            statCards[4].textContent = stats.longestSession;
        }
    }

    calculateStats() {
        const total = this.focusRecords.length;
        const totalMinutes = this.focusRecords.reduce((sum, record) => sum + record.duration, 0);
        const totalHours = (totalMinutes / 60).toFixed(1);

        const averageScore = total > 0
            ? Math.round(this.focusRecords.reduce((sum, record) => sum + record.score, 0) / total)
            : 0;

        const longestSession = Math.max(...this.focusRecords.map(r => r.duration), 0);
        const longestHours = (longestSession / 60).toFixed(1);

        // 计算连续专注天数
        const streakDays = this.calculateStreak();

        return {
            totalSessions: total,
            totalHours: totalHours,
            streakDays: streakDays,
            averageScore: averageScore,
            longestSession: longestHours + 'h'
        };
    }

    calculateStreak() {
        if (this.focusRecords.length === 0) return 0;

        const uniqueDates = [...new Set(this.focusRecords.map(record =>
            new Date(record.date).toDateString()
        ))].sort((a, b) => new Date(b) - new Date(a));

        let streak = 0;
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        for (let i = 0; i < uniqueDates.length; i++) {
            const currentDate = uniqueDates[i];
            const expectedDate = new Date(Date.now() - i * 86400000).toDateString();

            if (currentDate === expectedDate) {
                streak++;
            } else if (i === 0 && currentDate === yesterday) {
                // 如果今天没有记录但昨天有，继续计算
                streak++;
            } else {
                break;
            }
        }

        return streak;
    }

    filterRecords() {
        let filtered = [...this.focusRecords];

        // 按筛选条件过滤
        if (this.currentFilter !== 'all') {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

            filtered = filtered.filter(record => {
                const recordDate = new Date(record.date);

                switch (this.currentFilter) {
                    case 'today':
                        return recordDate >= today;
                    case 'week':
                        return recordDate >= weekAgo;
                    case 'month':
                        return recordDate >= monthAgo;
                    case 'pomodoro':
                        return record.type === 'pomodoro';
                    case 'deep':
                        return record.type === 'deep';
                    default:
                        return true;
                }
            });
        }

        // 按搜索词过滤
        if (this.searchTerm) {
            filtered = filtered.filter(record =>
                record.task.toLowerCase().includes(this.searchTerm) ||
                record.description.toLowerCase().includes(this.searchTerm)
            );
        }

        return filtered;
    }

    renderRecords() {
        const filteredRecords = this.filterRecords();

        if (filteredRecords.length === 0) {
            this.recordsList.innerHTML = `
                <div class="empty-state">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
                    <h3>暂无匹配的记录</h3>
                    <p>尝试调整筛选条件或搜索关键词</p>
                </div>
            `;
            return;
        }

        this.recordsList.innerHTML = filteredRecords.map(record => {
            const date = new Date(record.date);
            const timeAgo = this.getTimeAgo(date);
            const durationText = this.formatDuration(record.duration);

            return `
                <div class="record-item" data-id="${record.id}">
                    <div class="record-time">${timeAgo} ${record.timeOfDay}</div>
                    <div class="record-duration">${durationText}</div>
                    <div class="record-details">
                        <div class="record-task">${record.task}</div>
                        <div class="record-description">${record.description}</div>
                    </div>
                    <div class="record-score">
                        <div class="score-value">${record.score}%</div>
                        <div>专注度</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    getTimeAgo(date) {
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return '今天';
        if (diffDays === 1) return '昨天';
        if (diffDays === 2) return '前天';
        if (diffDays < 7) return `${diffDays}天前`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
        return `${Math.floor(diffDays / 30)}月前`;
    }

    formatDuration(minutes) {
        if (minutes < 60) {
            return `${minutes}min`;
        } else {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
        }
    }

    exportRecords() {
        const filteredRecords = this.filterRecords();
        const exportData = {
            records: filteredRecords,
            stats: this.calculateStats(),
            exportDate: new Date().toISOString(),
            filter: this.currentFilter,
            searchTerm: this.searchTerm
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `focus-history-${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        this.showNotification('专注记录导出成功！');
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
function exportFocusHistory() {
    if (window.focusHistoryManager) {
        window.focusHistoryManager.exportRecords();
    }
}

function addFocusRecord(taskName, duration, score) {
    if (window.focusHistoryManager) {
        const record = {
            task: taskName,
            description: '手动添加的专注记录',
            duration: duration,
            score: score,
            type: duration <= 30 ? 'pomodoro' : 'deep',
            timeOfDay: new Date().toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        window.focusHistoryManager.addRecord(record);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function () {
    // 初始化专注历史管理器
    window.focusHistoryManager = new FocusHistoryManager();

    // 设置页面高亮
    highlightCurrentPage();

    // 初始化面包屑导航
    initBreadcrumb();

    // 添加导出按钮事件（如果存在）
    const exportBtn = document.getElementById('exportHistoryBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportFocusHistory);
    }
}); 