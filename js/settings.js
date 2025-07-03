// 系统设置功能
class SettingsManager {
    constructor() {
        this.settings = this.loadSettings();
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupNavigation();
        this.setupToggleSwitches();
        this.loadCurrentSettings();
    }

    // 加载设置
    loadSettings() {
        const defaultSettings = {
            language: 'zh-CN',
            timezone: 'Asia/Shanghai',
            hour24: true,
            weekStart: 1,
            autoSave: true,
            smartReminders: true,
            desktopNotifications: true,
            emailNotifications: false,
            soundAlerts: true,
            darkMode: false,
            compactLayout: false,
            fontSize: 'medium',
            themeColor: '#667eea',
            dataEncryption: true,
            anonymousStats: true,
            autoLock: false,
            sessionTimeout: 30,
            autoCleanup: true
        };

        return { ...defaultSettings, ...JSON.parse(localStorage.getItem('settings') || '{}') };
    }

    // 绑定事件
    bindEvents() {
        // 全局函数供HTML调用
        window.saveGeneralSettings = () => this.saveGeneralSettings();
        window.saveNotificationSettings = () => this.saveNotificationSettings();
        window.saveAppearanceSettings = () => this.saveAppearanceSettings();
        window.savePrivacySettings = () => this.savePrivacySettings();
        window.backupData = () => this.backupData();
        window.importData = () => this.importData();
        window.exportData = () => this.exportData();
        window.clearCache = () => this.clearCache();
        window.resetAllData = () => this.resetAllData();
        window.deleteAccount = () => this.deleteAccount();
    }

    // 设置导航
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const panels = document.querySelectorAll('.panel');

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                // 移除活跃状态
                navItems.forEach(nav => nav.classList.remove('active'));
                panels.forEach(panel => panel.classList.remove('active'));

