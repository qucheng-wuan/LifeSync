// LifeSync 登录注册功能脚本

document.addEventListener('DOMContentLoaded', function () {
    initializeAuth();
    setupFormValidation();
});

// 初始化认证功能
function initializeAuth() {
    console.log('初始化登录注册功能');

    // 检查是否已登录
    const userToken = LifeSync.Storage.get('userToken');
    if (userToken) {
        showLoggedInState();
    }
}

// 显示已登录状态
function showLoggedInState() {
    const loginContainer = document.getElementById('loginContainer');
    if (loginContainer) {
        loginContainer.innerHTML = `
            <div class="logged-in-state card">
                <h2>✅ 您已登录</h2>
                <p>欢迎回来！您已经登录LifeSync账户。</p>
                <button class="btn btn-outline" onclick="logout()">退出登录</button>
                <a href="index.html" class="btn btn-primary">返回首页</a>
            </div>
        `;
    }
}

// 显示登录表单
function showLogin() {
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('registerContainer').style.display = 'none';
    document.getElementById('forgotContainer').style.display = 'none';

    document.getElementById('loginTab').classList.add('active');
    document.getElementById('registerTab').classList.remove('active');
}

// 显示注册表单
function showRegister() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('registerContainer').style.display = 'block';
    document.getElementById('forgotContainer').style.display = 'none';

    document.getElementById('loginTab').classList.remove('active');
    document.getElementById('registerTab').classList.add('active');
}

// 显示忘记密码表单
function showForgotPassword() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('registerContainer').style.display = 'none';
    document.getElementById('forgotContainer').style.display = 'block';
}

// 处理登录
function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!username || !password) {
        LifeSync.showNotification('请填写用户名和密码', 'error');
        return;
    }

    // 模拟登录
    const userToken = 'mock_token_' + Date.now();
    LifeSync.Storage.set('userToken', userToken);
    LifeSync.Storage.set('userData', { username });

    LifeSync.showNotification('登录成功！', 'success');
    setTimeout(() => window.location.href = 'index.html', 1000);
}

// 处理注册
function handleRegister(event) {
    event.preventDefault();

    const formData = {
        email: document.getElementById('registerEmail').value.trim(),
        username: document.getElementById('registerUsername').value.trim(),
        bio: document.getElementById('bio').value.trim(),
        agreement: document.getElementById('agreement').checked
    };

    if (!validateRegistrationForm(formData)) {
        return;
    }

    // 🚨 存储型XSS测试点：直接存储用户输入
    const userProfile = {
        username: formData.username,
        email: formData.email,
        bio: formData.bio, // 潜在的XSS代码存储点
        registrationTime: new Date().toISOString()
    };

    LifeSync.Storage.set('userProfile', userProfile);
    LifeSync.Storage.set('userToken', 'mock_token_' + Date.now());

    LifeSync.showNotification('注册成功！', 'success');

    // 显示存储型XSS演示
    setTimeout(() => showStoredXSSDemo(), 1500);
}

// 验证注册表单
function validateRegistrationForm(data) {
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        LifeSync.showNotification('请输入有效的邮箱地址', 'error');
        return false;
    }

    if (!data.username || data.username.length < 3) {
        LifeSync.showNotification('用户名至少3个字符', 'error');
        return false;
    }

    if (!data.agreement) {
        LifeSync.showNotification('请同意用户协议', 'error');
        return false;
    }

    return true;
}

