// 增强版情绪分析功能
class MoodAnalysis {
    constructor() {
        this.entries = this.loadMoodData();
        this.currentPeriod = 'month';
        this.filteredEntries = [];
        this.moodMap = this.initializeMoodMap();
        this.weatherMap = this.initializeWeatherMap();
        this.init();
    }

    // 初始化心情映射
    initializeMoodMap() {
        return {
            happy: { emoji: '😊', label: '开心', color: '#10ac84', intensity: 8, category: 'positive' },
            excited: { emoji: '🤩', label: '兴奋', color: '#ff6b6b', intensity: 9, category: 'positive' },
            calm: { emoji: '😌', label: '平静', color: '#74b9ff', intensity: 7, category: 'positive' },
            grateful: { emoji: '🙏', label: '感恩', color: '#a29bfe', intensity: 8, category: 'positive' },
            love: { emoji: '🥰', label: '幸福', color: '#fd79a8', intensity: 9, category: 'positive' },
            tired: { emoji: '😴', label: '疲惫', color: '#636e72', intensity: 4, category: 'neutral' },
            anxious: { emoji: '😰', label: '焦虑', color: '#fdcb6e', intensity: 3, category: 'negative' },
            sad: { emoji: '😢', label: '难过', color: '#e17055', intensity: 2, category: 'negative' },
            angry: { emoji: '😠', label: '愤怒', color: '#e84393', intensity: 2, category: 'negative' },
            confused: { emoji: '😕', label: '困惑', color: '#636e72', intensity: 4, category: 'neutral' }
        };
    }

    // 初始化天气映射
    initializeWeatherMap() {
        return {
            sunny: { emoji: '☀️', label: '晴朗', impact: 1.2 },
            cloudy: { emoji: '☁️', label: '多云', impact: 1.0 },
            rainy: { emoji: '🌧️', label: '雨天', impact: 0.8 },
            snowy: { emoji: '❄️', label: '雪天', impact: 0.9 }
        };
    }

    init() {
        this.bindEvents();
        this.updateAnalysisPeriod();
        this.filterDataByPeriod();
        this.renderAnalysis();
        this.addScrollAnimations();
    }

