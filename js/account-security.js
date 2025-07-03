// 账户安全管理功能
class AccountSecurity {
    constructor() {
        this.securitySettings = this.loadSecuritySettings();
        this.twoFactorEnabled = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupPasswordValidation();
        this.loadSecurityStatus();
    }

    // 加载安全设置
    loadSecuritySettings() {
        const defaultSettings = {
            loginNotifications: true,
            anomalyDetection: true,
            autoLock: false,
            sessionTimeout: 30,
            twoFactorEnabled: false,
            backupCodes: []
        };

        return { ...defaultSettings, ...JSON.parse(localStorage.getItem('securitySettings') || '{}') };
    }

    // 绑定事件
    bindEvents() {
        // 密码表单
        document.getElementById('passwordForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.changePassword();
        });

        // 密码强度检测
        document.getElementById('newPassword')?.addEventListener('input', (e) => {
            this.checkPasswordStrength(e.target.value);
        });

        // 全局函数供HTML调用
        window.enableTwoFactor = () => this.enableTwoFactor();
        window.disableTwoFactor = () => this.disableTwoFactor();
        window.regenerateCodes = () => this.regenerateBackupCodes();
        window.logoutAllDevices = () => this.logoutAllDevices();
    }

    // 设置密码验证
    setupPasswordValidation() {
        const confirmPassword = document.getElementById('confirmPassword');
        const newPassword = document.getElementById('newPassword');

        if (confirmPassword && newPassword) {
            confirmPassword.addEventListener('input', () => {
                this.validatePasswordMatch();
            });
        }
    }

    // 加载安全状态
    loadSecurityStatus() {
        this.twoFactorEnabled = this.securitySettings.twoFactorEnabled;
        this.updateTwoFactorDisplay();
    }

    // 检查密码强度
    checkPasswordStrength(password) {
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');

        if (!strengthFill || !strengthText) return;

        let score = 0;
        let feedback = '';
        let color = '';

        if (password.length === 0) {
            feedback = '请输入新密码';
            color = '#e0e0e0';
        } else if (password.length < 6) {
            score = 20;
            feedback = '密码太短';
            color = '#e74c3c';
        } else {
            // 长度分数
            if (password.length >= 8) score += 25;
            if (password.length >= 12) score += 10;

            // 字符类型分数
            if (/[a-z]/.test(password)) score += 15;
            if (/[A-Z]/.test(password)) score += 15;
            if (/[0-9]/.test(password)) score += 15;
            if (/[^A-Za-z0-9]/.test(password)) score += 20;

            if (score < 40) {
                feedback = '密码强度：弱';
                color = '#e74c3c';
            } else if (score < 70) {
                feedback = '密码强度：中等';
                color = '#fdcb6e';
            } else {
                feedback = '密码强度：强';
                color = '#00b894';
            }
        }

        strengthFill.style.width = score + '%';
        strengthFill.style.backgroundColor = color;
        strengthText.textContent = feedback;
        strengthText.style.color = color;
    }

    // 验证密码匹配
    validatePasswordMatch() {
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword');

        if (confirmPassword.value && newPassword !== confirmPassword.value) {
            confirmPassword.setCustomValidity('密码不匹配');
            confirmPassword.style.borderColor = '#e74c3c';
        } else {
            confirmPassword.setCustomValidity('');
            confirmPassword.style.borderColor = '#e0e0e0';
        }
    }

    // 修改密码
    changePassword() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // 验证当前密码（简化验证）
        const savedPassword = localStorage.getItem('userPassword') || 'password123';
        if (currentPassword !== savedPassword) {
            this.showNotification('当前密码错误', 'error');
            return;
        }

        // 验证新密码
        if (newPassword.length < 6) {
            this.showNotification('新密码至少需要6个字符', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            this.showNotification('两次输入的密码不一致', 'error');
            return;
        }

        // 保存新密码
        localStorage.setItem('userPassword', newPassword);

        // 清空表单
        document.getElementById('passwordForm').reset();

        // 重置密码强度显示
        document.getElementById('strengthFill').style.width = '0%';
        document.getElementById('strengthText').textContent = '请输入新密码';

        this.showNotification('密码修改成功！', 'success');

        // 记录安全日志
        this.logSecurityEvent('密码已更新');
    }

    // 启用两步验证
    enableTwoFactor() {
        // 生成备用码
        const backupCodes = this.generateBackupCodes();

        this.securitySettings.twoFactorEnabled = true;
        this.securitySettings.backupCodes = backupCodes;
        this.twoFactorEnabled = true;

        this.saveSecuritySettings();
        this.updateTwoFactorDisplay();

        this.showNotification('两步验证已启用！', 'success');
        this.logSecurityEvent('启用了两步验证');
    }

    // 禁用两步验证
    disableTwoFactor() {
        if (confirm('确定要禁用两步验证吗？这会降低你的账户安全性。')) {
            this.securitySettings.twoFactorEnabled = false;
            this.securitySettings.backupCodes = [];
            this.twoFactorEnabled = false;

            this.saveSecuritySettings();
            this.updateTwoFactorDisplay();

            this.showNotification('两步验证已禁用', 'warning');
            this.logSecurityEvent('禁用了两步验证');
        }
    }

    // 重新生成备用码
    regenerateBackupCodes() {
        if (confirm('重新生成备用码将使之前的备用码失效，确定继续吗？')) {
            const newCodes = this.generateBackupCodes();
            this.securitySettings.backupCodes = newCodes;
            this.saveSecuritySettings();
            this.updateBackupCodesDisplay();

            this.showNotification('备用码已重新生成！', 'success');
            this.logSecurityEvent('重新生成了备用码');
        }
    }

    // 生成备用码
    generateBackupCodes() {
        const codes = [];
        for (let i = 0; i < 6; i++) {
            const code = this.generateRandomCode();
            codes.push(code);
        }
        return codes;
    }

    // 生成随机码
    generateRandomCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const part1 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        const part2 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        return `${part1}-${part2}`;
    }

    // 更新两步验证显示
    updateTwoFactorDisplay() {
        const enabledDiv = document.getElementById('twoFactorEnabled');
        const disabledDiv = document.getElementById('twoFactorDisabled');
        const section = document.getElementById('twoFactorSection');

        if (this.twoFactorEnabled) {
            if (enabledDiv) enabledDiv.style.display = 'block';
            if (disabledDiv) disabledDiv.style.display = 'none';
            if (section) section.classList.add('two-factor-enabled');
            this.updateBackupCodesDisplay();
        } else {
            if (enabledDiv) enabledDiv.style.display = 'none';
            if (disabledDiv) disabledDiv.style.display = 'block';
            if (section) section.classList.remove('two-factor-enabled');
        }
    }

    // 更新备用码显示
    updateBackupCodesDisplay() {
        const codesContainer = document.querySelector('.backup-codes');
        if (codesContainer && this.securitySettings.backupCodes.length > 0) {
            codesContainer.innerHTML = this.securitySettings.backupCodes
                .map(code => `<div class="backup-code">${code}</div>`)
                .join('');
        }
    }

    // 登出所有设备
    logoutAllDevices() {
        if (confirm('确定要登出所有其他设备吗？')) {
            // 模拟登出其他设备
            this.showNotification('已登出所有其他设备', 'success');
            this.logSecurityEvent('登出了所有其他设备');

            // 实际项目中这里应该调用API
            setTimeout(() => {
                this.refreshDeviceList();
            }, 1000);
        }
    }

    // 刷新设备列表
    refreshDeviceList() {
        // 模拟移除其他设备，只保留当前设备
        const deviceItems = document.querySelectorAll('.device-item');
        deviceItems.forEach((item, index) => {
            if (index > 0) { // 保留第一个（当前设备）
                item.style.opacity = '0.5';
                const button = item.querySelector('button');
                if (button) {
                    button.textContent = '已移除';
                    button.disabled = true;
                }
            }
        });
    }

    // 记录安全事件
    logSecurityEvent(event) {
        const securityLog = JSON.parse(localStorage.getItem('securityLog') || '[]');
        securityLog.unshift({
            event: event,
            timestamp: new Date().toISOString(),
            ip: '59.108.*.*', // 模拟IP
            userAgent: navigator.userAgent
        });

        // 只保留最近50条记录
        if (securityLog.length > 50) {
            securityLog.splice(50);
        }

        localStorage.setItem('securityLog', JSON.stringify(securityLog));
    }

    // 保存安全设置
    saveSecuritySettings() {
        localStorage.setItem('securitySettings', JSON.stringify(this.securitySettings));
    }

    // 显示通知
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#00b894' : type === 'error' ? '#e74c3c' : type === 'warning' ? '#fdcb6e' : '#74b9ff'};
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

    // 获取安全状态
    getSecurityStatus() {
        return {
            passwordSecurity: true,
            twoFactorEnabled: this.twoFactorEnabled,
            loginProtection: true,
            overallSecurity: this.twoFactorEnabled ? 'excellent' : 'good'
        };
    }

    // 获取安全建议
    getSecurityRecommendations() {
        const recommendations = [];

        if (!this.twoFactorEnabled) {
            recommendations.push('启用两步验证以增强账户安全');
        }

        if (!this.securitySettings.loginNotifications) {
            recommendations.push('启用登录通知以监控账户活动');
        }

        return recommendations;
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.accountSecurity = new AccountSecurity();
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