// 🚨 存储型XSS演示
function showStoredXSSDemo() {
    const userProfile = LifeSync.Storage.get('userProfile');
    if (!userProfile) return;

    const demoContainer = document.createElement('div');
    demoContainer.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: white; border: 2px solid #ddd; border-radius: 10px; padding: 20px;
        max-width: 600px; z-index: 10000; box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    `;

    demoContainer.innerHTML = `
        <h3 style="color: red;">⚠️ 存储型XSS测试点</h3>
        <p>以下是存储的用户数据：</p>
        
        <div style="background: #ffeeee; padding: 15px; border-radius: 5px; margin: 10px 0;">
            <h4>🚨 不安全显示 (innerHTML)：</h4>
            <div id="unsafeDisplay"></div>
        </div>
        
        <div style="background: #eeffee; padding: 15px; border-radius: 5px; margin: 10px 0;">
            <h4>✅ 安全显示 (textContent)：</h4>
            <div id="safeDisplay"></div>
        </div>
        
        <div style="background: #f0f8ff; padding: 15px; border-radius: 5px; margin: 10px 0;">
            <h4>💡 测试说明：</h4>
            <p>在个人简介中输入XSS代码：</p>
            <code>&lt;script&gt;alert('存储型XSS')&lt;/script&gt;</code><br>
            <code>&lt;img src=x onerror=alert('XSS')&gt;</code>
        </div>
        
        <button onclick="closeXSSDemo()" class="btn btn-primary">关闭演示</button>
    `;

    document.body.appendChild(demoContainer);

    // 不安全显示（innerHTML）
    const unsafeDisplay = demoContainer.querySelector('#unsafeDisplay');
    unsafeDisplay.innerHTML = `
        用户名: ${userProfile.username}<br>
        邮箱: ${userProfile.email}<br>
        个人简介: ${userProfile.bio}
    `;

    // 安全显示（textContent）
    const safeDisplay = demoContainer.querySelector('#safeDisplay');
    safeDisplay.textContent = `用户名: ${userProfile.username}, 邮箱: ${userProfile.email}, 个人简介: ${userProfile.bio}`;

    window.currentXSSDemo = demoContainer;
}

// 关闭XSS演示
function closeXSSDemo() {
    if (window.currentXSSDemo) {
        document.body.removeChild(window.currentXSSDemo);
        window.currentXSSDemo = null;
    }
    setTimeout(() => window.location.href = 'index.html', 500);
}

// 处理忘记密码
function handleForgotPassword(event) {
    event.preventDefault();

    const email = document.getElementById('forgotEmail').value.trim();
    if (!email) {
        LifeSync.showNotification('请输入邮箱地址', 'error');
        return;
    }

    LifeSync.showNotification('重置密码链接已发送', 'success');
    setTimeout(() => showLogin(), 2000);
}

// 设置表单验证
function setupFormValidation() {
    // 字符计数器
    const bio = document.getElementById('bio');
    if (bio) {
        const counter = document.createElement('span');
        counter.className = 'char-count';
        counter.style.cssText = 'font-size: 0.8em; color: #666; display: block; text-align: right; margin-top: 5px;';
        bio.parentNode.appendChild(counter);

        bio.addEventListener('input', function () {
            const currentLength = this.value.length;
            const maxLength = this.getAttribute('maxlength') || 200;
            counter.textContent = `${currentLength}/${maxLength}`;

            if (currentLength > maxLength * 0.9) {
                counter.style.color = '#f44336';
            } else {
                counter.style.color = '#666';
            }
        });

        counter.textContent = '0/200';
    }
}

// 切换密码可见性
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.parentNode.querySelector('.password-toggle');

    if (input.type === 'password') {
        input.type = 'text';
        button.textContent = '🙈';
    } else {
        input.type = 'password';
        button.textContent = '👁️';
    }
}

// 社交登录
function loginWithWechat() {
    LifeSync.showNotification('微信登录功能开发中...', 'info');
}

function loginWithQQ() {
    LifeSync.showNotification('QQ登录功能开发中...', 'info');
}

// 显示协议
function showTerms() {
    alert('用户协议内容...\n这是演示版本的用户协议。');
}

function showPrivacy() {
    alert('隐私政策内容...\n这是演示版本的隐私政策。');
}

// 退出登录
function logout() {
    LifeSync.Storage.remove('userToken');
    LifeSync.Storage.remove('userData');
    LifeSync.showNotification('已退出登录', 'success');
    setTimeout(() => window.location.reload(), 1000);
}

// 导出全局函数
window.showLogin = showLogin;
window.showRegister = showRegister;
window.showForgotPassword = showForgotPassword;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.handleForgotPassword = handleForgotPassword;
window.togglePassword = togglePassword;
window.loginWithWechat = loginWithWechat;
window.loginWithQQ = loginWithQQ;
window.showTerms = showTerms;
window.showPrivacy = showPrivacy;
window.logout = logout;
window.closeXSSDemo = closeXSSDemo; 