    // 绑定事件
    bindEvents() {
        // 筛选标签点击
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchPeriod(tab.dataset.period);
            });
        });

        // 自定义日期范围
        const customTab = document.querySelector('[data-period="custom"]');
        if (customTab) {
            customTab.addEventListener('click', () => {
                this.toggleCustomDateRange();
            });
        }

        // 全局函数绑定
        window.applyCustomRange = () => this.applyCustomRange();
        window.exportAnalysisReport = (type) => this.exportReport(type);
        window.shareAnalysis = () => this.shareAnalysis();
    }

    // 加载心情数据
    loadMoodData() {
        // 先尝试从心情记录模块获取数据
        const moodEntries = JSON.parse(localStorage.getItem('moodEntries')) || [];

        // 如果没有数据，生成示例数据
        if (moodEntries.length === 0) {
            return this.generateSampleData();
        }

        return moodEntries;
    }

    // 生成示例数据
    generateSampleData() {
        const sampleData = [];
        const moods = Object.keys(this.moodMap);
        const tags = ['工作', '学习', '家庭', '朋友', '运动', '休息', '旅行', '美食', '电影', '音乐'];
        const weathers = Object.keys(this.weatherMap);

        // 生成最近90天的数据
        for (let i = 0; i < 90; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            // 随机决定是否有记录（70%概率）
            if (Math.random() > 0.3) {
                const mood = moods[Math.floor(Math.random() * moods.length)];
                const weather = weathers[Math.floor(Math.random() * weathers.length)];
                const selectedTags = this.getRandomTags(tags, Math.floor(Math.random() * 4) + 1);

                sampleData.push({
                    id: `sample_${i}`,
                    date: dateStr,
                    mood: mood,
                    title: this.generateRandomTitle(mood),
                    content: '示例心情记录内容...',
                    tags: selectedTags,
                    weather: weather,
                    intensity: Math.floor(Math.random() * 5) + 1,
                    timestamp: date.toISOString()
                });
            }
        }

        return sampleData.reverse(); // 按时间正序排列
    }

    // 获取随机标签
    getRandomTags(tags, count) {
        const shuffled = [...tags].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    // 生成随机标题
    generateRandomTitle(mood) {
        const titles = {
            happy: ['美好的一天', '心情愉悦', '阳光明媚', '开心时刻'],
            excited: ['激动人心', '充满活力', '兴奋不已', '精神饱满'],
            calm: ['内心平静', '安静时光', '宁静致远', '心如止水'],
            grateful: ['感恩时刻', '心怀感激', '满怀感谢', '珍惜拥有'],
            love: ['幸福满满', '爱意浓浓', '温暖如春', '甜蜜时光'],
            tired: ['有些疲惫', '需要休息', '身心俱疲', '略感劳累'],
            anxious: ['内心焦虑', '有些担心', '忧虑重重', '心神不宁'],
            sad: ['心情低落', '有些难过', '情绪低迷', '心情不佳'],
            angry: ['感到愤怒', '心情烦躁', '怒火中烧', '情绪激动'],
            confused: ['内心困惑', '思绪混乱', '不知所措', '迷茫困顿']
        };

        const moodTitles = titles[mood] || ['今日心情'];
        return moodTitles[Math.floor(Math.random() * moodTitles.length)];
    }

    // 切换时间周期
    switchPeriod(period) {
        // 更新活动状态
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-period="${period}"]`).classList.add('active');

        this.currentPeriod = period;

        // 隐藏自定义日期范围
        if (period !== 'custom') {
            document.getElementById('customDateRange').style.display = 'none';
        }

        this.updateAnalysisPeriod();
        this.filterDataByPeriod();
        this.renderAnalysis();
    }

    // 切换自定义日期范围
    toggleCustomDateRange() {
        const customRange = document.getElementById('customDateRange');
        customRange.style.display = customRange.style.display === 'none' ? 'block' : 'none';

        // 设置默认日期
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);

        document.getElementById('startDate').value = startDate.toISOString().split('T')[0];
        document.getElementById('endDate').value = endDate.toISOString().split('T')[0];
    }

    // 应用自定义日期范围
    applyCustomRange() {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        if (!startDate || !endDate) {
            this.showNotification('请选择开始和结束日期', 'warning');
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            this.showNotification('开始日期不能晚于结束日期', 'warning');
            return;
        }

        this.customStartDate = startDate;
        this.customEndDate = endDate;
        this.currentPeriod = 'custom';

        this.updateAnalysisPeriod();
        this.filterDataByPeriod();
        this.renderAnalysis();

        this.showNotification('自定义日期范围已应用', 'success');
    }

    // 更新分析周期显示
    updateAnalysisPeriod() {
        const periodMap = {
            week: '最近7天',
            month: '最近30天',
            quarter: '最近90天',
            year: '最近365天',
            custom: `${this.customStartDate} 至 ${this.customEndDate}`
        };

        const periodElement = document.getElementById('analysisPeriod');
        if (periodElement) {
            periodElement.textContent = `分析周期：${periodMap[this.currentPeriod]}`;
        }
    }

    // 根据周期筛选数据
    filterDataByPeriod() {
        const now = new Date();
        let startDate;

        switch (this.currentPeriod) {
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case 'quarter':
                startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            case 'year':
                startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                break;
            case 'custom':
                startDate = new Date(this.customStartDate);
                now.setTime(new Date(this.customEndDate).getTime());
                break;
        }

        this.filteredEntries = this.entries.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate >= startDate && entryDate <= now;
        });
    }

    // 渲染分析结果
    renderAnalysis() {
        this.renderStatistics();
        this.renderMoodDistribution();
        this.renderTriggerAnalysis();
        this.renderTimePatterns();
        this.renderInsights();
        this.addCountUpAnimations();
    }

    // 渲染统计数据
    renderStatistics() {
        const stats = this.calculateStatistics();

        // 更新统计卡片
        this.updateStatCard('avgMoodValue', stats.avgMood, stats.avgMoodChange);
        this.updateStatCard('totalEntriesValue', stats.totalEntries, stats.totalEntriesChange);
        this.updateStatCard('streakDaysValue', stats.streakDays, stats.streakDaysChange);
        this.updateStatCard('positiveRateValue', `${stats.positiveRate}%`, stats.positiveRateChange);
    }

    // 计算统计数据
    calculateStatistics() {
        const entries = this.filteredEntries;

        // 平均心情指数
        const avgMood = entries.length > 0 ?
            (entries.reduce((sum, entry) => sum + this.moodMap[entry.mood].intensity, 0) / entries.length).toFixed(1) : 0;

        // 总记录天数
        const totalEntries = entries.length;

        // 连续记录天数
        const streakDays = this.calculateStreak();

        // 积极情绪占比
        const positiveEntries = entries.filter(entry => this.moodMap[entry.mood].category === 'positive');
        const positiveRate = entries.length > 0 ? Math.round((positiveEntries.length / entries.length) * 100) : 0;

        // 计算变化趋势（模拟）
        const avgMoodChange = this.calculateChange(avgMood, 7.7);
        const totalEntriesChange = this.calculateChange(totalEntries, totalEntries - 12);
        const streakDaysChange = streakDays > 10 ? '新记录！' : `保持 ${streakDays} 天`;
        const positiveRateChange = this.calculateChange(positiveRate, positiveRate - 8);

        return {
            avgMood,
            totalEntries,
            streakDays,
            positiveRate,
            avgMoodChange,
            totalEntriesChange,
            streakDaysChange,
            positiveRateChange
        };
    }

    // 计算变化趋势
    calculateChange(current, previous) {
        const change = current - previous;
        const sign = change >= 0 ? '+' : '';
        return `较上周 ${sign}${change.toFixed(1)}`;
    }

    // 计算连续记录天数
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

    // 更新统计卡片
    updateStatCard(valueId, value, change) {
        const valueElement = document.getElementById(valueId);
        const changeElement = document.getElementById(valueId.replace('Value', 'Change'));

        if (valueElement) {
            valueElement.textContent = value;
        }

        if (changeElement && change) {
            changeElement.textContent = change;
            changeElement.className = 'stat-change ' + (change.includes('+') || change.includes('新记录') ? 'positive' : 'negative');
        }
    }

    // 渲染心情分布
    renderMoodDistribution() {
        const distribution = this.calculateMoodDistribution();
        const container = document.getElementById('moodDistribution');

        if (!container) return;

        container.innerHTML = distribution.map(item => `
            <div class="mood-item" style="animation-delay: ${Math.random() * 0.5}s;">
                <div class="mood-emoji">${item.emoji}</div>
                <div class="mood-percentage">${item.percentage}%</div>
                <div class="mood-label">${item.label}</div>
            </div>
        `).join('');
    }

    // 计算心情分布
    calculateMoodDistribution() {
        const entries = this.filteredEntries;
        const distribution = {};

        // 统计每种心情的出现次数
        entries.forEach(entry => {
            distribution[entry.mood] = (distribution[entry.mood] || 0) + 1;
        });

        // 转换为百分比并排序
        const total = entries.length;
        const result = Object.entries(distribution)
            .map(([mood, count]) => ({
                mood,
                count,
                percentage: total > 0 ? Math.round((count / total) * 100) : 0,
                emoji: this.moodMap[mood].emoji,
                label: this.moodMap[mood].label
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 6); // 只显示前6种心情

        return result;
    }

    // 渲染触发因素分析
    renderTriggerAnalysis() {
        const triggers = this.analyzeTriggers();
        const container = document.getElementById('triggerAnalysis');

        if (!container) return;

        container.innerHTML = triggers.map(trigger => `
            <div class="trigger-item">
                <div class="trigger-label">${trigger.tag}</div>
                <div class="trigger-impact">
                    <div class="impact-bar">
                        <div class="impact-fill" style="width: ${trigger.impactLevel}%"></div>
                    </div>
                    <div class="impact-score">${trigger.impact > 0 ? '+' : ''}${trigger.impact.toFixed(1)}</div>
                </div>
            </div>
        `).join('');
    }

    // 分析触发因素
    analyzeTriggers() {
        const tagImpacts = {};

        this.filteredEntries.forEach(entry => {
            const moodIntensity = this.moodMap[entry.mood].intensity;

            entry.tags.forEach(tag => {
                if (!tagImpacts[tag]) {
                    tagImpacts[tag] = { total: 0, count: 0 };
                }
                tagImpacts[tag].total += moodIntensity;
                tagImpacts[tag].count++;
            });
        });

        // 计算每个标签的平均心情影响
        const triggers = Object.entries(tagImpacts)
            .map(([tag, data]) => ({
                tag,
                impact: (data.total / data.count) - 5, // 以5为基准线
                count: data.count,
                impactLevel: Math.min(Math.abs((data.total / data.count) - 5) * 20, 100)
            }))
            .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
            .slice(0, 8);

        return triggers;
    }

    // 渲染时间模式
    renderTimePatterns() {
        const patterns = this.analyzeTimePatterns();
        const container = document.getElementById('timePatterns');

        if (!container) return;

        container.innerHTML = patterns.map(pattern => `
            <div class="pattern-item">
                <div class="pattern-title">
                    <span class="pattern-emoji">${pattern.emoji}</span>
                    ${pattern.title}
                </div>
                <div class="pattern-description">${pattern.description}</div>
            </div>
        `).join('');
    }

    // 分析时间模式
    analyzeTimePatterns() {
        const dayOfWeekMoods = this.analyzeDayOfWeekPatterns();
        const monthlyTrends = this.analyzeMonthlyTrends();

        const patterns = [];

        // 一周中的模式
        if (dayOfWeekMoods.best) {
            patterns.push({
                emoji: '📅',
                title: '最佳工作日',
                description: `您在${dayOfWeekMoods.best.day}的心情通常最好，平均心情指数为${dayOfWeekMoods.best.avg.toFixed(1)}。`
            });
        }

        if (dayOfWeekMoods.worst) {
            patterns.push({
                emoji: '⚡',
                title: '需要关注的日子',
                description: `${dayOfWeekMoods.worst.day}是您心情相对较低的日子，建议在这天安排轻松的活动。`
            });
        }

        // 月度趋势
        if (monthlyTrends.improving) {
            patterns.push({
                emoji: '📈',
                title: '积极发展趋势',
                description: '您的整体心情呈现上升趋势，继续保持良好的生活习惯！'
            });
        }

        return patterns;
    }

    // 分析一周中各天的心情模式
    analyzeDayOfWeekPatterns() {
        const dayMoods = {};
        const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

        this.filteredEntries.forEach(entry => {
            const date = new Date(entry.date);
            const dayOfWeek = days[date.getDay()];
            const moodIntensity = this.moodMap[entry.mood].intensity;

            if (!dayMoods[dayOfWeek]) {
                dayMoods[dayOfWeek] = { total: 0, count: 0 };
            }

            dayMoods[dayOfWeek].total += moodIntensity;
            dayMoods[dayOfWeek].count++;
        });

        // 计算平均值并找出最佳和最差的日子
        const averages = Object.entries(dayMoods)
            .map(([day, data]) => ({
                day,
                avg: data.total / data.count,
                count: data.count
            }))
            .filter(item => item.count > 0)
            .sort((a, b) => b.avg - a.avg);

        return {
            best: averages[0],
            worst: averages[averages.length - 1]
        };
    }

    // 分析月度趋势
    analyzeMonthlyTrends() {
        const entries = this.filteredEntries.slice(-30); // 最近30天
        if (entries.length < 10) return {};

        const firstHalf = entries.slice(0, Math.floor(entries.length / 2));
        const secondHalf = entries.slice(Math.floor(entries.length / 2));

        const firstHalfAvg = firstHalf.reduce((sum, entry) =>
            sum + this.moodMap[entry.mood].intensity, 0) / firstHalf.length;
        const secondHalfAvg = secondHalf.reduce((sum, entry) =>
            sum + this.moodMap[entry.mood].intensity, 0) / secondHalf.length;

        return {
            improving: secondHalfAvg > firstHalfAvg,
            change: secondHalfAvg - firstHalfAvg
        };
    }

    // 渲染智能洞察
    renderInsights() {
        const insights = this.generateInsights();
        const container = document.getElementById('insightsGrid');

        if (!container) return;

        container.innerHTML = insights.map(insight => `
            <div class="insight-card ${insight.type}">
                <div class="insight-icon">${insight.icon}</div>
                <div class="insight-title">${insight.title}</div>
                <div class="insight-content">${insight.content}</div>
            </div>
        `).join('');
    }

    // 生成智能洞察
    generateInsights() {
        const stats = this.calculateStatistics();
        const insights = [];

        // 基于积极情绪比例的洞察
        if (stats.positiveRate >= 80) {
            insights.push({
                type: 'positive',
                icon: '🌟',
                title: '情绪状态优秀',
                content: `您的积极情绪占比达到${stats.positiveRate}%，心理状态非常健康。继续保持当前的生活方式和心态！`
            });
        } else if (stats.positiveRate >= 60) {
            insights.push({
                type: 'info',
                icon: '💡',
                title: '情绪波动正常',
                content: '您的情绪状态总体良好，偶有波动属于正常范围。建议继续关注自己的情绪变化。'
            });
        } else {
            insights.push({
                type: 'warning',
                icon: '🔍',
                title: '需要更多关注',
                content: '最近可能遇到了一些挑战。建议多进行自我关爱，必要时寻求专业帮助。'
            });
        }

        // 基于记录习惯的洞察
        if (stats.streakDays >= 14) {
            insights.push({
                type: 'positive',
                icon: '🎯',
                title: '记录习惯优秀',
                content: `您已连续记录${stats.streakDays}天，这种自我觉察的习惯将帮助您更好地了解自己的情绪模式。`
            });
        }

        // 基于平均心情的洞察
        if (parseFloat(stats.avgMood) >= 7.5) {
            insights.push({
                type: 'positive',
                icon: '😊',
                title: '心情指数理想',
                content: `您的平均心情指数为${stats.avgMood}，说明您拥有积极乐观的心态。这是心理健康的重要指标。`
            });
        }

        // 建议性洞察
        insights.push({
            type: 'info',
            icon: '📚',
            title: '持续改善建议',
            content: '建议定期回顾您的心情记录，识别积极和消极的触发因素，制定个性化的情绪管理策略。'
        });

        return insights;
    }

    // 添加计数动画
    addCountUpAnimations() {
        const statValues = document.querySelectorAll('.stat-value');

        statValues.forEach(element => {
            const finalValue = element.textContent;
            const numericValue = parseFloat(finalValue.replace(/[^\d.]/g, ''));

            if (!isNaN(numericValue)) {
                let currentValue = 0;
                const increment = numericValue / 30;
                const suffix = finalValue.replace(/[\d.]/g, '');

                const counter = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= numericValue) {
                        currentValue = numericValue;
                        clearInterval(counter);
                    }

                    element.textContent = currentValue.toFixed(1) + suffix;
                }, 50);
            }
        });
    }

    // 添加滚动动画
    addScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.stat-card, .chart-section, .analysis-card').forEach(el => {
            observer.observe(el);
        });
    }

    // 导出报告
    exportReport(type) {
        const data = this.prepareExportData();

        if (type === 'pdf') {
            this.exportToPDF(data);
        } else if (type === 'csv') {
            this.exportToCSV(data);
        }
    }

    // 准备导出数据
    prepareExportData() {
        const stats = this.calculateStatistics();
        const distribution = this.calculateMoodDistribution();

        return {
            period: this.currentPeriod,
            statistics: stats,
            distribution,
            entries: this.filteredEntries,
            generatedAt: new Date().toISOString()
        };
    }

    // 导出为CSV
    exportToCSV(data) {
        const csvContent = [
            // 表头
            ['日期', '心情', '标题', '天气', '强度', '标签'].join(','),
            // 数据行
            ...data.entries.map(entry => [
                entry.date,
                this.moodMap[entry.mood].label,
                `"${entry.title}"`,
                this.weatherMap[entry.weather].label,
                entry.intensity,
                `"${entry.tags.join(';')}"`
            ].join(','))
        ].join('\n');

        // 添加BOM以支持中文
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `心情分析报告_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();

        this.showNotification('CSV报告已导出', 'success');
    }

    // 导出为PDF（模拟）
    exportToPDF(data) {
        // 这里应该集成PDF生成库，如jsPDF
        this.showNotification('PDF报告导出功能开发中...', 'info');
    }

    // 分享分析结果
    shareAnalysis() {
        const stats = this.calculateStatistics();
        const text = `我的情绪分析报告：平均心情指数${stats.avgMood}，积极情绪占比${stats.positiveRate}%，已连续记录${stats.streakDays}天。#LifeSync #情绪管理`;

        if (navigator.share) {
            navigator.share({
                title: '我的情绪分析报告',
                text: text,
                url: window.location.href
            });
        } else {
            // 复制到剪贴板
            navigator.clipboard.writeText(text).then(() => {
                this.showNotification('分析结果已复制到剪贴板', 'success');
            });
        }
    }

    // 显示通知
    showNotification(message, type = 'info') {
        // 复用心情记录页面的通知系统
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

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.moodAnalysis = new MoodAnalysis();
});

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MoodAnalysis;
} 