// 心情趋势报告功能
class MoodTrends {
    constructor() {
        this.entries = this.loadEntries();
        this.currentStartDate = '2024-01-01';
        this.currentEndDate = '2024-01-31';
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
        this.updateTimeline();
        this.generateReport();
        this.initDateInputs();
    }

    // 加载心情记录
    loadEntries() {
        const defaultEntries = [
            { date: '2024-01-15', mood: 'happy', title: '愉快的一天', tags: ['朋友', '聚会'] },
            { date: '2024-01-14', mood: 'calm', title: '平静思考', tags: ['阅读', '思考'] },
            { date: '2024-01-13', mood: 'excited', title: '兴奋的聚会', tags: ['聚会', '音乐'] },
            { date: '2024-01-12', mood: 'happy', title: '工作顺利', tags: ['工作', '成就'] },
            { date: '2024-01-11', mood: 'tired', title: '有点疲惫', tags: ['工作', '疲劳'] },
            { date: '2024-01-10', mood: 'calm', title: '放松的晚上', tags: ['家庭', '放松'] },
            { date: '2024-01-09', mood: 'happy', title: '开心购物', tags: ['购物', '朋友'] },
            { date: '2024-01-08', mood: 'sad', title: '有些难过', tags: ['工作', '压力'] },
            { date: '2024-01-07', mood: 'excited', title: '周末开始', tags: ['周末', '期待'] },
            { date: '2024-01-06', mood: 'tired', title: '工作劳累', tags: ['工作', 'deadline'] },
            { date: '2024-01-05', mood: 'happy', title: '完成项目', tags: ['工作', '成就'] },
            { date: '2024-01-04', mood: 'calm', title: '安静学习', tags: ['学习', '专注'] },
            { date: '2024-01-03', mood: 'anxious', title: '考试压力', tags: ['学习', '压力'] },
            { date: '2024-01-02', mood: 'happy', title: '新年快乐', tags: ['节日', '家庭'] },
            { date: '2024-01-01', mood: 'excited', title: '新的开始', tags: ['新年', '计划'] }
        ];

        return JSON.parse(localStorage.getItem('moodEntries')) || defaultEntries;
    }

    // 绑定事件
    bindEvents() {
        // 更新报告按钮
        document.getElementById('updateReport')?.addEventListener('click', () => {
            this.updateDateRange();
            this.generateReport();
            this.updateTimeline();
        });

        // 导出PDF
        document.getElementById('exportPDF')?.addEventListener('click', () => {
            this.exportToPDF();
        });

        // 导出CSV
        document.getElementById('exportCSV')?.addEventListener('click', () => {
            this.exportToCSV();
        });
    }

    // 初始化日期输入
    initDateInputs() {
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');

        if (startDateInput) {
            startDateInput.value = this.currentStartDate;
        }
        if (endDateInput) {
            endDateInput.value = this.currentEndDate;
        }
    }

    // 更新日期范围
    updateDateRange() {
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');

        if (startDateInput && endDateInput) {
            this.currentStartDate = startDateInput.value;
            this.currentEndDate = endDateInput.value;
        }
    }

    // 获取日期范围内的记录
    getEntriesInRange() {
        return this.entries.filter(entry => {
            const entryDate = new Date(entry.date);
            const startDate = new Date(this.currentStartDate);
            const endDate = new Date(this.currentEndDate);
            return entryDate >= startDate && entryDate <= endDate;
        });
    }

    // 生成报告
    generateReport() {
        const rangeEntries = this.getEntriesInRange();

        // 更新统计卡片
        this.updateStatCards(rangeEntries);

        // 分析影响因素
        this.analyzeCorrelations(rangeEntries);

        // 分析周期性模式
        this.analyzePatterns(rangeEntries);

        // 生成关键洞察
        this.generateInsights(rangeEntries);
    }

    // 更新统计卡片
    updateStatCards(entries) {
        const avgMood = this.calculateAverageMood(entries);
        const improvement = this.calculateImprovement(entries);
        const stability = this.calculateStability(entries);
        const positiveRatio = this.calculatePositiveRatio(entries);

        // 更新显示（实际项目中应该更新DOM）
        console.log('统计数据:', {
            平均心情指数: avgMood,
            较上月改善: improvement + '%',
            情绪稳定度: stability + '%',
            积极情绪占比: positiveRatio + '%'
        });
    }

    // 计算平均心情
    calculateAverageMood(entries) {
        if (entries.length === 0) return 0;

        const moodScores = {
            sad: 2,
            anxious: 3,
            tired: 4,
            calm: 6,
            happy: 8,
            excited: 10
        };

        const total = entries.reduce((sum, entry) => {
            return sum + (moodScores[entry.mood] || 5);
        }, 0);

        return (total / entries.length).toFixed(1);
    }

    // 计算改善程度
    calculateImprovement(entries) {
        // 模拟计算（实际应该与历史数据比较）
        return Math.floor(Math.random() * 20) + 5;
    }

    // 计算情绪稳定度
    calculateStability(entries) {
        if (entries.length < 2) return 100;

        const moodScores = {
            sad: 2, anxious: 3, tired: 4,
            calm: 6, happy: 8, excited: 10
        };

        const scores = entries.map(entry => moodScores[entry.mood] || 5);
        const variance = this.calculateVariance(scores);

        // 稳定度与方差成反比
        return Math.max(0, Math.min(100, 100 - variance * 10));
    }

