// 番茄钟专注计时器功能
class PomodoroTimer {
    constructor() {
        this.isRunning = false;
        this.isPaused = false;
        this.currentMode = 'work'; // work, shortBreak, longBreak
        this.timeLeft = 25 * 60; // 默认25分钟
        this.completedPomodoros = 0;
        this.currentTask = '';
        this.timer = null;

        // 设置
        this.settings = {
            workTime: 25,
            shortBreak: 5,
            longBreak: 15,
            longBreakInterval: 4,
            soundAlert: true,
            desktopNotification: true,
            autoStart: false
        };

        // 统计数据
        this.stats = {
            completedPomodoros: 0,
            totalFocusTime: 0,
            completedTasks: 0,
            totalBreakTime: 0
        };

        this.tasks = [];
        this.loadData();
        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
        this.updateStats();
    }

    initializeElements() {
        this.timerDisplay = document.getElementById('timerDisplay');
        this.currentModeElement = document.getElementById('currentMode');
        this.progressCircle = document.getElementById('progressCircle');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.skipBtn = document.getElementById('skipBtn');
    }

    bindEvents() {
        // 控制按钮事件
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.skipBtn.addEventListener('click', () => this.skip());

        // 设置变更事件
        document.getElementById('workTime').addEventListener('change', (e) => {
            this.settings.workTime = parseInt(e.target.value);
            if (this.currentMode === 'work' && !this.isRunning) {
                this.timeLeft = this.settings.workTime * 60;
                this.updateDisplay();
            }
            this.saveData();
        });

        document.getElementById('shortBreak').addEventListener('change', (e) => {
            this.settings.shortBreak = parseInt(e.target.value);
            this.saveData();
        });

        document.getElementById('longBreak').addEventListener('change', (e) => {
            this.settings.longBreak = parseInt(e.target.value);
            this.saveData();
        });

        document.getElementById('longBreakInterval').addEventListener('change', (e) => {
            this.settings.longBreakInterval = parseInt(e.target.value);
            this.saveData();
        });

        // 提醒设置
        document.getElementById('soundAlert').addEventListener('change', (e) => {
            this.settings.soundAlert = e.target.checked;
            this.saveData();
        });

        document.getElementById('desktopNotification').addEventListener('change', (e) => {
            this.settings.desktopNotification = e.target.checked;
            this.saveData();
        });

        document.getElementById('autoStart').addEventListener('change', (e) => {
            this.settings.autoStart = e.target.checked;
            this.saveData();
        });

        // 背景音乐选择
        document.querySelectorAll('.music-option').forEach(option => {
            option.addEventListener('click', (e) => {
                document.querySelectorAll('.music-option').forEach(opt => opt.classList.remove('active'));
                e.currentTarget.classList.add('active');
                const music = e.currentTarget.dataset.music;
                this.selectMusic(music);
            });
        });

        // 任务输入事件
        document.getElementById('taskInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask();
            }
        });
    }

    start() {
        if (this.isPaused) {
            this.isPaused = false;
        } else if (!this.isRunning) {
            this.isRunning = true;
        }

        this.startBtn.style.display = 'none';
        this.pauseBtn.style.display = 'inline-block';

        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();

            if (this.timeLeft <= 0) {
                this.complete();
            }
        }, 1000);
    }

    pause() {
        this.isPaused = true;
        clearInterval(this.timer);
        this.startBtn.style.display = 'inline-block';
        this.pauseBtn.style.display = 'none';
    }

    reset() {
        this.isRunning = false;
        this.isPaused = false;
        clearInterval(this.timer);

        this.timeLeft = this.getTimeForCurrentMode();
        this.updateDisplay();

        this.startBtn.style.display = 'inline-block';
        this.pauseBtn.style.display = 'none';
    }

    skip() {
        this.complete();
    }

    complete() {
        clearInterval(this.timer);
        this.isRunning = false;
        this.isPaused = false;

        this.playNotification();
        this.updateStatistics();

        // 切换到下一个模式
        this.switchToNextMode();

        this.startBtn.style.display = 'inline-block';
        this.pauseBtn.style.display = 'none';

        if (this.settings.autoStart) {
            setTimeout(() => this.start(), 3000);
        }
    }

    switchToNextMode() {
        if (this.currentMode === 'work') {
            this.completedPomodoros++;

            if (this.completedPomodoros % this.settings.longBreakInterval === 0) {
                this.currentMode = 'longBreak';
            } else {
                this.currentMode = 'shortBreak';
            }
        } else {
            this.currentMode = 'work';
        }

        this.timeLeft = this.getTimeForCurrentMode();
        this.updateDisplay();
    }

    getTimeForCurrentMode() {
        switch (this.currentMode) {
            case 'work':
                return this.settings.workTime * 60;
            case 'shortBreak':
                return this.settings.shortBreak * 60;
            case 'longBreak':
                return this.settings.longBreak * 60;
            default:
                return this.settings.workTime * 60;
        }
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // 更新模式显示
        const modeNames = {
            work: '工作时间',
            shortBreak: '短休息',
            longBreak: '长休息'
        };
        this.currentModeElement.textContent = modeNames[this.currentMode];

        // 更新进度环
        const totalTime = this.getTimeForCurrentMode();
        const progress = (totalTime - this.timeLeft) / totalTime;
        const circumference = 2 * Math.PI * 90;
        const offset = circumference * (1 - progress);
        this.progressCircle.style.strokeDashoffset = offset;
    }

    updateStatistics() {
        if (this.currentMode === 'work') {
            this.stats.totalFocusTime += this.settings.workTime;
            this.stats.completedPomodoros++;
        } else {
            this.stats.totalBreakTime += (this.currentMode === 'shortBreak' ? this.settings.shortBreak : this.settings.longBreak);
        }

        this.updateStats();
        this.saveData();
    }

    updateStats() {
        document.getElementById('completedPomodoros').textContent = this.stats.completedPomodoros;
        document.getElementById('totalFocusTime').textContent = this.stats.totalFocusTime;
        document.getElementById('completedTasks').textContent = this.stats.completedTasks;
        document.getElementById('totalBreakTime').textContent = this.stats.totalBreakTime;
    }

    playNotification() {
        if (this.settings.soundAlert) {
            // 播放提示音
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAAAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUfCECS1e7MfDEIGWm98+OBN');
            audio.play().catch(() => { }); // 忽略播放失败
        }

        if (this.settings.desktopNotification && 'Notification' in window) {
            if (Notification.permission === 'granted') {
                const modeNames = {
                    work: '工作时间结束！',
                    shortBreak: '短休息结束！',
                    longBreak: '长休息结束！'
                };
                new Notification(modeNames[this.currentMode], {
                    body: this.currentMode === 'work' ? '是时候休息一下了' : '让我们继续工作吧！',
                    icon: '/favicon.ico'
                });
            }
        }
    }

    addTask() {
        const taskInput = document.getElementById('taskInput');
        const taskText = taskInput.value.trim();

        if (taskText) {
            const task = {
                id: Date.now(),
                text: taskText,
                completed: false,
                createdAt: new Date().toISOString()
            };

            this.tasks.push(task);
            this.renderTasks();
            taskInput.value = '';
            this.saveData();
        }
    }

    renderTasks() {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';

        this.tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskElement.innerHTML = `
                <span>${task.text}</span>
                <div class="task-actions">
                    <button class="task-btn" onclick="pomodoroTimer.toggleTask(${task.id})">
                        ${task.completed ? '恢复' : '完成'}
                    </button>
                    <button class="task-btn delete" onclick="pomodoroTimer.deleteTask(${task.id})">删除</button>
                </div>
            `;
            taskList.appendChild(taskElement);
        });
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            if (task.completed) {
                this.stats.completedTasks++;
                this.updateStats();
            } else {
                this.stats.completedTasks--;
                this.updateStats();
            }
            this.renderTasks();
            this.saveData();
        }
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.renderTasks();
        this.saveData();
    }

    selectMusic(musicType) {
        // 这里可以实现背景音乐播放逻辑
        console.log('Selected music:', musicType);
    }

    loadData() {
        try {
            const savedData = localStorage.getItem('pomodoroData');
            if (savedData) {
                const data = JSON.parse(savedData);
                this.settings = { ...this.settings, ...data.settings };
                this.stats = { ...this.stats, ...data.stats };
                this.tasks = data.tasks || [];
                this.completedPomodoros = data.completedPomodoros || 0;
            }
        } catch (error) {
            console.error('Error loading pomodoro data:', error);
        }
    }

    saveData() {
        try {
            const data = {
                settings: this.settings,
                stats: this.stats,
                tasks: this.tasks,
                completedPomodoros: this.completedPomodoros
            };
            localStorage.setItem('pomodoroData', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving pomodoro data:', error);
        }
    }
}

// 全局添加任务函数
function addTask() {
    if (window.pomodoroTimer) {
        window.pomodoroTimer.addTask();
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function () {
    // 请求通知权限
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }

    // 初始化番茄钟
    window.pomodoroTimer = new PomodoroTimer();

    // 设置页面高亮
    highlightCurrentPage();

    // 初始化面包屑导航
    initBreadcrumb();
});

// 页面卸载时保存数据
window.addEventListener('beforeunload', function () {
    if (window.pomodoroTimer) {
        window.pomodoroTimer.saveData();
    }
}); 