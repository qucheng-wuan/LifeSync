// 心理洞察页面功能
class MoodInsights {
    constructor() {
        this.entries = this.loadEntries();
        this.insights = [];
        this.init();
    }

    init() {
        this.generateInsights();
        this.animateProgressBars();
        this.bindEvents();
    }

    // 加载心情记录
    loadEntries() {
        return JSON.parse(localStorage.getItem('moodEntries')) || [];
    }

    // 生成洞察
    generateInsights() {
        this.analyzePatterns();
        this.analyzeStressFactors();
        this.analyzeTriggers();
        this.generatePredictions();
    }

    // 分析情绪模式
    analyzePatterns() {
        const weekdayMoods = this.getWeekdayMoodPattern();
        const patterns = this.findEmotionalPatterns(weekdayMoods);

        if (patterns.length > 0) {
            this.addInsight('🎯', '情绪模式分析', patterns[0]);
        }
    }

    // 获取工作日心情模式
    getWeekdayMoodPattern() {
        const weekdayData = {};

        this.entries.forEach(entry => {
            const date = new Date(entry.date);
            const weekday = date.getDay();

            if (!weekdayData[weekday]) {
                weekdayData[weekday] = [];
            }
            weekdayData[weekday].push(entry);
        });

        return weekdayData;
    }

    // 查找情绪模式
    findEmotionalPatterns(weekdayData) {
        const patterns = [];
        const moodScores = {
            sad: 1,
            tired: 2,
            calm: 3,
            happy: 4,
            excited: 5
        };

        // 分析每个工作日的平均心情
        Object.keys(weekdayData).forEach(day => {
            const dayEntries = weekdayData[day];
            if (dayEntries.length === 0) return;

            const avgScore = dayEntries.reduce((sum, entry) => {
                return sum + (moodScores[entry.mood] || 3);
            }, 0) / dayEntries.length;

            const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

            if (avgScore < 2.5) {
                patterns.push(`发现你在${dayNames[day]}的情绪通常较低，建议在这天安排一些愉快的活动来提升心情。`);
            } else if (avgScore > 4) {
                patterns.push(`${dayNames[day]}是你心情最好的一天，保持这种积极状态！`);
            }
        });

        return patterns;
    }

    // 分析压力因素
    analyzeStressFactors() {
        const stressTags = ['工作', '学习', 'deadline', '压力', '焦虑'];
        const stressEntries = this.entries.filter(entry =>
            entry.tags && entry.tags.some(tag => stressTags.includes(tag))
        );

        if (stressEntries.length > 0) {
            const suggestions = this.generateStressSuggestions(stressEntries);
            this.addInsight('⚡', '压力管理建议', suggestions);
        }
    }

    // 生成压力管理建议
    generateStressSuggestions(stressEntries) {
        const commonPatterns = this.findCommonStressPatterns(stressEntries);

        let suggestion = `当你感到压力时，通常伴随着"${commonPatterns.join('、')}"相关的标签。以下方法可以帮助你更好地管理压力：`;

        return suggestion;
    }

    // 查找常见压力模式
    findCommonStressPatterns(entries) {
        const tagCount = {};

        entries.forEach(entry => {
            if (entry.tags) {
                entry.tags.forEach(tag => {
                    tagCount[tag] = (tagCount[tag] || 0) + 1;
                });
            }
        });

        return Object.entries(tagCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([tag]) => tag);
    }

    // 分析触发因素
    analyzeTriggers() {
        const positiveEntries = this.entries.filter(entry =>
            ['happy', 'excited'].includes(entry.mood)
        );

        if (positiveEntries.length > 0) {
            const positiveTriggers = this.findPositiveTriggers(positiveEntries);
            this.addInsight('🌈', '积极情绪培养', this.generatePositiveSuggestion(positiveTriggers));
        }
    }

    // 查找积极触发因素
    findPositiveTriggers(entries) {
        const triggers = [];

        entries.forEach(entry => {
            if (entry.tags) {
                triggers.push(...entry.tags);
            }
        });

        // 统计最常见的积极标签
        const triggerCount = {};
        triggers.forEach(trigger => {
            triggerCount[trigger] = (triggerCount[trigger] || 0) + 1;
        });

        return Object.entries(triggerCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([trigger]) => trigger);
    }

    // 生成积极建议
    generatePositiveSuggestion(triggers) {
        const ratio = this.calculatePositiveRatio();
        return `你的积极情绪占比为${ratio}%，表现很好！为了维持这种良好状态，建议继续保持以下习惯：${triggers.join('、')}`;
    }

    // 计算积极情绪占比
    calculatePositiveRatio() {
        if (this.entries.length === 0) return 0;

        const positiveCount = this.entries.filter(entry =>
            ['happy', 'excited', 'calm'].includes(entry.mood)
        ).length;

        return Math.round((positiveCount / this.entries.length) * 100);
    }

