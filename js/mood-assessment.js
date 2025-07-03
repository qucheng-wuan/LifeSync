// 情绪健康评估功能
class MoodAssessment {
    constructor() {
        this.currentQuestion = 0;
        this.answers = {};
        this.questions = this.initQuestions();
        this.activeTab = 'test';
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderProgressIndicator();
        this.renderCurrentQuestion();
        this.updateNavigation();
    }

    // 初始化问题
    initQuestions() {
        return [
            {
                id: 1,
                text: "在过去两周内，你有多频繁地感到情绪低落、沮丧或绝望？",
                type: "scale",
                dimension: "emotional_stability"
            },
            {
                id: 2,
                text: "你对日常活动的兴趣或乐趣减少了吗？",
                type: "scale",
                dimension: "emotional_stability"
            },
            {
                id: 3,
                text: "你在面对压力时，能够保持冷静和理性吗？",
                type: "scale",
                dimension: "stress_management"
            },
            {
                id: 4,
                text: "当遇到挫折时，你多久能够重新振作起来？",
                type: "options",
                options: [
                    { text: "很快（几小时内）", value: 5 },
                    { text: "比较快（1-2天）", value: 4 },
                    { text: "一般（3-7天）", value: 3 },
                    { text: "比较慢（1-2周）", value: 2 },
                    { text: "很慢（超过2周）", value: 1 }
                ],
                dimension: "stress_management"
            },
            {
                id: 5,
                text: "你能够准确识别自己的情绪状态吗？",
                type: "scale",
                dimension: "self_awareness"
            },
            {
                id: 6,
                text: "你会主动反思自己的情绪反应和行为模式吗？",
                type: "scale",
                dimension: "self_awareness"
            },
            {
                id: 7,
                text: "在与他人交往中，你能理解对方的情绪吗？",
                type: "scale",
                dimension: "social_emotion"
            },
            {
                id: 8,
                text: "你在表达自己的情感时感到困难吗？",
                type: "scale",
                dimension: "social_emotion",
                reverse: true
            },
            {
                id: 9,
                text: "你的睡眠质量如何？",
                type: "options",
                options: [
                    { text: "非常好，很少失眠", value: 5 },
                    { text: "比较好，偶尔失眠", value: 4 },
                    { text: "一般，有时睡不好", value: 3 },
                    { text: "比较差，经常失眠", value: 2 },
                    { text: "很差，严重失眠", value: 1 }
                ],
                dimension: "emotional_stability"
            },
            {
                id: 10,
                text: "你会使用健康的方式来管理压力吗？（如运动、冥想等）",
                type: "scale",
                dimension: "stress_management"
            },
            {
                id: 11,
                text: "你对自己的情绪管理能力有信心吗？",
                type: "scale",
                dimension: "self_awareness"
            },
            {
                id: 12,
                text: "在团队中，你能够感知和回应他人的情绪需求吗？",
                type: "scale",
                dimension: "social_emotion"
            },
            {
                id: 13,
                text: "当感到焦虑时，你能够采取有效的应对策略吗？",
                type: "scale",
                dimension: "stress_management"
            },
            {
                id: 14,
                text: "你会定期检视自己的心理健康状态吗？",
                type: "scale",
                dimension: "self_awareness"
            },
            {
                id: 15,
                text: "你在处理人际冲突时感到自信吗？",
                type: "scale",
                dimension: "social_emotion"
            }
        ];
    }