                // 添加活跃状态
                item.classList.add('active');
                const targetPanel = document.getElementById(item.dataset.panel + 'Panel');
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            });
        });
    }

    // 设置切换开关
    setupToggleSwitches() {
        document.querySelectorAll('.toggle-switch').forEach(toggle => {
            const setting = toggle.dataset.setting;

            // 设置初始状态
            if (this.settings[setting]) {
                toggle.classList.add('active');
            }

            // 绑定点击事件
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
                this.settings[setting] = toggle.classList.contains('active');
                this.saveSettings();
                this.applySettingChange(setting, this.settings[setting]);
            });
        });

        // 颜色选择器
        document.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                this.settings.themeColor = option.dataset.color;
                this.saveSettings();
                this.applyThemeColor(this.settings.themeColor);
            });
        });
    }

    // 加载当前设置
    loadCurrentSettings() {
        // 基本设置
        document.getElementById('language').value = this.settings.language;
        document.getElementById('timezone').value = this.settings.timezone;
        document.getElementById('weekStart').value = this.settings.weekStart;

        // 主题颜色
        const selectedColor = document.querySelector(`[data-color="${this.settings.themeColor}"]`);
        if (selectedColor) {
            document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
            selectedColor.classList.add('selected');
        }
    }

    // 应用设置变化
    applySettingChange(setting, value) {
        switch (setting) {
            case 'darkMode':
                this.applyDarkMode(value);
                break;
            case 'hour24':
                this.updateTimeFormat(value);
                break;
            case 'language':
                this.updateLanguage(value);
                break;
        }
    }

    // 应用暗色模式
    applyDarkMode(enabled) {
        if (enabled) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    // 应用主题颜色
    applyThemeColor(color) {
        document.documentElement.style.setProperty('--primary-color', color);
    }

    // 保存常规设置
    saveGeneralSettings() {
        this.settings.language = document.getElementById('language').value;
        this.settings.timezone = document.getElementById('timezone').value;
        this.settings.weekStart = parseInt(document.getElementById('weekStart').value);

        this.saveSettings();
        this.showNotification('常规设置已保存！', 'success');
    }

    // 保存通知设置
    saveNotificationSettings() {
        this.saveSettings();
        this.showNotification('通知设置已保存！', 'success');
    }

    // 保存外观设置
    saveAppearanceSettings() {
        this.saveSettings();
        this.showNotification('外观设置已保存！', 'success');
    }

    // 保存隐私设置
    savePrivacySettings() {
        this.saveSettings();
        this.showNotification('隐私设置已保存！', 'success');
    }

    // 保存设置到本地存储
    saveSettings() {
        localStorage.setItem('settings', JSON.stringify(this.settings));
    }

    // 备份数据
    backupData() {
        const allData = {
            settings: this.settings,
            habits: JSON.parse(localStorage.getItem('habits') || '[]'),
            moodEntries: JSON.parse(localStorage.getItem('moodEntries') || '[]'),
            focusHistory: JSON.parse(localStorage.getItem('focusHistory') || '[]'),
            userProfile: JSON.parse(localStorage.getItem('userProfile') || '{}'),
            trainingProgress: JSON.parse(localStorage.getItem('trainingProgress') || '{}'),
            backupDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `lifesync_backup_${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        this.showNotification('数据备份完成！', 'success');
    }

    // 导入数据
    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        this.restoreData(data);
                        this.showNotification('数据导入成功！', 'success');
                    } catch (error) {
                        this.showNotification('导入失败：文件格式错误', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };

        input.click();
    }

    // 恢复数据
    restoreData(data) {
        if (data.settings) localStorage.setItem('settings', JSON.stringify(data.settings));
        if (data.habits) localStorage.setItem('habits', JSON.stringify(data.habits));
        if (data.moodEntries) localStorage.setItem('moodEntries', JSON.stringify(data.moodEntries));
        if (data.focusHistory) localStorage.setItem('focusHistory', JSON.stringify(data.focusHistory));
        if (data.userProfile) localStorage.setItem('userProfile', JSON.stringify(data.userProfile));
        if (data.trainingProgress) localStorage.setItem('trainingProgress', JSON.stringify(data.trainingProgress));

        // 重新加载设置
        this.settings = this.loadSettings();
        this.loadCurrentSettings();
        this.setupToggleSwitches();
    }

    // 导出数据
    exportData() {
        const exportData = {
            habits: JSON.parse(localStorage.getItem('habits') || '[]'),
            moodEntries: JSON.parse(localStorage.getItem('moodEntries') || '[]'),
            focusHistory: JSON.parse(localStorage.getItem('focusHistory') || '[]'),
            exportDate: new Date().toISOString()
        };

        // CSV格式导出
        const csvContent = this.convertToCSV(exportData);
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `lifesync_data_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();

        this.showNotification('数据导出完成！', 'success');
    }

    // 转换为CSV格式
    convertToCSV(data) {
        let csv = '数据类型,日期,详情,数值\n';

        // 习惯数据
        data.habits.forEach(habit => {
            csv += `习惯,${habit.createdAt || ''},${habit.name},${habit.streak || 0}\n`;
        });

        // 心情数据
        data.moodEntries.forEach(entry => {
            csv += `心情,${entry.date},${entry.mood},${entry.intensity || ''}\n`;
        });

        // 专注数据
        data.focusHistory.forEach(entry => {
            csv += `专注,${entry.date},${entry.type || ''},${entry.duration}\n`;
        });

        return csv;
    }

    // 清理缓存
    clearCache() {
        // 清理临时数据
        const keysToKeep = ['settings', 'userProfile', 'habits', 'moodEntries', 'focusHistory', 'trainingProgress'];
        const allKeys = Object.keys(localStorage);

        allKeys.forEach(key => {
            if (!keysToKeep.includes(key) && !key.startsWith('backup_')) {
                localStorage.removeItem(key);
            }
        });

        this.showNotification('缓存清理完成！', 'success');
    }

    // 重置所有数据
    resetAllData() {
        if (confirm('确定要重置所有数据吗？此操作不可撤销！')) {
            if (confirm('数据将被永久删除，请再次确认！')) {
                localStorage.clear();
                this.showNotification('数据重置完成！即将刷新页面...', 'success');
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        }
    }

    // 删除账户
    deleteAccount() {
        if (confirm('确定要删除账户吗？所有数据将被永久删除！')) {
            if (confirm('此操作不可撤销，请再次确认！')) {
                localStorage.clear();
                this.showNotification('账户已删除！即将跳转到首页...', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            }
        }
    }

    // 显示通知
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#00b894' : type === 'error' ? '#e74c3c' : '#74b9ff'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // 获取设置
    getSettings() {
        return this.settings;
    }

    // 更新设置
    updateSetting(key, value) {
        this.settings[key] = value;
        this.saveSettings();
        this.applySettingChange(key, value);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.settingsManager = new SettingsManager();
});

// 添加CSS动画
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