    // 计算方差
    calculateVariance(values) {
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
        return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
    }

    // 计算积极情绪占比
    calculatePositiveRatio(entries) {
        if (entries.length === 0) return 0;

        const positiveCount = entries.filter(entry =>
            ['happy', 'excited', 'calm'].includes(entry.mood)
        ).length;

        return Math.round((positiveCount / entries.length) * 100);
    }

    // 分析相关性
    analyzeCorrelations(entries) {
        const correlations = this.calculateFactorCorrelations(entries);
        console.log('影响因素分析:', correlations);
    }

    // 计算因素相关性
    calculateFactorCorrelations(entries) {
        const factors = {};
        const moodScores = {
            sad: 2, anxious: 3, tired: 4,
            calm: 6, happy: 8, excited: 10
        };

        // 统计标签与心情的关联
        entries.forEach(entry => {
            const moodScore = moodScores[entry.mood] || 5;

            if (entry.tags) {
                entry.tags.forEach(tag => {
                    if (!factors[tag]) {
                        factors[tag] = { scores: [], count: 0 };
                    }
                    factors[tag].scores.push(moodScore);
                    factors[tag].count++;
                });
            }
        });

        // 计算每个因素的平均影响
        const correlations = [];
        Object.keys(factors).forEach(factor => {
            const avgScore = factors[factor].scores.reduce((sum, score) => sum + score, 0) / factors[factor].scores.length;
            const correlation = (avgScore - 6) / 4; // 标准化到-1到1之间

            correlations.push({
                factor: factor,
                correlation: correlation.toFixed(2),
                count: factors[factor].count
            });
        });

        return correlations.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
    }

    // 分析模式
    analyzePatterns(entries) {
        const weekdayPatterns = this.analyzeWeekdayPatterns(entries);
        console.log('周期性模式:', weekdayPatterns);
    }

    // 分析工作日模式
    analyzeWeekdayPatterns(entries) {
        const weekdayMoods = {};
        const moodScores = {
            sad: 2, anxious: 3, tired: 4,
            calm: 6, happy: 8, excited: 10
        };

        entries.forEach(entry => {
            const date = new Date(entry.date);
            const weekday = date.getDay();
            const moodScore = moodScores[entry.mood] || 5;

            if (!weekdayMoods[weekday]) {
                weekdayMoods[weekday] = [];
            }
            weekdayMoods[weekday].push(moodScore);
        });

        const patterns = {};
        const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

        Object.keys(weekdayMoods).forEach(day => {
            const scores = weekdayMoods[day];
            const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
            patterns[weekdays[day]] = avgScore.toFixed(1);
        });

        return patterns;
    }

    // 生成洞察
    generateInsights(entries) {
        const insights = [];

        // 记录天数洞察
        insights.push(`连续记录${entries.length}天，养成了良好的自我觉察习惯`);

        // 积极情绪洞察
        const positiveRatio = this.calculatePositiveRatio(entries);
        if (positiveRatio > 70) {
            insights.push(`积极情绪比例${positiveRatio}%，心理健康状态良好`);
        }

        // 稳定性洞察
        const stability = this.calculateStability(entries);
        if (stability > 80) {
            insights.push('情绪稳定性很高，抗压能力强');
        }

        console.log('关键洞察:', insights);
        return insights;
    }

    // 更新时间线
    updateTimeline() {
        const timeline = document.getElementById('moodTimeline');
        if (!timeline) return;

        const recentEntries = this.getEntriesInRange()
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 14);

        timeline.innerHTML = recentEntries.map(entry => {
            const date = new Date(entry.date);
            const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
            const emoji = this.moodEmojis[entry.mood] || '😐';

            return `
                <div class="timeline-day">
                    <div class="timeline-date">${dateStr}</div>
                    <div class="timeline-mood">${emoji}</div>
                </div>
            `;
        }).join('');
    }

    // 导出PDF
    exportToPDF() {
        // 实际项目中使用jsPDF或类似库
        alert('PDF导出功能将生成包含图表和分析的详细报告');

        // 模拟导出过程
        const reportData = {
            period: `${this.currentStartDate} 至 ${this.currentEndDate}`,
            entries: this.getEntriesInRange(),
            statistics: {
                avgMood: this.calculateAverageMood(this.getEntriesInRange()),
                positiveRatio: this.calculatePositiveRatio(this.getEntriesInRange()),
                stability: this.calculateStability(this.getEntriesInRange())
            }
        };

        console.log('PDF报告数据:', reportData);
    }

    // 导出CSV
    exportToCSV() {
        const entries = this.getEntriesInRange();

        // 创建CSV内容
        const csvContent = [
            ['日期', '心情', '标题', '标签'],
            ...entries.map(entry => [
                entry.date,
                entry.mood,
                entry.title || '',
                (entry.tags || []).join(';')
            ])
        ].map(row => row.join(',')).join('\n');

        // 创建下载链接
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `mood_trends_${this.currentStartDate}_${this.currentEndDate}.csv`;
        link.click();

        // 显示成功消息
        this.showNotification('数据已导出为CSV文件', 'success');
    }

    // 显示通知
    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : '#17a2b8'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // 3秒后自动移除
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // 数据更新方法
    refreshData() {
        this.entries = this.loadEntries();
        this.generateReport();
        this.updateTimeline();
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.moodTrends = new MoodTrends();
});

// 添加CSS动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style); 