    // 绑定事件
    bindEvents() {
        // 导航标签
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchTab(tab);
            });
        });

        // 导航按钮
        document.getElementById('prevBtn')?.addEventListener('click', () => {
            this.previousQuestion();
        });

        document.getElementById('nextBtn')?.addEventListener('click', () => {
            this.nextQuestion();
        });
    }

    // 切换标签
    switchTab(tab) {
        this.activeTab = tab;

        // 更新标签样式
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        // 显示对应面板
        document.querySelectorAll('.assessment-content').forEach(panel => {
            panel.style.display = 'none';
        });

        if (tab === 'test') {
            document.getElementById('testPanel').style.display = 'block';
        } else if (tab === 'history') {
            document.getElementById('historyPanel').style.display = 'block';
            this.loadHistory();
        } else if (tab === 'resources') {
            document.getElementById('resourcesPanel').style.display = 'block';
        }
    }

    // 渲染进度指示器
    renderProgressIndicator() {
        const indicator = document.getElementById('progressIndicator');
        if (!indicator) return;

        indicator.innerHTML = this.questions.map((_, index) => {
            let className = 'progress-dot';
            if (index < this.currentQuestion) {
                className += ' completed';
            } else if (index === this.currentQuestion) {
                className += ' active';
            }
            return `<div class="${className}"></div>`;
        }).join('');
    }

    // 渲染当前问题
    renderCurrentQuestion() {
        const container = document.getElementById('questionsContainer');
        if (!container) return;

        const question = this.questions[this.currentQuestion];
        if (!question) {
            this.showResults();
            return;
        }

        container.innerHTML = `
            <div class="question-card current">
                <div class="question-text">${question.text}</div>
                ${this.renderQuestionOptions(question)}
            </div>
        `;

        // 绑定选项事件
        this.bindOptionEvents(question);

        // 更新计数器
        document.getElementById('currentQuestion').textContent = this.currentQuestion + 1;
        document.getElementById('totalQuestions').textContent = this.questions.length;
    }

    // 渲染问题选项
    renderQuestionOptions(question) {
        if (question.type === 'scale') {
            return `
                <div class="scale-options">
                    ${[1, 2, 3, 4, 5].map(value => `
                        <div class="scale-item" data-value="${value}">
                            <div class="scale-number">${value}</div>
                            <div class="scale-label">${this.getScaleLabel(value)}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        } else if (question.type === 'options') {
            return `
                <div class="options-grid">
                    ${question.options.map(option => `
                        <div class="option-item" data-value="${option.value}">
                            ${option.text}
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }

    // 获取量表标签
    getScaleLabel(value) {
        const labels = {
            1: '从不',
            2: '很少',
            3: '有时',
            4: '经常',
            5: '总是'
        };
        return labels[value];
    }

    // 绑定选项事件
    bindOptionEvents(question) {
        const options = document.querySelectorAll('.scale-item, .option-item');
        options.forEach(option => {
            option.addEventListener('click', () => {
                // 移除其他选中状态
                options.forEach(opt => opt.classList.remove('selected'));

                // 添加选中状态
                option.classList.add('selected');

                // 保存答案
                const value = parseInt(option.dataset.value);
                this.answers[question.id] = {
                    value: question.reverse ? (6 - value) : value,
                    dimension: question.dimension
                };

                // 启用下一步按钮
                this.updateNavigation();
            });
        });

        // 恢复之前的选择
        if (this.answers[question.id]) {
            const savedValue = question.reverse ?
                (6 - this.answers[question.id].value) :
                this.answers[question.id].value;

            const selectedOption = document.querySelector(`[data-value="${savedValue}"]`);
            if (selectedOption) {
                selectedOption.classList.add('selected');
            }
        }
    }

    // 更新导航按钮
    updateNavigation() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (prevBtn) {
            prevBtn.disabled = this.currentQuestion === 0;
        }

        if (nextBtn) {
            const currentQuestion = this.questions[this.currentQuestion];
            const hasAnswer = this.answers[currentQuestion?.id];

            nextBtn.disabled = !hasAnswer;
            nextBtn.textContent = this.currentQuestion === this.questions.length - 1 ? '完成测试' : '下一题';
        }
    }

    // 上一题
    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.renderProgressIndicator();
            this.renderCurrentQuestion();
            this.updateNavigation();
        }
    }

    // 下一题
    nextQuestion() {
        const currentQuestion = this.questions[this.currentQuestion];
        if (!this.answers[currentQuestion.id]) return;

        if (this.currentQuestion < this.questions.length - 1) {
            this.currentQuestion++;
            this.renderProgressIndicator();
            this.renderCurrentQuestion();
            this.updateNavigation();
        } else {
            this.showResults();
        }
    }

    // 显示结果
    showResults() {
        const scores = this.calculateScores();
        this.renderResults(scores);

        // 切换到结果面板
        document.getElementById('testPanel').style.display = 'none';
        document.getElementById('resultsPanel').classList.add('active');
        document.getElementById('resultsPanel').style.display = 'block';

        // 保存测试结果
        this.saveResults(scores);
    }

    // 计算得分
    calculateScores() {
        const dimensions = {
            emotional_stability: [],
            stress_management: [],
            self_awareness: [],
            social_emotion: []
        };

        // 按维度分组答案
        Object.values(this.answers).forEach(answer => {
            if (dimensions[answer.dimension]) {
                dimensions[answer.dimension].push(answer.value);
            }
        });

        // 计算各维度得分
        const scores = {};
        Object.keys(dimensions).forEach(dimension => {
            const values = dimensions[dimension];
            if (values.length > 0) {
                const average = values.reduce((sum, val) => sum + val, 0) / values.length;
                scores[dimension] = Math.round(average * 20); // 转换为100分制
            }
        });

        // 计算总分
        const totalScore = Math.round(
            Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.keys(scores).length
        );

        return {
            total: totalScore,
            dimensions: scores,
            category: this.getScoreCategory(totalScore)
        };
    }

    // 获取得分等级
    getScoreCategory(score) {
        if (score >= 85) return '情绪健康状态优秀';
        if (score >= 70) return '情绪健康状态良好';
        if (score >= 55) return '情绪健康状态一般';
        if (score >= 40) return '需要关注情绪健康';
        return '建议寻求专业帮助';
    }

    // 渲染结果
    renderResults(scores) {
        // 更新总分显示
        document.getElementById('totalScore').textContent = scores.total;
        document.getElementById('scoreCategory').textContent = scores.category;

        // 更新维度得分
        const dimensionNames = {
            emotional_stability: '情绪稳定性',
            stress_management: '压力管理',
            self_awareness: '自我觉察',
            social_emotion: '社交情绪'
        };

        const dimensionCards = document.querySelectorAll('.dimension-card');
        let index = 0;
        Object.keys(scores.dimensions).forEach(dimension => {
            if (dimensionCards[index]) {
                const card = dimensionCards[index];
                const nameEl = card.querySelector('.dimension-name');
                const scoreEl = card.querySelector('.dimension-score');
                const fillEl = card.querySelector('.dimension-fill');

                if (nameEl) nameEl.textContent = dimensionNames[dimension];
                if (scoreEl) scoreEl.textContent = scores.dimensions[dimension];
                if (fillEl) {
                    setTimeout(() => {
                        fillEl.style.width = scores.dimensions[dimension] + '%';
                    }, 500 + index * 200);
                }
                index++;
            }
        });

        // 生成个性化建议
        this.generateRecommendations(scores);
    }

    // 生成建议
    generateRecommendations(scores) {
        const recommendations = [];

        Object.keys(scores.dimensions).forEach(dimension => {
            const score = scores.dimensions[dimension];

            if (score < 70) {
                switch (dimension) {
                    case 'emotional_stability':
                        recommendations.push({
                            icon: '🧘‍♀️',
                            title: '情绪稳定性提升',
                            content: '建议尝试冥想练习和规律作息来提升情绪稳定性。'
                        });
                        break;
                    case 'stress_management':
                        recommendations.push({
                            icon: '⚡',
                            title: '压力管理提升',
                            content: '学习深呼吸技巧和时间管理方法来更好地应对压力。'
                        });
                        break;
                    case 'self_awareness':
                        recommendations.push({
                            icon: '🔍',
                            title: '自我觉察提升',
                            content: '坚持写情绪日记，定期反思自己的情绪变化和触发因素。'
                        });
                        break;
                    case 'social_emotion':
                        recommendations.push({
                            icon: '👥',
                            title: '社交情绪提升',
                            content: '多参与社交活动，练习倾听和表达技巧。'
                        });
                        break;
                }
            }
        });

        // 添加积极建议
        if (scores.total >= 80) {
            recommendations.push({
                icon: '⭐',
                title: '保持优势',
                content: '你的情绪健康状态很好！继续保持良好的生活习惯和积极心态。'
            });
        }

        console.log('个性化建议:', recommendations);
    }

    // 保存结果
    saveResults(scores) {
        const results = {
            date: new Date().toISOString().split('T')[0],
            scores: scores,
            answers: this.answers
        };

        // 获取历史记录
        let history = JSON.parse(localStorage.getItem('assessmentHistory')) || [];
        history.push(results);

        // 只保留最近10次记录
        if (history.length > 10) {
            history = history.slice(-10);
        }

        localStorage.setItem('assessmentHistory', JSON.stringify(history));
    }

    // 加载历史记录
    loadHistory() {
        const history = JSON.parse(localStorage.getItem('assessmentHistory')) || [];
        const historyPanel = document.getElementById('historyPanel');

        if (!historyPanel) return;

        if (history.length === 0) {
            historyPanel.innerHTML = '<p>暂无测试历史记录</p>';
            return;
        }

        historyPanel.innerHTML = `
            <h3>测试历史</h3>
            <div class="history-list">
                ${history.map(record => `
                    <div class="history-item">
                        <div class="history-date">${record.date}</div>
                        <div class="history-score">总分: ${record.scores.total}</div>
                        <div class="history-category">${record.scores.category}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // 重置测试
    resetTest() {
        this.currentQuestion = 0;
        this.answers = {};
        this.renderProgressIndicator();
        this.renderCurrentQuestion();
        this.updateNavigation();

        // 切换回测试面板
        document.getElementById('resultsPanel').classList.remove('active');
        document.getElementById('resultsPanel').style.display = 'none';
        document.getElementById('testPanel').style.display = 'block';
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.moodAssessment = new MoodAssessment();
});

// 添加历史记录样式
const style = document.createElement('style');
style.textContent = `
    .history-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .history-item {
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .history-date {
        font-weight: bold;
        color: #333;
    }
    
    .history-score {
        color: #667eea;
        font-weight: bold;
    }
    
    .history-category {
        color: #666;
        font-size: 0.9rem;
    }
`;
document.head.appendChild(style); 