    // 生成预测
    generatePredictions() {
        const recentTrend = this.analyzeRecentTrend();
        if (recentTrend) {
            this.addInsight('🔮', '未来趋势预测', recentTrend);
        }
    }

    // 分析最近趋势
    analyzeRecentTrend() {
        const recentEntries = this.entries
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 7);

        if (recentEntries.length < 3) return null;

        const moodScores = {
            sad: 1,
            tired: 2,
            calm: 3,
            happy: 4,
            excited: 5
        };

        const scores = recentEntries.map(entry => moodScores[entry.mood] || 3);
        const trend = this.calculateTrend(scores);

        if (trend > 0.3) {
            return '根据你最近的情绪变化，预测你的心情正在逐步改善，保持这种积极趋势！';
        } else if (trend < -0.3) {
            return '最近你的情绪可能有所波动，建议多关注自己的情绪状态，适当安排放松活动。';
        } else {
            return '你的情绪状态相对稳定，继续保持良好的生活节奏。';
        }
    }

    // 计算趋势
    calculateTrend(scores) {
        if (scores.length < 2) return 0;

        let trend = 0;
        for (let i = 1; i < scores.length; i++) {
            trend += scores[i] - scores[i - 1];
        }

        return trend / (scores.length - 1);
    }

    // 添加洞察
    addInsight(icon, title, content) {
        this.insights.push({ icon, title, content });
    }

    // 绑定事件
    bindEvents() {
        // 进度条动画
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            bar.addEventListener('mouseenter', () => {
                bar.style.animation = 'pulse 1s infinite';
            });

            bar.addEventListener('mouseleave', () => {
                bar.style.animation = 'none';
            });
        });

        // 洞察卡片交互
        document.querySelectorAll('.insight-card').forEach(card => {
            card.addEventListener('click', () => {
                card.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    card.style.transform = 'scale(1)';
                }, 200);
            });
        });
    }

    // 动画进度条
    animateProgressBars() {
        const progressItems = [
            { label: '情绪稳定性', value: this.calculateEmotionalStability() },
            { label: '积极心态', value: this.calculatePositiveRatio() },
            { label: '压力应对', value: this.calculateStressManagement() },
            { label: '自我觉察', value: this.calculateSelfAwareness() }
        ];

        const progressContainer = document.querySelector('.progress-section');
        if (progressContainer) {
            this.updateProgressDisplay(progressItems);
        }
    }

    // 计算情绪稳定性
    calculateEmotionalStability() {
        if (this.entries.length === 0) return 0;

        const moodScores = this.entries.map(entry => {
            const scores = { sad: 1, tired: 2, calm: 3, happy: 4, excited: 5 };
            return scores[entry.mood] || 3;
        });

        const variance = this.calculateVariance(moodScores);
        const stability = Math.max(0, Math.min(100, 100 - variance * 10));

        return Math.round(stability);
    }

    // 计算压力管理能力
    calculateStressManagement() {
        const stressEntries = this.entries.filter(entry =>
            entry.mood === 'sad' || entry.mood === 'tired'
        );

        const managementScore = Math.max(0, 100 - (stressEntries.length / this.entries.length) * 100);
        return Math.round(managementScore);
    }

    // 计算自我觉察度
    calculateSelfAwareness() {
        const entriesWithTags = this.entries.filter(entry =>
            entry.tags && entry.tags.length > 0
        );

        const awarenessScore = (entriesWithTags.length / this.entries.length) * 100;
        return Math.round(awarenessScore);
    }

    // 计算方差
    calculateVariance(values) {
        if (values.length === 0) return 0;

        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
        return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
    }

    // 更新进度显示
    updateProgressDisplay(progressItems) {
        progressItems.forEach((item, index) => {
            setTimeout(() => {
                const progressFill = document.querySelectorAll('.progress-fill')[index];
                if (progressFill) {
                    progressFill.style.width = `${item.value}%`;
                    progressFill.style.transition = 'width 1s ease-in-out';
                }
            }, index * 200);
        });
    }

    // 生成每日建议
    generateDailyTip() {
        const tips = [
            '今天试试深呼吸练习，花5分钟感受当下的平静',
            '记录三件让你感恩的事情，培养积极心态',
            '进行10分钟的冥想，观察内心的想法和感受',
            '与朋友分享你的感受，情感连接有助心理健康',
            '尝试新的爱好或活动，为生活增添新鲜感'
        ];

        const today = new Date().getDate();
        return tips[today % tips.length];
    }
}

// 初始化
const moodInsights = new MoodInsights();

// 添加脉冲动画
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.7; }
        100% { opacity: 1; }
    }
    
    .insight-card {
        transition: all 0.3s ease;
        cursor: pointer;
    }
    
    .insight-card:hover {
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }
    
    .progress-fill {
        transition: width 1s ease-in-out;
    }
`;
document.head.appendChild(style); 