// LifeSync 习惯详情功能脚本

let habitData = {};

document.addEventListener('DOMContentLoaded', function () {
    initializeHabitDetail();
    loadHabitData();
    checkHabitParameters();
});

// 初始化习惯详情页
function initializeHabitDetail() {
    console.log('初始化习惯详情页');
}

// 检查URL参数（DOM型XSS测试点）
function checkHabitParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const habitName = urlParams.get('name');

    if (habitName) {
        // 🚨 DOM型XSS测试点
        updateHabitNameUnsafe(habitName);
        updateHabitNameSafe(habitName);
    }
}

// 🚨 不安全的习惯名称更新（DOM型XSS测试）
function updateHabitNameUnsafe(name) {
    const habitNameElement = document.getElementById('habitName');

    if (habitNameElement) {
        // 危险：直接设置innerHTML
        habitNameElement.innerHTML = `习惯：${name}`;

        // 添加测试提示
        const warningDiv = document.createElement('div');
        warningDiv.innerHTML = `
            <p style="color: red; background: #ffeeee; padding: 10px; margin: 10px 0;">
                ⚠️ DOM型XSS测试点：直接设置innerHTML<br>
                测试: ?name=&lt;img src=x onerror=alert('XSS')&gt;
            </p>
        `;
        habitNameElement.parentNode.insertBefore(warningDiv, habitNameElement.nextSibling);
    }
}

// 安全的习惯名称更新
function updateHabitNameSafe(name) {
    const safeDisplay = document.createElement('div');
    safeDisplay.innerHTML = `
        <p style="color: green; background: #eeffee; padding: 10px; margin: 10px 0;">
            ✅ 安全版本：使用textContent防止XSS
        </p>
    `;

    const habitNameElement = document.getElementById('habitName');
    if (habitNameElement) {
        const safeName = document.createElement('span');
        safeName.textContent = ` (URL参数: ${name})`;
        safeName.style.color = '#666';
        habitNameElement.appendChild(safeName);
        habitNameElement.parentNode.insertBefore(safeDisplay, habitNameElement.nextSibling);
    }
}

// 加载习惯数据
function loadHabitData() {
    habitData = {
        name: '每日喝水习惯',
        todayProgress: 8,
        goal: 8
    };
    updateHabitDisplay();
}

// 更新习惯显示
function updateHabitDisplay() {
    const progressNumber = document.querySelector('.progress-number');
    const progressUnit = document.querySelector('.progress-unit');

    if (progressNumber) progressNumber.textContent = habitData.todayProgress;
    if (progressUnit) progressUnit.textContent = `/ ${habitData.goal} 杯`;
}

// 习惯打卡
function checkInHabit() {
    if (habitData.todayProgress >= habitData.goal) {
        LifeSync.showNotification('今日目标已完成！', 'info');
        return;
    }

    habitData.todayProgress++;
    updateHabitDisplay();
    LifeSync.showNotification('✅ 打卡成功！', 'success');
}

// 添加饮水记录
function addWaterIntake() {
    checkInHabit();
}

// 编辑习惯
function editHabit() {
    const newName = prompt('请输入新的习惯名称：', habitData.name);
    if (newName && newName.trim()) {
        habitData.name = newName.trim();
        LifeSync.showNotification('习惯信息已更新', 'success');
    }
}

// 分享习惯
function shareHabit() {
    const shareText = `我在LifeSync上坚持${habitData.name}！`;
    LifeSync.showNotification('分享内容已复制', 'success');
}

// 编辑备注（安全实现）
function editNote(dateId) {
    const noteElement = document.getElementById(`note-${dateId}`);
    if (!noteElement) return;

    const currentNote = noteElement.textContent;
    const newNote = prompt('编辑备注：', currentNote);

    if (newNote !== null) {
        // 安全：使用textContent防止XSS
        noteElement.textContent = newNote;
        LifeSync.showNotification('备注已更新', 'success');
    }
}

// 查看详情
function viewDetails(dateId) {
    alert(`查看日期 ${dateId} 的详细信息`);
}

// 筛选历史记录
function filterHistory(type) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    const historyItems = document.querySelectorAll('.history-item');
    historyItems.forEach(item => {
        const shouldShow = type === 'all' || item.classList.contains(type);
        item.style.display = shouldShow ? 'block' : 'none';
    });
}

// 切换月份
function changeMonth(direction) {
    console.log(`切换月份: ${direction}`);
}

// 导出全局函数
window.checkInHabit = checkInHabit;
window.addWaterIntake = addWaterIntake;
window.editHabit = editHabit;
window.shareHabit = shareHabit;
window.editNote = editNote;
window.viewDetails = viewDetails;
window.filterHistory = filterHistory;
window.changeMonth = changeMonth; 