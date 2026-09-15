//Version:2.0.0
//Date:2026-07-23 20:50:47

const config = {
  "notifyMessage": "您好，有人需要您挪车，请及时处理。",
  "successMessage": "您好，我已收到你的挪车通知，我正在赶来的路上，请稍等片刻！",
  "rateLimitDelay": 300,
  "rateLimitMaxRequests": 5,
  "rateLimitMessage": "我正在赶来的路上,请稍等片刻~~~",
  "canRegister": false // 是否开启注册功能
}

class MoveCarFrontend {
    constructor(config) {
        this.config = config;
    }

    loginPage() {
        const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>用户登录</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .login-container { background: white; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); padding: 40px; width: 100%; max-width: 400px; }
        @media (max-width: 768px) {
            .login-container { padding: 28px 20px; }
        }
        .login-container h2 { text-align: center; margin-bottom: 30px; color: #333; font-size: 24px; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; color: #555; font-weight: 500; }
        .form-group input { width: 100%; padding: 12px 15px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; transition: border-color 0.3s; }
        .form-group input:focus { outline: none; border-color: #667eea; }
        .login-btn { width: 100%; padding: 14px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: transform 0.2s; }
        .login-btn:hover { transform: translateY(-2px); }
        .login-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        .register-link { text-align: center; margin-top: 20px; color: #666; }
        .register-link a { color: #667eea; text-decoration: none; }
        .register-link a:hover { text-decoration: underline; }
        .toast { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.8); color: white; padding: 14px 28px; border-radius: 50px; font-size: 15px; opacity: 0; transition: opacity 0.3s; z-index: 10000; }
        .toast.show { opacity: 1; }
        .loading { display: inline-block; width: 20px; height: 20px; border: 2px solid #fff; border-radius: 50%; border-top-color: transparent; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div class="login-container">
        <h2>用户登录</h2>
        <form id="loginForm">
            <div class="form-group">
                <label>用户名</label>
                <input type="text" id="username" placeholder="请输入用户名" required>
            </div>
            <div class="form-group">
                <label>密码</label>
                <input type="password" id="password" placeholder="请输入密码" required>
            </div>
            <button type="button" class="login-btn" onclick="handleLogin()">
                <span id="btnText">登录</span>
                <span id="btnLoading" class="loading" style="display:none"></span>
            </button>
        </form>
        <div class="register-link">
            还没有账号？<a href="/register">立即注册</a>
        </div>
    </div>
    <div id="toast" class="toast"></div>
    <script>
        async function handleLogin() {
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            
            if (!username || !password) {
                showToast('请输入用户名和密码');
                return;
            }
            
            const btnText = document.getElementById('btnText');
            const btnLoading = document.getElementById('btnLoading');
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-block';
            
            try {
                const response = await fetch('/api/user/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_name: username, user_pwd: password })
                });
                const data = await response.json();
                
                if (data.code === 200) {
                    localStorage.setItem('token', data.data.token);
                    localStorage.setItem('user', JSON.stringify(data.data.user));
                    showToast('登录成功');
                    document.cookie = \`token=\${data.data.token}; path=/; max-age=604800\`;
                    setTimeout(() => {
                        window.location.href = '/admin/index';
                    }, 1500);
                } else {
                    showToast(data.data || '登录失败');
                }
            } catch (error) {
                showToast('网络错误，请重试');
            } finally {
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
            }
        }
        
        function showToast(message, duration = 3000) {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), duration);
        }
        
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            handleLogin();
        });
    </script>
</body>
</html>`;

        return new Response(htmlContent, {
            headers: { 'Content-Type': 'text/html;charset=UTF-8', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*' }
        });
    }

    registerPage() {
        if (!this.config.canRegister) {
        return new Response("注册功能关闭", {
            headers: { 'Content-Type': 'text/html;charset=UTF-8', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*' }
        });
        }
        const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>用户注册</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .register-container { background: white; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); padding: 40px; width: 100%; max-width: 400px; }
        @media (max-width: 768px) {
            .register-container { padding: 28px 20px; }
        }
        .register-container h2 { text-align: center; margin-bottom: 30px; color: #333; font-size: 24px; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; color: #555; font-weight: 500; }
        .form-group input { width: 100%; padding: 12px 15px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; transition: border-color 0.3s; }
        .form-group input:focus { outline: none; border-color: #667eea; }
        .register-btn { width: 100%; padding: 14px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: transform 0.2s; }
        .register-btn:hover { transform: translateY(-2px); }
        .register-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        .login-link { text-align: center; margin-top: 20px; color: #666; }
        .login-link a { color: #667eea; text-decoration: none; }
        .login-link a:hover { text-decoration: underline; }
        .toast { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.8); color: white; padding: 14px 28px; border-radius: 50px; font-size: 15px; opacity: 0; transition: opacity 0.3s; z-index: 10000; }
        .toast.show { opacity: 1; }
        .loading { display: inline-block; width: 20px; height: 20px; border: 2px solid #fff; border-radius: 50%; border-top-color: transparent; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div class="register-container">
        <h2>用户注册</h2>
        <form id="registerForm">
            <div class="form-group">
                <label>用户名</label>
                <input type="text" id="username" placeholder="请输入用户名" required>
            </div>
            <div class="form-group">
                <label>密码</label>
                <input type="password" id="password" placeholder="请输入密码" required>
            </div>
            <div class="form-group">
                <label>确认密码</label>
                <input type="password" id="confirmPassword" placeholder="请再次输入密码" required>
            </div>
            <button type="button" class="register-btn" onclick="handleRegister()">
                <span id="btnText">注册</span>
                <span id="btnLoading" class="loading" style="display:none"></span>
            </button>
        </form>
        <div class="login-link">
            已有账号？<a href="/login">立即登录</a>
        </div>
    </div>
    <div id="toast" class="toast"></div>
    <script>
        async function handleRegister() {
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            const confirmPassword = document.getElementById('confirmPassword').value.trim();
            
            if (!username || !password) {
                showToast('请输入用户名和密码');
                return;
            }
            
            if (password !== confirmPassword) {
                showToast('两次输入的密码不一致');
                return;
            }
            
            const btnText = document.getElementById('btnText');
            const btnLoading = document.getElementById('btnLoading');
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-block';
            
            try {
                const response = await fetch('/api/user/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_name: username, user_pwd: password })
                });
                const data = await response.json();
                
                if (data.code === 200) {
                    showToast('注册成功，即将跳转到登录页');
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 2000);
                } else {
                    showToast(data.data || '注册失败');
                }
            } catch (error) {
                showToast('网络错误，请重试');
            } finally {
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
            }
        }
        
        function showToast(message, duration = 3000) {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), duration);
        }
        
        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            handleRegister();
        });
    </script>
</body>
</html>`;

        return new Response(htmlContent, {
            headers: { 'Content-Type': 'text/html;charset=UTF-8', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*' }
        });
    }

    adminIndexPage() {
        const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>车辆管理</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f7fa; }
        .navbar { background: #343a40; padding: 12px 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .navbar-container { max-width: 1400px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
        .navbar-brand { color: #fff; font-size: 18px; font-weight: 600; text-decoration: none; }
        .navbar-menu { display: flex; gap: 5px; }
        .nav-item { color: #fff; padding: 8px 16px; text-decoration: none; border-radius: 4px; transition: background 0.3s; font-size: 14px; }
        .nav-item:hover { background: rgba(255,255,255,0.1); }
        .nav-item.active { background: #007bff; }
        .nav-item.logout { color: #dc3545; }
        .nav-item.logout:hover { background: rgba(220,53,69,0.2); }
        .container { max-width: 1400px; margin: 0 auto; padding: 20px; }
        @media (max-width: 768px) {
            .container { padding: 12px; }
            .navbar { padding: 10px 12px; }
            .navbar-container { flex-wrap: wrap; gap: 6px; }
            .navbar-menu { overflow-x: auto; -webkit-overflow-scrolling: touch; flex-wrap: nowrap; }
            .navbar-menu::-webkit-scrollbar { display: none; }
            .nav-item { white-space: nowrap; padding: 8px 12px; font-size: 13px; }
            .header { flex-direction: column; align-items: stretch; gap: 10px; }
            .header .actions { display: flex; gap: 8px; }
            .header .actions .btn { flex: 1; }
            .table-container { overflow-x: auto; -webkit-overflow-scrolling: touch; }
            table { min-width: 760px; }
            .modal-content { max-width: 94vw; padding: 16px; }
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="navbar-container">
            <a href="/admin/index" class="navbar-brand">挪车通知系统</a>
            <div class="navbar-menu">
                <a href="/admin/cars" class="nav-item" id="nav-car">车辆管理</a>
                <a href="/admin/users" class="nav-item" id="nav-user">用户管理</a>
                <a href="/admin/templates" class="nav-item" id="nav-template">模板管理</a>
                <a href="/admin/notify" class="nav-item" id="nav-notify">通知管理</a>
                <a href="javascript:void(0)" class="nav-item logout" onclick="loginOut()">注销登录</a>
            </div>
        </div>
    </nav>
    <div class="container">
        <h1>欢迎使用挪车通知系统</h1>
    </div>

</body>
</html>`;

        return new Response(htmlContent, {
            headers: { 'Content-Type': 'text/html;charset=UTF-8', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*' }
        });
    }

    carManagerPage() {
        const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>车辆管理</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f7fa; }
        .navbar { background: #343a40; padding: 12px 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .navbar-container { max-width: 1400px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
        .navbar-brand { color: #fff; font-size: 18px; font-weight: 600; text-decoration: none; }
        .navbar-menu { display: flex; gap: 5px; }
        .nav-item { color: #fff; padding: 8px 16px; text-decoration: none; border-radius: 4px; transition: background 0.3s; font-size: 14px; }
        .nav-item:hover { background: rgba(255,255,255,0.1); }
        .nav-item.active { background: #007bff; }
        .nav-item.logout { color: #dc3545; }
        .nav-item.logout:hover { background: rgba(220,53,69,0.2); }
        .container { max-width: 1400px; margin: 0 auto; padding: 20px; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .header h1 { color: #333; font-size: 24px; }
        .header .actions { display: flex; gap: 10px; }
        .btn { padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: background 0.3s; }
        .add-btn { background: #007bff; color: white; }
        .add-btn:hover { background: #0056b3; }
        .back-btn { background: #6c757d; color: white; }
        .back-btn:hover { background: #5a6268; }
        .table-container { background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #eee; }
        th { background: #f8f9fa; font-weight: 600; color: #495057; }
        tr:hover { background: #f8f9fa; }
        .edit-btn { background: #28a745; color: white; padding: 6px 12px; font-size: 12px; }
        .edit-btn:hover { background: #218838; }
        .notify-btn { background: #1c53ca; color: white; padding: 6px 12px; font-size: 12px; }
        .notify-btn:hover { background: #473bb8; }        
        .qr-btn { background: #6f42c1; color: white; padding: 6px 12px; font-size: 12px; }
        .qr-btn:hover { background: #5a32a3; }
        .delete-btn { background: #dc3545; color: white; padding: 6px 12px; font-size: 12px; }
        .delete-btn:hover { background: #c82333; }
        .status-active { color: #28a745; font-weight: 600; }
        .status-disabled { color: #dc3545; font-weight: 600; }
        .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); justify-content: center; align-items: center; z-index: 1000; }
        .modal-content { background: white; border-radius: 8px; padding: 24px; width: 90%; max-width: 500px; max-height: 90vh; overflow-y: auto; }
        .modal-content h2 { margin-bottom: 20px; font-size: 18px; }
        .form-group { margin-bottom: 15px; }
        .form-group label { display: block; margin-bottom: 5px; font-weight: 600; }
        .form-group textarea { height: 100px; font-family: monospace; }
        .form-group input, .form-group select,.form-group textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; }
        .form-group input:focus, .form-group select:focus,.form-group textarea:focus { outline: none; border-color: #007bff; }
        .form-group .checkbox-group { display: flex; align-items: center; gap: 10px; }
        .form-group .checkbox-group input { width: auto; }
        .form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
        .cancel-btn { background: #6c757d; color: #fff; }
        .cancel-btn:hover { background: #5a6268; }
        .toast { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.8); color: white; padding: 12px 24px; border-radius: 50px; font-size: 16px; opacity: 0; transition: opacity 0.3s; z-index: 9999; }
        .toast.show { opacity: 1; }
        .no-wrap { white-space: nowrap; }
        .tip-box { margin-top: 8px; padding: 10px; background: #f8f9fa; border-radius: 4px; font-size: 12px; color: #666; border-left: 3px solid #007bff; display: none; }
        .tip-box.show { display: block; }
        .loading-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.8); display: flex; justify-content: center; align-items: center; z-index: 9999; }
        .loading-spinner { width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #007bff; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .btn-loading { position: relative; pointer-events: none; opacity: 0.7; }
        .btn-loading::after { content: ''; position: absolute; right: 10px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; border: 2px solid #fff; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @media (max-width: 768px) {
            .container { padding: 12px; }
            .navbar { padding: 10px 12px; }
            .navbar-container { flex-wrap: wrap; gap: 6px; }
            .navbar-menu { overflow-x: auto; -webkit-overflow-scrolling: touch; flex-wrap: nowrap; }
            .navbar-menu::-webkit-scrollbar { display: none; }
            .nav-item { white-space: nowrap; padding: 8px 12px; font-size: 13px; }
            .header { flex-direction: column; align-items: stretch; gap: 10px; }
            .header .actions { display: flex; gap: 8px; }
            .header .actions .btn { flex: 1; }
            .table-container { overflow-x: auto; -webkit-overflow-scrolling: touch; }
            table { min-width: 760px; }
            .modal-content { max-width: 94vw; padding: 16px; }
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="navbar-container">
            <a href="/admin/index" class="navbar-brand">挪车通知系统</a>
            <div class="navbar-menu">
                <a href="/admin/cars" class="nav-item active" id="nav-car">车辆管理</a>
                <a href="/admin/users" class="nav-item" id="nav-user">用户管理</a>
                <a href="/admin/templates" class="nav-item" id="nav-template">模板管理</a>
                <a href="/admin/notify" class="nav-item" id="nav-notify">通知管理</a>
                <a href="javascript:void(0)" class="nav-item logout" onclick="loginOut()">注销登录</a>
            </div>
        </div>
    </nav>
    <div class="container">
        <div class="header">
            <h1>车辆管理</h1>
            <div class="actions">
                <button class="btn add-btn" onclick="getCarList()">刷新列表</button>
                <button class="btn add-btn" onclick="showAddModal()">添加车辆</button>
            </div>
        </div>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>车牌号</th>
                        <th>手机号</th>
                        <th>通知名称</th>
                        <th>消息通知</th>
                        <th>电话通知</th>
                        <th>模板名称</th>
                        <th>添加账号</th>
                        <th>状态</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody id="carTable">
                </tbody>
            </table>
        </div>
    </div>
    <div id="loadingOverlay" class="loading-overlay" style="display: none;">
        <div class="loading-spinner"></div>
    </div>
    <div id="modal" class="modal">
        <div class="modal-content">
            <h2 id="modalTitle">添加车辆</h2>
            <form id="carForm">
                <input type="hidden" id="formId">
                <div class="form-group">
                    <label>车牌号</label>
                    <input type="text" id="formNo" placeholder="请输入车牌号">
                </div>
                <div class="form-group">
                    <label>手机号</label>
                    <input type="text" id="formPhone" placeholder="请输入手机号">
                </div>
                <div class="form-group">
                    <label>通知类型</label>
                    <select id="formNotifyId">
                        <option value="">请选择通知类型</option>
                    </select>
                    <div id="notifyTip" class="tip-box"></div>
                </div>
                <div class="form-group">
                    <label>AppToken（应用令牌）</label>
                    <input type="text" id="formAppToken" placeholder="WxPusher 的 appToken，例如：AT_xxxxxxxx">
                </div>
                <div class="form-group">
                    <label>UID（接收用户ID）</label>
                    <input type="text" id="formUid" placeholder="WxPusher 的 uid，例如：UID_xxxxxxxx">
                </div>
                <div class="form-group">
                    <div class="checkbox-group">
                        <input type="checkbox" id="formIsNotify" checked>
                        <label for="formIsNotify">启用消息通知</label>
                    </div>
                </div>
                <div class="form-group">
                    <div class="checkbox-group">
                        <input type="checkbox" id="formIsCall" checked>
                        <label for="formIsCall">启用电话通知</label>
                    </div>
                </div>
                <div class="form-group">
                    <label>模板</label>
                    <select id="formTemplateId">
                        <option value="">请选择模板</option>
                    </select>
                </div>
                <div class="form-group">
                    <div class="checkbox-group">
                        <input type="checkbox" id="formStatus" checked>
                        <label for="formStatus">启用车辆</label>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn cancel-btn" onclick="closeModal()">取消</button>
                    <button type="button" class="btn add-btn" onclick="saveCar()">保存</button>
                </div>
            </form>
        </div>
    </div>
    <div id="toast" class="toast"></div>
    <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/qr-code-styling@1.6.0-rc.1/lib/qr-code-styling.js"></script>
    <!-- 二维码弹窗 -->
    <div id="qrModal" class="modal">
        <div class="modal-content" style="max-width:400px;text-align:center;">
            <div id="qrCard">
                <div class="qr-card-top"><span style="font-size:18px;">🚗</span> 扫码联系车主挪车</div>
                <div class="qr-car-no" id="qrCarNo"></div>
                <div id="qrCanvasBox" style="display:flex;justify-content:center;margin:6px 0 10px;"></div>
                <div class="qr-tip">请扫码联系我挪车</div>
                <div class="qr-sub">文明沟通 · 方便你我</div>
            </div>
            <p id="qrUrlText" style="word-break:break-all;font-size:12px;color:#9ca3af;margin:10px 0 0;"></p>
            <div id="qrActions" style="display:flex;gap:10px;margin-top:12px;">
                <button type="button" class="btn add-btn" style="flex:1;" onclick="window.print()">🖨 打印</button>
                <button type="button" class="btn cancel-btn" style="flex:1;" onclick="closeQrModal()">关闭</button>
            </div>
        </div>
    </div>
    <style>
        #qrCard { background: #fff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
        .qr-card-top { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #fff; padding: 14px; font-size: 16px; font-weight: 600; letter-spacing: 1px; }
        .qr-car-no { font-size: 26px; font-weight: 700; color: #111827; letter-spacing: 4px; padding: 14px 0 4px; }
        .qr-tip { font-size: 15px; color: #374151; font-weight: 600; padding: 2px 0; }
        .qr-sub { font-size: 12px; color: #9ca3af; padding: 2px 0 14px; }
        @media print {
            body * { visibility: hidden; }
            #qrModal, #qrModal * { visibility: visible; }
            #qrModal { display: flex !important; position: fixed; inset: 0; background: #fff; }
            #qrModal .modal-content { box-shadow: none; max-width: 100%; padding: 16px; }
            #qrUrlText, #qrActions { display: none !important; }
        }
    </style>
    <script>
        let notifyDataList = [];
        let templateDataList = [];

        function showLoading() { document.getElementById('loadingOverlay').style.display = 'flex'; }
        function hideLoading() { document.getElementById('loadingOverlay').style.display = 'none'; }
        function setBtnLoading(btn, loading) { loading ? btn.classList.add('btn-loading') : btn.classList.remove('btn-loading'); }

        async function getNotifyList() {
            const token = localStorage.getItem('token');
            if (!token) { return; }
            const response = await fetch('/api/notifyList', { method: 'POST', headers: { 'Authorization': 'Bearer ' + token } });
            const data = await response.json();
            if (data.code === 200) {
                notifyDataList = data.data;
                const notifySelect = document.getElementById('formNotifyId');
                notifySelect.innerHTML = '<option value="">请选择通知类型</option>';
                data.data.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.id;
                    option.textContent = item.name;
                    option.dataset.tip = item.tip || '';
                    notifySelect.appendChild(option);
                });
            } else {
                showToast(data.data || '获取通知列表失败');
            }
        }

        async function getTemplateList() {
            const token = localStorage.getItem('token');
            if (!token) { return; }
            const response = await fetch('/api/templateList', { method: 'POST', headers: { 'Authorization': 'Bearer ' + token } });
            const data = await response.json();
            if (data.code === 200) {
                templateDataList = data.data;
                const templateSelect = document.getElementById('formTemplateId');
                templateSelect.innerHTML = '<option value="">请选择模板</option>';
                data.data.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.id;
                    option.textContent = item.name;
                    templateSelect.appendChild(option);
                });
            } else {
                showToast(data.data || '获取模板列表失败');
            }
        }

        function updateNotifyTip() {
            const notifySelect = document.getElementById('formNotifyId');
            const tipBox = document.getElementById('notifyTip');
            const selectedOption = notifySelect.options[notifySelect.selectedIndex];
            const tip = selectedOption ? selectedOption.dataset.tip : '';
            if (tip) {
                tipBox.textContent = tip;
                tipBox.classList.add('show');
            } else {
                tipBox.classList.remove('show');
            }
        }
        function showQrModal(carId, carNo) {
            var url = 'https://carq.pages.dev/car/' + carId;
            document.getElementById('qrCarNo').textContent = carNo || '';
            document.getElementById('qrUrlText').textContent = url;
            var box = document.getElementById('qrCanvasBox');
            box.innerHTML = '';
            var done = false;
            if (typeof QRCodeStyling !== 'undefined') {
                try {
                    var qr = new QRCodeStyling({
                        width: 240, height: 240, margin: 0, data: url,
                        dotsOptions: { color: '#2563eb', type: 'rounded' },
                        cornersSquareOptions: { color: '#1d4ed8', type: 'extra-rounded' },
                        cornersDotOptions: { color: '#3b82f6', type: 'dot' },
                        backgroundOptions: { color: '#ffffff' }
                    });
                    qr.append(box);
                    done = true;
                } catch (e) { box.innerHTML = ''; }
            }
            if (!done && typeof QRCode !== 'undefined') {
                try {
                    var canvas = document.createElement('canvas');
                    box.appendChild(canvas);
                    QRCode.toCanvas(canvas, url, { width: 240, margin: 2, color: { dark: '#2563eb', light: '#ffffff' } }, function(err) {
                        if (err) { box.innerHTML = '<div style="font-size:13px;color:#c00;">二维码生成失败</div>'; }
                    });
                    done = true;
                } catch (e) { box.innerHTML = ''; }
            }
            if (!done) {
                box.innerHTML = '<div style="font-size:13px;color:#c00;line-height:1.8;">二维码组件加载失败<br>请复制下方链接到 <a href="https://cli.im" target="_blank">草料二维码</a> 生成</div>';
            }
            document.getElementById('qrModal').style.display = 'flex';
        }
        function closeQrModal() {
            document.getElementById('qrModal').style.display = 'none';
        }
        document.getElementById('qrModal').addEventListener('click', function(e) {
            if (e.target === this) { closeQrModal(); }
        });
        async function getCarList() {
            const token = localStorage.getItem('token');
            if (!token) { window.location.href = '/login'; return; }
            showLoading();
            try {
                const response = await fetch('/api/car/list', { method:'POST', headers: { 'Authorization': 'Bearer ' + token } });
                const data = await response.json();
                if (data.code === 200) { renderTable(data.data); }
                else { showToast(data.data || '获取列表失败'); }
            } catch (error) {
                showToast('网络错误，请重试');
            } finally {
                hideLoading();
            }
        }
        function renderTable(data) {
            const tbody = document.getElementById('carTable');
            tbody.innerHTML = data.map(item => \`
                <tr>
                    <td><a target="_blank" href="/car/\${item.id}">\${item.id}</a></td>
                    <td>\${item.no || '-'}</td>
                    <td>\${item.phone || '-'}</td>
                    <td>\${item.notify_name || '-'}</td>
                    <td><span class="\${item.is_notify === 1 ? 'status-active' : 'status-disabled'}">\${item.is_notify === 1 ? '是' : '否'}</span></td>
                    <td><span class="\${item.is_call === 1 ? 'status-active' : 'status-disabled'}">\${item.is_call === 1 ? '是' : '否'}</span></td>
                    <td>\${item.template_name || '-'}</td>
                    <td>\${item.user_name || '-'}</td>
                    <td><span class="\${item.status === 1 ? 'status-active' : 'status-disabled'}">\${item.status === 1 ? '启用' : '禁用'}</span></td>
                    <td>
                        <button class="btn notify-btn" onclick="notifyMessage('\${item.id}')">通知</button>
                        <button class="btn qr-btn" onclick="showQrModal('\${item.id}', '\${item.no || ''}')">二维码</button>
                        <button class="btn edit-btn" onclick="showEditModal('\${item.id}')">编辑</button>
                        <button class="btn delete-btn" onclick="deleteCar('\${item.id}')">删除</button>
                    </td>
                </tr>
            \`).join('');
        }
        function showAddModal() {
            document.getElementById('modalTitle').textContent = '添加车辆';
            document.getElementById('formId').value = '';
            document.getElementById('formNo').value = '';
            document.getElementById('formPhone').value = '';
            document.getElementById('formNotifyId').value = '';
            document.getElementById('formAppToken').value = '';
            document.getElementById('formUid').value = '';
            document.getElementById('notifyTip').classList.remove('show');
            document.getElementById('formIsNotify').checked = true;
            document.getElementById('formIsCall').checked = true;
            document.getElementById('formTemplateId').value = '';
            document.getElementById('formStatus').checked = true;
            document.getElementById('modal').style.display = 'flex';
        }
        
        async function notifyMessage(id){
            showLoading();
            try {
                const response = await fetch('/api/notify/message', { method:'POST', body: JSON.stringify({ id,message:"" }) });
                const data = await response.json();
                if (data.code === 200) {
                    showToast(data.data);
                } else {
                    showToast(data.message);
                }     
            } catch (error) {
                showToast('网络错误，请重试');
            } finally {
                hideLoading();
            }
        }
        async function showEditModal(id) {
            const token = localStorage.getItem('token');
            if (!token) { window.location.href = '/login'; return; }
            showLoading();
            try {
                const response = await fetch('/api/car/get', { method:'POST', body: JSON.stringify({ id }), headers: { 'Authorization': 'Bearer ' + token } });
                const data = await response.json();
                if (data.code === 200) {
                    const item = data.data;
                    if (item) {
                        document.getElementById('modalTitle').textContent = '编辑车辆';
                        document.getElementById('formId').value = item.id;
                        document.getElementById('formNo').value = item.no || '';
                        document.getElementById('formPhone').value = item.phone || '';
                        document.getElementById('formNotifyId').value = item.notify_id || '';
                        const tokenObj = (() => {
                            try { const o = JSON.parse(item.notify_token || '{}'); return o && typeof o === 'object' ? o : {}; } catch (e) { return {}; }
                        })();
                        document.getElementById('formAppToken').value = tokenObj.appToken || '';
                        document.getElementById('formUid').value = tokenObj.uid || '';
                        document.getElementById('formIsNotify').checked = item.is_notify === 1;
                        document.getElementById('formIsCall').checked = item.is_call === 1;
                        document.getElementById('formTemplateId').value = item.template_id || '';
                        document.getElementById('formStatus').checked = item.status === 1;
                        setTimeout(updateNotifyTip, 10);
                        document.getElementById('modal').style.display = 'flex';
                    }
                } else {
                    showToast(data.data || '获取车辆信息失败');
                }
            } catch (error) {
                showToast('网络错误，请重试');
            } finally {
                hideLoading();
            }
        }
        function closeModal() { document.getElementById('modal').style.display = 'none'; }
        async function saveCar() {
            const token = localStorage.getItem('token');
            if (!token) { window.location.href = '/login'; return; }
            const id = document.getElementById('formId').value;
            const no = document.getElementById('formNo').value.trim();
            if (!no) { showToast('请输入车牌号'); return; }
            
            const notifyId = document.getElementById('formNotifyId').value;
            const notifyItem = notifyDataList.find(n => n.id == notifyId);
            const notifyName = notifyItem ? notifyItem.name : '';
            
            const templateId = document.getElementById('formTemplateId').value;
            const templateItem = templateDataList.find(t => t.id == templateId);
            const templateName = templateItem ? templateItem.name : '';
            
            const data = {
                id,
                no,
                phone: document.getElementById('formPhone').value.trim(),
                notify_id: notifyId || 0,
                notify_name: notifyName,
                notify_token: (() => {
                    const appToken = document.getElementById('formAppToken').value.trim();
                    const uid = document.getElementById('formUid').value.trim();
                    if (appToken || uid) { return JSON.stringify({ appToken: appToken, uid: uid }); }
                    return '';
                })(),
                is_notify: document.getElementById('formIsNotify').checked ? 1 : 0,
                is_call: document.getElementById('formIsCall').checked ? 1 : 0,
                template_id: templateId || 0,
                template_name: templateName,
                status: document.getElementById('formStatus').checked ? 1 : 0,
            };
            
            showLoading();
            
            try {
                const url = id ? '/api/car/update' : '/api/car/add';
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (result.code === 200) {
                    showToast(id ? '更新成功' : '添加成功');
                    closeModal();
                    getCarList();
                } else {
                    showToast(result.data || '操作失败');
                }
            } catch (error) {
                showToast('网络错误，请重试');
            } finally {
                hideLoading();
            }
        }
        async function deleteCar(id) {
            if (!confirm('确定要删除该车辆吗？')) return;
            showLoading();
            const token = localStorage.getItem('token');
            if (!token) { window.location.href = '/login'; return; }
            try {
                const response = await fetch('/api/car/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify({ id })
                });
                const data = await response.json();
                if (data.code === 200) { showToast('删除成功'); getCarList(); }
                else { showToast(data.data || '删除失败'); }
            } catch (error) {
                showToast('网络错误，请重试');
            } finally {
                hideLoading();
            }
        }
        function loginOut() { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href = '/login'; }
        function showToast(message, duration = 3000) {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), duration);
        }
        document.addEventListener('DOMContentLoaded', () => {
            if (!localStorage.getItem('token')) { window.location.href = '/login'; return; }
            getNotifyList();
            getTemplateList();
            getCarList();
            
            document.getElementById('formNotifyId').addEventListener('change', updateNotifyTip);
        });
        document.getElementById('modal').addEventListener('click', (e) => {
            //if (e.target === document.getElementById('modal')) closeModal();
        });
    </script>
</body>
</html>`;

        return new Response(htmlContent, {
            headers: { 'Content-Type': 'text/html;charset=UTF-8', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*' }
        });
    }

    userManagerPage() {
        const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>用户管理</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f7fa; }
        .navbar { background: #343a40; padding: 12px 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .navbar-container { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
        .navbar-brand { color: #fff; font-size: 18px; font-weight: 600; text-decoration: none; }
        .navbar-menu { display: flex; gap: 5px; }
        .nav-item { color: #fff; padding: 8px 16px; text-decoration: none; border-radius: 4px; transition: background 0.3s; font-size: 14px; }
        .nav-item:hover { background: rgba(255,255,255,0.1); }
        .nav-item.active { background: #007bff; }
        .nav-item.logout { color: #dc3545; }
        .nav-item.logout:hover { background: rgba(220,53,69,0.2); }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .header h1 { color: #333; font-size: 24px; }
        .header .actions { display: flex; gap: 10px; }
        .btn { padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: background 0.3s; }
        .add-btn { background: #007bff; color: white; }
        .add-btn:hover { background: #0056b3; }
        .back-btn { background: #6c757d; color: white; }
        .back-btn:hover { background: #5a6268; }
        .table-container { background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #eee; }
        th { background: #f8f9fa; font-weight: 600; color: #495057; }
        tr:hover { background: #f8f9fa; }
        .edit-btn { background: #28a745; color: white; padding: 6px 12px; font-size: 12px; }
        .edit-btn:hover { background: #218838; }
        .delete-btn { background: #dc3545; color: white; padding: 6px 12px; font-size: 12px; }
        .delete-btn:hover { background: #c82333; }
        .status-active { color: #28a745; font-weight: 600; }
        .status-disabled { color: #dc3545; font-weight: 600; }
        .role-admin { color: #dc3545; }
        .role-user { color: #28a745; }
        .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); justify-content: center; align-items: center; z-index: 1000; }
        .modal-content { background: white; border-radius: 8px; padding: 24px; width: 90%; max-width: 450px; }
        .modal-content h2 { margin-bottom: 20px; font-size: 18px; }
        .form-group { margin-bottom: 15px; }
        .form-group label { display: block; margin-bottom: 5px; font-weight: 600; }
        .form-group input, .form-group select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; }
        .form-group input:focus, .form-group select:focus { outline: none; border-color: #007bff; }
        .form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
        .cancel-btn { background: #6c757d; color: #fff; }
        .cancel-btn:hover { background: #5a6268; }
        .toast { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.8); color: white; padding: 12px 24px; border-radius: 50px; font-size: 16px; opacity: 0; transition: opacity 0.3s; z-index: 9999; }
        .toast.show { opacity: 1; }
        .loading-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.8); display: flex; justify-content: center; align-items: center; z-index: 9999; }
        .loading-spinner { width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #007bff; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .btn-loading { position: relative; pointer-events: none; opacity: 0.7; }
        .btn-loading::after { content: ''; position: absolute; right: 10px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; border: 2px solid #fff; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @media (max-width: 768px) {
            .container { padding: 12px; }
            .navbar { padding: 10px 12px; }
            .navbar-container { flex-wrap: wrap; gap: 6px; }
            .navbar-menu { overflow-x: auto; -webkit-overflow-scrolling: touch; flex-wrap: nowrap; }
            .navbar-menu::-webkit-scrollbar { display: none; }
            .nav-item { white-space: nowrap; padding: 8px 12px; font-size: 13px; }
            .header { flex-direction: column; align-items: stretch; gap: 10px; }
            .header .actions { display: flex; gap: 8px; }
            .header .actions .btn { flex: 1; }
            .table-container { overflow-x: auto; -webkit-overflow-scrolling: touch; }
            table { min-width: 760px; }
            .modal-content { max-width: 94vw; padding: 16px; }
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="navbar-container">
            <a href="/admin/index" class="navbar-brand">挪车通知系统</a>
            <div class="navbar-menu">
                <a href="/admin/cars" class="nav-item" id="nav-car">车辆管理</a>
                <a href="/admin/users" class="nav-item active" id="nav-user">用户管理</a>
                <a href="/admin/templates" class="nav-item" id="nav-template">模板管理</a>
                <a href="/admin/notify" class="nav-item" id="nav-notify">通知管理</a>
                <a href="javascript:void(0)" class="nav-item logout" onclick="loginOut()">注销登录</a>
            </div>
        </div>
    </nav>
    <div class="container">
        <div class="header">
            <h1>用户管理</h1>
            <div class="actions">
                <button class="btn add-btn" onclick="getUserList()">刷新列表</button>
                <button class="btn add-btn" onclick="showAddModal()">添加用户</button>
            </div>
        </div>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>用户名</th>
                        <th>权限</th>
                        <th>状态</th>
                        <th>创建时间</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody id="userTable">
                </tbody>
            </table>
        </div>
    </div>
    <div id="loadingOverlay" class="loading-overlay" style="display: none;">
        <div class="loading-spinner"></div>
    </div>
    <div id="modal" class="modal">
        <div class="modal-content">
            <h2 id="modalTitle">添加用户</h2>
            <form id="userForm">
                <input type="hidden" id="formId">
                <div class="form-group">
                    <label>用户名</label>
                    <input type="text" id="formUsername" placeholder="请输入用户名">
                </div>
                <div class="form-group">
                    <label>密码</label>
                    <input type="password" id="formPassword" placeholder="请输入密码（编辑时可不填）">
                </div>
                <div class="form-group">
                    <label>权限</label>
                    <select id="formRole">
                        <option value="1">管理员</option>
                        <option value="2">普通用户</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>状态</label>
                    <select id="formStatus">
                        <option value="1">启用</option>
                        <option value="0">禁用</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn cancel-btn" onclick="closeModal()">取消</button>
                    <button type="button" class="btn add-btn" onclick="saveUser()">保存</button>
                </div>
            </form>
        </div>
    </div>
    <div id="toast" class="toast"></div>
    <script>
        function showLoading() { document.getElementById('loadingOverlay').style.display = 'flex'; }
        function hideLoading() { document.getElementById('loadingOverlay').style.display = 'none'; }
        function setBtnLoading(btn, loading) { loading ? btn.classList.add('btn-loading') : btn.classList.remove('btn-loading'); }

        async function getUserList() {
            const token = localStorage.getItem('token');
            if (!token) { window.location.href = '/login'; return; }
            showLoading();
            try {
                const response = await fetch('/api/user/list', { method:'POST',headers: { 'Authorization': 'Bearer ' + token } });
                const data = await response.json();
                if (data.code === 200) { renderTable(data.data); }
                else { showToast(data.data || '获取列表失败'); }
            } catch (error) {
                showToast('网络错误，请重试');
            } finally {
                hideLoading();
            }
        }
        function renderTable(data) {
            const tbody = document.getElementById('userTable');
            tbody.innerHTML = data.map(item => \`
                <tr>
                    <td>\${item.id}</td>
                    <td>\${item.user_name}</td>
                    <td><span class="\${item.user_role === 1 ? 'role-admin' : 'role-user'}">\${item.user_role === 1 ? '管理员' : '普通用户'}</span></td>
                    <td><span class="\${item.status === 1 ? 'status-active' : 'status-disabled'}">\${item.status === 1 ? '启用' : '禁用'}</span></td>
                    <td>\${item.add_time ? new Date(item.add_time).toLocaleString() : '-'}</td>
                    <td>
                        <button class="btn edit-btn" onclick="showEditModal('\${item.id}')">编辑</button>
                        <button class="btn delete-btn" onclick="deleteUser('\${item.id}')">删除</button>
                    </td>
                </tr>
            \`).join('');
        }
        function showAddModal() {
            document.getElementById('modalTitle').textContent = '添加用户';
            document.getElementById('formId').value = '';
            document.getElementById('formUsername').value = '';
            document.getElementById('formPassword').value = '';
            document.getElementById('formRole').value = '2';
            document.getElementById('formStatus').value = '1';
            document.getElementById('modal').style.display = 'flex';
        }
        async function showEditModal(id) {
            const token = localStorage.getItem('token');
            if (!token) { window.location.href = '/login'; return; }
            showLoading();
            try {
                const response = await fetch('/api/user/get', {method:'POST', body: JSON.stringify({ id }), headers: { 'Authorization': 'Bearer ' + token } });
                const data = await response.json();
                if (data.code === 200) {
                    const item = data.data;
                    if (item) {
                        document.getElementById('modalTitle').textContent = '编辑用户';
                        document.getElementById('formId').value = item.id;
                        document.getElementById('formUsername').value = item.user_name;
                        document.getElementById('formPassword').value = '';
                        document.getElementById('formRole').value = item.user_role.toString();
                        document.getElementById('formStatus').value = item.status.toString();
                        document.getElementById('modal').style.display = 'flex';
                    }
                } else {
                    showToast(data.data || '获取用户信息失败');
                }
            } catch (error) {
                showToast('网络错误，请重试');
            } finally {
                hideLoading();
            }
        }
        function closeModal() { document.getElementById('modal').style.display = 'none'; }
        async function saveUser() {
            const token = localStorage.getItem('token');
            if (!token) { window.location.href = '/login'; return; }
            const id = document.getElementById('formId').value;
            const username = document.getElementById('formUsername').value;
            const password = document.getElementById('formPassword').value;
            if (!username) { showToast('请输入用户名'); return; }
            if (!id && !password) { showToast('请输入密码'); return; }
            const data = { id, user_name: username };
            if (password) data.user_pwd = password;
            if (document.getElementById('formRole').value) data.user_role = parseInt(document.getElementById('formRole').value);
            if (document.getElementById('formStatus').value) data.status = parseInt(document.getElementById('formStatus').value);
            
            showLoading();
            
            try {
                const url = id ? '/api/user/update' : '/api/user/add';
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (result.code === 200) {
                    showToast(id ? '更新成功' : '添加成功');
                    closeModal();
                    getUserList();
                } else {
                    showToast(result.data || '操作失败');
                }
            } catch (error) {
                showToast('网络错误，请重试');
            } finally {
                hideLoading();
            }
        }
        async function deleteUser(id) {
            if (!confirm('确定要删除该用户吗？')) return;
            showLoading();
            const token = localStorage.getItem('token');
            if (!token) { window.location.href = '/login'; return; }
            try {
                const response = await fetch('/api/user/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify({ id })
                });
                const data = await response.json();
                if (data.code === 200) { showToast('删除成功'); getUserList(); }
                else { showToast(data.data || '删除失败'); }
            } catch (error) {
                showToast('网络错误，请重试');
            } finally {
                hideLoading();
            }
        }
        function loginOut() { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href = '/login'; }
        function showToast(message, duration = 3000) {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), duration);
        }
        document.addEventListener('DOMContentLoaded', () => {
            if (!localStorage.getItem('token')) { window.location.href = '/login'; return; }
            getUserList();
        });
        document.getElementById('modal').addEventListener('click', (e) => {
            //if (e.target === document.getElementById('modal')) closeModal();
        });
    </script>
</body>
</html>`;

        return new Response(htmlContent, {
            headers: { 'Content-Type': 'text/html;charset=UTF-8', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*' }
        });
    }

    templateManagerPage() {
        const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>模板管理</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f7fa; }
        .navbar { background: #343a40; padding: 12px 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .navbar-container { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
        .navbar-brand { color: #fff; font-size: 18px; font-weight: 600; text-decoration: none; }
        .navbar-menu { display: flex; gap: 5px; }
        .nav-item { color: #fff; padding: 8px 16px; text-decoration: none; border-radius: 4px; transition: background 0.3s; font-size: 14px; }
        .nav-item:hover { background: rgba(255,255,255,0.1); }
        .nav-item.active { background: #007bff; }
        .nav-item.logout { color: #dc3545; }
        .nav-item.logout:hover { background: rgba(220,53,69,0.2); }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .header h1 { color: #333; font-size: 24px; }
        .header .actions { display: flex; gap: 10px; }
        .btn { padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: background 0.3s; }
        .add-btn { background: #007bff; color: white; }
        .add-btn:hover { background: #0056b3; }
        .back-btn { background: #6c757d; color: white; }
        .back-btn:hover { background: #5a6268; }
        .table-container { background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #eee; }
        th { background: #f8f9fa; font-weight: 600; color: #495057; }
        tr:hover { background: #f8f9fa; }
        .edit-btn { background: #28a745; color: white; padding: 6px 12px; font-size: 12px; }
        .edit-btn:hover { background: #218838; }
        .delete-btn { background: #dc3545; color: white; padding: 6px 12px; font-size: 12px; }
        .delete-btn:hover { background: #c82333; }
        .status-active { color: #28a745; font-weight: 600; }
        .status-disabled { color: #dc3545; font-weight: 600; }
        .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); justify-content: center; align-items: center; z-index: 1000; }
        .modal-content { background: white; border-radius: 8px; padding: 24px; width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto; }
        .modal-content h2 { margin-bottom: 20px; font-size: 18px; }
        .form-group { margin-bottom: 15px; }
        .form-group label { display: block; margin-bottom: 5px; font-weight: 600; }
        .form-group input, .form-group textarea, .form-group select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; }
        .form-group textarea { height: 300px; font-family: monospace; }
        .form-group input:focus, .form-group textarea:focus, .form-group select:focus { outline: none; border-color: #007bff; }
        .form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
        .cancel-btn { background: #6c757d; color: #fff; }
        .cancel-btn:hover { background: #5a6268; }
        .toast { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.8); color: white; padding: 12px 24px; border-radius: 50px; font-size: 16px; opacity: 0; transition: opacity 0.3s; z-index: 9999; }
        .toast.show { opacity: 1; }
        .template-preview { margin-top: 15px; padding: 15px; background: #f8f9fa; border-radius: 4px; font-size: 12px; color: #666; }
        .template-preview h4 { margin-bottom: 10px; color: #333; }
        .template-preview pre { white-space: pre-wrap; word-break: break-all; max-height: 200px; overflow-y: auto; }
        .loading-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.8); display: flex; justify-content: center; align-items: center; z-index: 9999; }
        .loading-spinner { width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #007bff; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .btn-loading { position: relative; pointer-events: none; opacity: 0.7; }
        .btn-loading::after { content: ''; position: absolute; right: 10px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; border: 2px solid #fff; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @media (max-width: 768px) {
            .container { padding: 12px; }
            .navbar { padding: 10px 12px; }
            .navbar-container { flex-wrap: wrap; gap: 6px; }
            .navbar-menu { overflow-x: auto; -webkit-overflow-scrolling: touch; flex-wrap: nowrap; }
            .navbar-menu::-webkit-scrollbar { display: none; }
            .nav-item { white-space: nowrap; padding: 8px 12px; font-size: 13px; }
            .header { flex-direction: column; align-items: stretch; gap: 10px; }
            .header .actions { display: flex; gap: 8px; }
            .header .actions .btn { flex: 1; }
            .table-container { overflow-x: auto; -webkit-overflow-scrolling: touch; }
            table { min-width: 760px; }
            .modal-content { max-width: 94vw; padding: 16px; }
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="navbar-container">
            <a href="/admin/index" class="navbar-brand">挪车通知系统</a>
            <div class="navbar-menu">
                <a href="/admin/cars" class="nav-item" id="nav-car">车辆管理</a>
                <a href="/admin/users" class="nav-item" id="nav-user">用户管理</a>
                <a href="/admin/templates" class="nav-item active" id="nav-template">模板管理</a>
                <a href="/admin/notify" class="nav-item" id="nav-notify">通知管理</a>
                <a href="javascript:void(0)" class="nav-item logout" onclick="loginOut()">注销登录</a>
            </div>
        </div>
    </nav>
    <div class="container">
        <div class="header">
            <h1>模板管理</h1>
            <div class="actions">
                <button class="btn add-btn" onclick="getTemplateList()">刷新列表</button>
                <button class="btn add-btn" onclick="showAddModal()">添加模板</button>
            </div>
        </div>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>模板名称</th>
                        <th>创建时间</th>
                        <th>状态</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody id="templateTable">
                </tbody>
            </table>
        </div>
    </div>
    <div id="loadingOverlay" class="loading-overlay" style="display: none;">
        <div class="loading-spinner"></div>
    </div>
    <div id="modal" class="modal">
        <div class="modal-content">
            <h2 id="modalTitle">添加模板</h2>
            <form id="templateForm">
                <input type="hidden" id="formId">
                <div class="form-group">
                    <label>模板名称</label>
                    <input type="text" id="formName" placeholder="请输入模板名称">
                </div>
                <div class="form-group">
                    <label>模板内容 (HTML)</label>
                    <textarea id="formValue" placeholder="请输入HTML模板内容"></textarea>
                </div>
                <div class="form-group">
                    <label>状态</label>
                    <select id="formStatus">
                        <option value="true">启用</option>
                        <option value="false">禁用</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn cancel-btn" onclick="closeModal()">取消</button>
                    <button type="button" class="btn add-btn" onclick="saveTemplate()">保存</button>
                </div>
            </form>
        </div>
    </div>
    <div id="toast" class="toast"></div>
    <script>
        function showLoading() { document.getElementById('loadingOverlay').style.display = 'flex'; }
        function hideLoading() { document.getElementById('loadingOverlay').style.display = 'none'; }
        function setBtnLoading(btn, loading) { loading ? btn.classList.add('btn-loading') : btn.classList.remove('btn-loading'); }

        async function getTemplateList() {
            const token = localStorage.getItem('token');
            if (!token) { window.location.href = '/login'; return; }
            showLoading();
            try {
                const response = await fetch('/api/template/list', { method:'POST', headers: { 'Authorization': 'Bearer ' + token } });
                const data = await response.json();
                if (data.code === 200) { renderTable(data.data); }
                else { showToast(data.data || '获取列表失败'); }
            } catch (error) {
                showToast('网络错误，请重试');
            } finally {
                hideLoading();
            }
        }
        function renderTable(data) {
            const tbody = document.getElementById('templateTable');
            tbody.innerHTML = data.map(item => \`
                <tr>
                    <td>\${item.id}</td>
                    <td>\${item.name}</td>
                    <td>\${item.add_time ? new Date(item.add_time).toLocaleString() : '-'}</td>
                    <td><span class="\${item.status ? 'status-active' : 'status-disabled'}">\${item.status ? '启用' : '禁用'}</span></td>
                    <td>
                        <button class="btn edit-btn" onclick="showEditModal('\${item.id}')">编辑</button>
                        <button class="btn delete-btn" onclick="deleteTemplate('\${item.id}')">删除</button>
                    </td>
                </tr>
            \`).join('');
        }
        function showAddModal() {
            document.getElementById('modalTitle').textContent = '添加模板';
            document.getElementById('formId').value = '';
            document.getElementById('formName').value = '';
            document.getElementById('formValue').value = '';
            document.getElementById('formStatus').value = 'true';
            document.getElementById('modal').style.display = 'flex';
        }
        async function showEditModal(id) {
            const token = localStorage.getItem('token');
            if (!token) { window.location.href = '/login'; return; }
            showLoading();
            try {
                const response = await fetch('/api/template/get', { method:'POST', body: JSON.stringify({ id }), headers: { 'Authorization': 'Bearer ' + token } });
                const data = await response.json();
                if (data.code === 200) {
                    const item = data.data;
                    if (item) {
                        document.getElementById('modalTitle').textContent = '编辑模板';
                        document.getElementById('formId').value = item.id;
                        document.getElementById('formName').value = item.name;
                        document.getElementById('formValue').value = item.value;
                        document.getElementById('formStatus').value = item.status ? 'true' : 'false';
                        document.getElementById('modal').style.display = 'flex';
                    }
                } else {
                    showToast(data.data || '获取模板信息失败');
                }
            } catch (error) {
                showToast('网络错误，请重试');
            } finally {
                hideLoading();
            }
        }
        function closeModal() { document.getElementById('modal').style.display = 'none'; }
        async function saveTemplate() {
            const token = localStorage.getItem('token');
            if (!token) { window.location.href = '/login'; return; }
            const id = document.getElementById('formId').value;
            const name = document.getElementById('formName').value.trim();
            const value = document.getElementById('formValue').value.trim();
            if (!name) { showToast('请输入模板名称'); return; }
            if (!value) { showToast('请输入模板内容'); return; }
            const data = { 
                id, 
                name, 
                value,
                status: document.getElementById('formStatus').value === 'true'
            };
            
            showLoading();
            
            try {
                const url = id ? '/api/template/update' : '/api/template/add';
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (result.code === 200) {
                    showToast(id ? '更新成功' : '添加成功');
                    closeModal();
                    getTemplateList();
                } else {
                    showToast(result.data || '操作失败');
                }
            } catch (error) {
                showToast('网络错误，请重试');
            } finally {
                hideLoading();
            }
        }
        async function deleteTemplate(id) {
            if (!confirm('确定要删除该模板吗？删除后关联的车辆将使用默认样式。')) return;
            showLoading();
            const token = localStorage.getItem('token');
            if (!token) { window.location.href = '/login'; return; }
            try {
                const response = await fetch('/api/template/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify({ id })
                });
                const data = await response.json();
                if (data.code === 200) { showToast('删除成功'); getTemplateList(); }
                else { showToast(data.data || '删除失败'); }
            } catch (error) {
                showToast('网络错误，请重试');
            } finally {
                hideLoading();
            }
        }
        function loginOut() { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href = '/login'; }
        function showToast(message, duration = 3000) {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), duration);
        }
        document.addEventListener('DOMContentLoaded', () => {
            if (!localStorage.getItem('token')) { window.location.href = '/login'; return; }
            getTemplateList();
        });
        document.getElementById('modal').addEventListener('click', (e) => {
            //if (e.target === document.getElementById('modal')) closeModal();
        });
    </script>
</body>
</html>`;

        return new Response(htmlContent, {
            headers: { 'Content-Type': 'text/html;charset=UTF-8', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*' }
        });
    }

    notifyManagerPage() {
        const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>通知管理</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f7fa; }
        .navbar { background: #343a40; padding: 12px 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .navbar-container { max-width: 1400px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
        .navbar-brand { color: #fff; font-size: 18px; font-weight: 600; text-decoration: none; }
        .navbar-menu { display: flex; gap: 5px; }
        .nav-item { color: #fff; padding: 8px 16px; text-decoration: none; border-radius: 4px; transition: background 0.3s; font-size: 14px; }
        .nav-item:hover { background: rgba(255,255,255,0.1); }
        .nav-item.active { background: #007bff; }
        .nav-item.logout { color: #dc3545; }
        .nav-item.logout:hover { background: rgba(220,53,69,0.2); }
        .container { max-width: 1400px; margin: 0 auto; padding: 20px; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .header h1 { color: #333; font-size: 24px; }
        .header .actions { display: flex; gap: 10px; }
        .btn { padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: background 0.3s; }
        .add-btn { background: #007bff; color: white; }
        .add-btn:hover { background: #0056b3; }
        .back-btn { background: #6c757d; color: white; }
        .back-btn:hover { background: #5a6268; }
        .table-container { background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #eee; }
        th { background: #f8f9fa; font-weight: 600; color: #495057; }
        tr:hover { background: #f8f9fa; }
        .edit-btn { background: #28a745; color: white; padding: 6px 12px; font-size: 12px; }
        .edit-btn:hover { background: #218838; }
        .delete-btn { background: #dc3545; color: white; padding: 6px 12px; font-size: 12px; }
        .delete-btn:hover { background: #c82333; }
        .status-active { color: #28a745; font-weight: 600; }
        .status-disabled { color: #dc3545; font-weight: 600; }
        .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); justify-content: center; align-items: center; z-index: 1000; overflow-y: auto; }
        .modal-content { background: white; border-radius: 8px; padding: 24px; width: 90%; max-width: 700px; margin: 20px auto; }
        .modal-content h2 { margin-bottom: 20px; font-size: 18px; }
        .form-group { margin-bottom: 15px; }
        .form-group label { display: block; margin-bottom: 5px; font-weight: 600; }
        .form-group input, .form-group textarea, .form-group select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; }
        .form-group textarea { height: 120px; resize: vertical; font-family: monospace; }
        .form-group input:focus, .form-group textarea:focus, .form-group select:focus { outline: none; border-color: #007bff; }
        .form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
        .cancel-btn { background: #6c757d; color: #fff; }
        .cancel-btn:hover { background: #5a6268; }
        .toast { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.8); color: white; padding: 12px 24px; border-radius: 50px; font-size: 16px; opacity: 0; transition: opacity 0.3s; z-index: 9999; }
        .toast.show { opacity: 1; }
        .loading-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.8); display: flex; justify-content: center; align-items: center; z-index: 9999; }
        .loading-spinner { width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #007bff; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .btn-loading { position: relative; pointer-events: none; opacity: 0.7; }
        .btn-loading::after { content: ''; position: absolute; right: 10px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; border: 2px solid #fff; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite; }
        .method-badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; }
        .method-GET { background: #d4edda; color: #155724; }
        .method-POST { background: #fff3cd; color: #856404; }
        .method-PUT { background: #cce5ff; color: #004085; }
        @media (max-width: 768px) {
            .container { padding: 12px; }
            .navbar { padding: 10px 12px; }
            .navbar-container { flex-wrap: wrap; gap: 6px; }
            .navbar-menu { overflow-x: auto; -webkit-overflow-scrolling: touch; flex-wrap: nowrap; }
            .navbar-menu::-webkit-scrollbar { display: none; }
            .nav-item { white-space: nowrap; padding: 8px 12px; font-size: 13px; }
            .header { flex-direction: column; align-items: stretch; gap: 10px; }
            .header .actions { display: flex; gap: 8px; }
            .header .actions .btn { flex: 1; }
            .table-container { overflow-x: auto; -webkit-overflow-scrolling: touch; }
            table { min-width: 760px; }
            .modal-content { max-width: 94vw; padding: 16px; }
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="navbar-container">
            <a href="/admin/index" class="navbar-brand">挪车通知系统</a>
            <div class="navbar-menu">
                <a href="/admin/cars" class="nav-item" id="nav-car">车辆管理</a>
                <a href="/admin/users" class="nav-item" id="nav-user">用户管理</a>
                <a href="/admin/templates" class="nav-item" id="nav-template">模板管理</a>
                <a href="/admin/notify" class="nav-item active" id="nav-notify">通知管理</a>
                <a href="javascript:void(0)" class="nav-item logout" onclick="loginOut()">注销登录</a>
            </div>
        </div>
    </nav>
    <div class="container">
        <div class="header">
            <h1>通知管理</h1>
            <div class="actions">
                <button class="btn add-btn" onclick="getNotifyList()">刷新列表</button>
                <button class="btn add-btn" onclick="showAddModal()">添加通知类型</button>
            </div>
        </div>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>名称</th>
                        <th>提示</th>
                        <th>请求方法</th>
                        <th>请求地址</th>
                        <th>创建时间</th>
                        <th>状态</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody id="notifyTable">
                </tbody>
            </table>
        </div>
    </div>
    <div id="loadingOverlay" class="loading-overlay" style="display: none;">
        <div class="loading-spinner"></div>
    </div>
    <div id="modal" class="modal">
        <div class="modal-content">
            <h2 id="modalTitle">添加通知类型</h2>
            <form id="notifyForm">
                <input type="hidden" id="formId">
                <div class="form-group">
                    <label>名称</label>
                    <input type="text" id="formName" placeholder="请输入通知类型名称">
                </div>
                <div class="form-group">
                    <label>提示</label>
                    <textarea id="formTip" placeholder="请输入提示信息（将在选择通知类型时显示）"></textarea>
                </div>
                <div class="form-group">
                    <label>请求方法</label>
                    <select id="formMethod">
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>请求地址</label>
                    <input type="text" id="formUrl" placeholder="请输入请求URL地址">
                </div>
                <div class="form-group">
                    <label>提交数据</label>
                    <textarea id="formBody" placeholder="请输入提交的数据（JSON格式，支持 {{变量名}} 占位符）"></textarea>
                </div>
                <div class="form-group">
                    <label>请求头</label>
                    <textarea id="formHeader" placeholder="请输入请求头（JSON格式）"></textarea>
                </div>
                <div class="form-group">
                    <label>成功标识</label>
                    <input type="text" id="formSuccess" placeholder="请输入成功响应标识（响应中包含此内容即为成功）">
                </div>
                <div class="form-group">
                    <label>状态</label>
                    <select id="formStatus">
                        <option value="true">启用</option>
                        <option value="false">禁用</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn cancel-btn" onclick="closeModal()">取消</button>
                    <button type="button" class="btn add-btn" onclick="saveNotify()">保存</button>
                </div>
            </form>
        </div>
    </div>
    <div id="toast" class="toast"></div>
    <script>
        function showLoading() { document.getElementById('loadingOverlay').style.display = 'flex'; }
        function hideLoading() { document.getElementById('loadingOverlay').style.display = 'none'; }
        function setBtnLoading(btn, loading) { loading ? btn.classList.add('btn-loading') : btn.classList.remove('btn-loading'); }

        async function getNotifyList() {
            const token = localStorage.getItem('token');
            if (!token) { window.location.href = '/login'; return; }
            showLoading();
            try {
                const response = await fetch('/api/notify/list', { method:'POST', headers: { 'Authorization': 'Bearer ' + token } });
                const data = await response.json();
                if (data.code === 200) { renderTable(data.data); }
                else { showToast(data.data || '获取列表失败'); }
            } catch (error) {
                showToast('网络错误，请重试');
            } finally {
                hideLoading();
            }
        }
        function truncateText(text, maxLength = 20) {
            if (!text) return '-';
            return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
        }

        function renderTable(data) {
            const tbody = document.getElementById('notifyTable');
            tbody.innerHTML = data.map(item => \`
                <tr>
                    <td>\${item.id}</td>
                    <td>\${item.name}</td>
                    <td>\${truncateText(item.tip)}</td>
                    <td><span class="method-badge method-\${item.method || 'GET'}">\${item.method || 'GET'}</span></td>
                    <td>\${truncateText(item.url)}</td>
                    <td>\${item.add_time ? new Date(item.add_time).toLocaleString() : '-'}</td>
                    <td><span class="\${item.status ? 'status-active' : 'status-disabled'}">\${item.status ? '启用' : '禁用'}</span></td>
                    <td>
                        <button class="btn edit-btn" onclick="showEditModal('\${item.id}')">编辑</button>
                        <button class="btn delete-btn" onclick="deleteNotify('\${item.id}')">删除</button>
                    </td>
                </tr>
            \`).join('');
        }
        function showAddModal() {
            document.getElementById('modalTitle').textContent = '添加通知类型';
            document.getElementById('formId').value = '';
            document.getElementById('formName').value = '';
            document.getElementById('formTip').value = '';
            document.getElementById('formMethod').value = 'GET';
            document.getElementById('formUrl').value = '';
            document.getElementById('formBody').value = '';
            document.getElementById('formHeader').value = '';
            document.getElementById('formSuccess').value = '';
            document.getElementById('formStatus').value = 'true';
            document.getElementById('modal').style.display = 'flex';
        }
        async function showEditModal(id) {
            const token = localStorage.getItem('token');
            if (!token) { window.location.href = '/login'; return; }
            showLoading();
            try {
                const response = await fetch('/api/notify/get', { method:'POST', body: JSON.stringify({ id }), headers: { 'Authorization': 'Bearer ' + token } });
                const data = await response.json();
                if (data.code === 200) {
                    const item = data.data;
                    if (item) {
                        document.getElementById('modalTitle').textContent = '编辑通知类型';
                        document.getElementById('formId').value = item.id;
                        document.getElementById('formName').value = item.name;
                        document.getElementById('formTip').value = item.tip || '';
                        document.getElementById('formMethod').value = item.method || 'GET';
                        document.getElementById('formUrl').value = item.url || '';
                        document.getElementById('formBody').value = item.body || '';
                        document.getElementById('formHeader').value = item.header || '';
                        document.getElementById('formSuccess').value = item.success || '';
                        document.getElementById('formStatus').value = item.status ? 'true' : 'false';
                        document.getElementById('modal').style.display = 'flex';
                    }
                } else {
                    showToast(data.data || '获取通知类型信息失败');
                }
            } catch (error) {
                showToast('网络错误，请重试');
            } finally {
                hideLoading();
            }
        }
        function closeModal() { document.getElementById('modal').style.display = 'none'; }
        async function saveNotify() {
            const token = localStorage.getItem('token');
            if (!token) { window.location.href = '/login'; return; }
            const id = document.getElementById('formId').value;
            const name = document.getElementById('formName').value.trim();
            if (!name) { showToast('请输入通知类型名称'); return; }
            const data = { 
                id, 
                name, 
                tip: document.getElementById('formTip').value.trim(),
                method: document.getElementById('formMethod').value,
                url: document.getElementById('formUrl').value.trim(),
                body: document.getElementById('formBody').value.trim(),
                header: document.getElementById('formHeader').value.trim(),
                success: document.getElementById('formSuccess').value.trim(),
                status: document.getElementById('formStatus').value === 'true'
            };
            
            showLoading();
            
            try {
                const url = id ? '/api/notify/update' : '/api/notify/add';
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (result.code === 200) {
                    showToast(id ? '更新成功' : '添加成功');
                    closeModal();
                    getNotifyList();
                } else {
                    showToast(result.data || '操作失败');
                }
            } catch (error) {
                showToast('网络错误，请重试');
            } finally {
                hideLoading();
            }
        }
        async function deleteNotify(id) {
            if (!confirm('确定要删除该通知类型吗？删除后关联的车辆通知ID将被清空。')) return;
            showLoading();
            const token = localStorage.getItem('token');
            if (!token) { window.location.href = '/login'; return; }
            try {
                const response = await fetch('/api/notify/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify({ id })
                });
                const data = await response.json();
                if (data.code === 200) { showToast('删除成功'); getNotifyList(); }
                else { showToast(data.data || '删除失败'); }
            } catch (error) {
                showToast('网络错误，请重试');
            } finally {
                hideLoading();
            }
        }
        function loginOut() { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href = '/login'; }
        function showToast(message, duration = 3000) {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), duration);
        }
        document.addEventListener('DOMContentLoaded', () => {
            if (!localStorage.getItem('token')) { window.location.href = '/login'; return; }
            getNotifyList();
        });
        document.getElementById('modal').addEventListener('click', (e) => {
            //if (e.target === document.getElementById('modal')) closeModal();
        });
    </script>
</body>
</html>`;

        return new Response(htmlContent, {
            headers: { 'Content-Type': 'text/html;charset=UTF-8', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*' }
        });
    }
}

class MoveCarBackend {

  constructor(env, config) {
    this.env = env;
    this.DB = env.DB;
    this.DATA = env.DATA;
    this.config = config;
  }

  async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async generateToken(userId) {
    const random = crypto.getRandomValues(new Uint8Array(32));
    const token = Array.from(random).map(b => b.toString(16).padStart(2, '0')).join('');
    const expiresAt = Date.now() + 86400000;

    await this.DB.prepare('DELETE FROM tokens WHERE user_id = ?').bind(userId).run();
    await this.DB.prepare('INSERT INTO tokens (token, user_id, expires_at) VALUES (?, ?, ?)')
      .bind(token, userId, expiresAt).run();

    return token;
  }

  async validateToken(token) {
    if (!token) return null;

    const tokenResult = await this.DB.prepare('SELECT * FROM tokens WHERE token = ?').bind(token).first();
    if (!tokenResult || tokenResult.expires_at < Date.now()) {
      if (tokenResult) {
        await this.DB.prepare('DELETE FROM tokens WHERE token = ?').bind(token).run();
      }
      return null;
    }

    const user = await this.DB.prepare('SELECT * FROM users WHERE id = ? AND status = 1')
      .bind(tokenResult.user_id).first();

    return user || null;
  }

  getResponse(body, status = 200) {
    return new Response(body, {
      status,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*'
      }
    });
  }

  async validateTokenFromRequest(request) {
    // 1. 优先尝试从 Authorization Header 中获取 Token
    const authHeader = request.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      if (token) {
        return await this.validateToken(token);
      }
    }

    // 2. 如果 Header 中没有，尝试从 Cookie 中获取 Token
    const cookieToken = this.getTokenFromCookie(request, "token"); // 假设你的 Cookie 名字叫 "token"
    if (cookieToken) {
      return await this.validateToken(cookieToken);
    }

    // 3. 都没找到，返回 null
    return null;
  }

  getTokenFromCookie(request, name) {
    const cookieHeader = request.headers.get("Cookie");
    if (!cookieHeader) return null;

    // 简单的 Cookie 解析逻辑：按分号分割，查找以 "name=" 开头的项
    const cookies = cookieHeader.split(";");
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split("=");
      if (cookieName === name && cookieValue) {
        return decodeURIComponent(cookieValue); // 注意：解码 Cookie 值以防特殊字符
      }
    }
    return null;
  }

  async getKV(id) {
    try {
      if (id) {
        const owner = await this.DATA.get(id) || null;
        if (owner) {
          return JSON.parse(owner);
        }
      }
    } catch (e) { }
    return null;
  }

  async putKV(id, owner, cfg) {
    if (id) {
      await this.DATA.put(id, JSON.stringify(owner), cfg);
      return true;
    } else {
      return false;
    }
  }

  async delKV(id) {
    if (id) {
      await this.DATA.delete(id);
      return true;
    } else {
      return false;
    }
  }

  async listKV(prefix, limit) {
    return await this.DATA.list({ prefix, limit });
  }

  async getNotifyList() {
    const notifyTypeList = await this.DB.prepare('SELECT * FROM notify WHERE status = 1').all();
    const notifyTypeMap = (notifyTypeList.results || []).map(item => ({
      id: item.id,
      name: item.name,
      tip: item.tip
    }));

    return this.getResponse(JSON.stringify({
      code: 200,
      data: notifyTypeMap,
      message: "success"
    }), 200);
  }

  async getTemplateList() {
    const templateList = await this.DB.prepare('SELECT * FROM templates WHERE status = 1').all();
    const templateMap = (templateList.results || []).map(item => ({
      id: item.id,
      name: item.name
    }));

    return this.getResponse(JSON.stringify({
      code: 200,
      data: templateMap,
      message: "success"
    }), 200);
  }

  async rateLimit(id) {
    const key = `ratelimit:${id.toLowerCase()}`;
    const currentCount = await this.getKV(key) || 0;
    const notifyCount = parseInt(currentCount);
    if (notifyCount >= this.config.rateLimitMaxRequests) {
      return false;
    }
    await this.putKV(key, notifyCount + 1, { expirationTtl: this.config.rateLimitDelay });
    return true;
  }

  async notifyMessage(json) {
    const {
      id,
      message
    } = json;
    const isCanSend = await this.rateLimit(id);
    if (!isCanSend) {
      return this.getResponse(JSON.stringify({
        code: 200,
        data: this.config.rateLimitMessage,
        message: "success"
      }), 200);
    }
    const car = await this.DB.prepare('SELECT * FROM cars WHERE id = ? AND status = 1').bind(id).first();
    if (!car) {
      return this.getResponse(JSON.stringify({
        code: 500,
        data: "车辆信息错误！",
        message: "fail"
      }), 200);
    }
    if (!car.is_notify) {
      return this.getResponse(JSON.stringify({
        code: 500,
        data: "车主未开启该功能,请使用其他方式联系车主!",
        message: "fail"
      }), 200);
    }

    const {
      no,
      notify_id,
      notify_token
    } = car;

    const notify = await this.DB.prepare('SELECT * FROM notify WHERE id = ? AND status = 1').bind(notify_id).first();
    if (!notify) {
      return this.getResponse(JSON.stringify({
        code: 500,
        data: "通知类型错误！",
        message: "fail"
      }), 200);
    }

    const { url, method, header, body, success } = notify;

    if (!url || !method) {
      return this.getResponse(JSON.stringify({
        code: 500,
        data: "通知模板错误！",
        message: "fail"
      }), 200);
    }

    let newHeader = {};
    let newUrl = url;
    let newBody = body || "";
    try {
      if (header) {
        newHeader = { ...JSON.parse(header) };
      }
    } catch (e) {
      newHeader = {};
    }

    try {
      const newObj = { ...(notify_token ? JSON.parse(notify_token) : {}), no, message: `【${no}】${message || this.config.notifyMessage}`, title: "挪车通知" };
      const newObj_keys = Object.keys(newObj);

      // 1. 提前构建正则，避免在循环中反复创建
      const keysPattern = new RegExp(`\\{\\{(${newObj_keys.join('|')})\\}\\}`, 'g');

      // 2. 封装一个统一的替换函数，利用闭包从 newObj 中取值
      const replacer = (match, key) => newObj[key] !== undefined ? newObj[key] : match;

      // 3. 单次循环完成所有替换
      newBody = newBody.replace(keysPattern, replacer);
      newUrl = newUrl.replace(keysPattern, replacer);

      // 4. 对 Header 也只需单次遍历（不再有嵌套循环）
      Object.keys(newHeader).forEach(key => {
        newHeader[key] = newHeader[key].replace(keysPattern, replacer);
      });

      // newObj_keys.forEach(key => {
      //   newBody = newBody.replace(`{{${key}}}`, newObj[key]);
      //   newUrl = newUrl.replace(`{{${key}}}`, newObj[key]);
      //   //遍历header中的value,替换{{key}}
      //   Object.keys(newHeader).forEach(key2 => {
      //     newHeader[key2] = newHeader[key2].replace(`{{${key}}}`, newObj[key]);
      //   });
      // });

      const resp = await fetch(newUrl, {
        method: method,
        headers: {...newHeader},
        body: newBody
      });

      const data = await resp.text() || "";

      if (success && data.indexOf(success) <0) {
        return this.getResponse(JSON.stringify({
          code: 500,
          data: "",
          message: `发送失败!${data}`
        }), 200);
      }
      else {
        return this.getResponse(JSON.stringify({
          code: 200,
          data: this.config.successMessage,
          message: "success"
        }), 200);
      }
    } catch (e) {
      return this.getResponse(JSON.stringify({
        code: 500,
        data: null,
        message: `发送失败!${e.message}`
      }), 200);
    }
  }

  async notifyCall(json) {
    const {
      id
    } = json;
    const car = await this.DB.prepare('SELECT * FROM cars WHERE id = ? AND status = 1').bind(id).first();
    if (!car) {
      return this.getResponse(JSON.stringify({
        code: 500,
        data: "车辆信息错误！",
        message: "fail"
      }), 200);
    }
    if (!car.is_call) {
      return this.getResponse(JSON.stringify({
        code: 500,
        data: "车主未开启该功能,请使用其他方式联系车主!",
        message: "fail"
      }), 200);
    }
    const {
      phone
    } = car;
    return this.getResponse(JSON.stringify({
      code: 200,
      data: phone,
      message: "success"
    }), 200);
  }

  //Car相关操作
  async carList(user) {
    let result;
    if (user.user_role === 1) {
      result = await this.DB.prepare('SELECT * FROM cars ORDER BY id DESC').all();
    } else {
      result = await this.DB.prepare('SELECT * FROM cars WHERE user_id = ? ORDER BY id DESC').bind(user.id).all();
    }
    const cars = result.results || [];

    return this.getResponse(JSON.stringify({
      code: 200,
      data: cars,
      message: "success"
    }), 200);
  }

  async carAdd(json, user) {
    const { no, phone, notify_token, notify_id, notify_name, is_notify, is_call, template_id, template_name, status } = json;
    if (!no) {
      return this.getResponse(JSON.stringify({
        code: 500,
        data: "车牌号不能为空",
        message: "fail"
      }), 200);
    }

    const existing = await this.DB.prepare('SELECT id FROM cars WHERE no = ? AND notify_id = ? AND user_id = ?').bind(no, notify_id, user.id).first();
    if (existing) {
      return this.getResponse(JSON.stringify({ code: 400, data: "车辆已存在", message: "fail" }), 200);
    }

    await this.DB.prepare(
      'INSERT INTO cars (user_id, user_name, no, phone, notify_token, notify_id,notify_name, is_notify, is_call, template_id, template_name, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(user.id, user.user_name, no, phone, notify_token, notify_id, notify_name, is_notify, is_call, template_id, template_name, status).run();

    return this.getResponse(JSON.stringify({ code: 200, data: "添加成功", message: "success" }), 200);
  }

  async carDelete(json, user) {
    const { id } = json;
    if (!id) {
      return this.getResponse(JSON.stringify({
        code: 500,
        data: "ID不能为空",
        message: "fail"
      }), 200);
    }

    if (user.user_role === 1) {
      await this.DB.prepare('DELETE FROM cars WHERE id = ?').bind(id).run();
    }
    else {
      await this.DB.prepare('DELETE FROM cars WHERE id = ? AND user_id = ?').bind(id, user.id).run();
    }

    return this.getResponse(JSON.stringify({
      code: 200,
      data: "删除成功",
      message: "success"
    }), 200);
  }

  async carUpdate(json, user) {
    const { id, no, phone, notify_token, notify_id, notify_name, is_notify, is_call, template_id, template_name, status } = json;
    if (!id) {
      return this.getResponse(JSON.stringify({
        code: 500,
        data: "ID不能为空",
        message: "fail"
      }), 200);
    }

    const car = await this.DB.prepare('SELECT * FROM cars WHERE id = ?').bind(id).first();
    if (!car) {
      return this.getResponse(JSON.stringify({
        code: 404,
        data: "车辆不存在",
        message: "fail"
      }), 200);
    }

    if (car.user_id !== user.id && user.user_role !== 1) {
      return this.getResponse(JSON.stringify({
        code: 403,
        data: "无权修改该车辆",
        message: "fail"
      }), 200);
    }

    const result = await this.DB.prepare(
      'UPDATE cars SET no = ?, phone = ?, notify_token = ?, notify_id = ?, notify_name = ?, is_notify = ?, is_call = ?, template_id = ?, template_name = ?, status = ? WHERE id = ?'
    ).bind(no, phone, notify_token, notify_id, notify_name, is_notify, is_call, template_id, template_name, status, id).run();

    if (result.meta.changes > 0) {
      return this.getResponse(JSON.stringify({ code: 200, data: "更新成功", message: "success" }), 200);
    }
    else {
      return this.getResponse(JSON.stringify({ code: 400, data: "车辆不存在", message: "fail" }), 200);
    }
  }

  async carGet(json, user) {
    const { id } = json;
    if (!id) {
      return this.getResponse(JSON.stringify({
        code: 500,
        data: "ID不能为空",
        message: "fail"
      }), 200);
    }

    const car = await this.DB.prepare('SELECT * FROM cars WHERE id = ?').bind(id).first();
    if (!car) {
      return this.getResponse(JSON.stringify({
        code: 404,
        data: "车辆不存在",
        message: "fail"
      }), 200);
    }

    if (car.user_id !== user.id && user.user_role !== 1) {
      return this.getResponse(JSON.stringify({
        code: 403,
        data: "无权查看该车辆",
        message: "fail"
      }), 200);
    }

    return this.getResponse(JSON.stringify({ code: 200, data: car, message: "success" }), 200);
  }

  async carDetailPage(id) {
    const car = await this.DB.prepare('SELECT * FROM cars WHERE id = ? AND status = 1').bind(id).first();
    if (!car) {
      return "<html><body><h1>车辆不存在或已禁用</h1></body></html>";  // 统一返回HTML
    }

    const { no, phone, notify_id, template_id, is_notify, is_call } = car;

    const template = await this.DB.prepare('SELECT * FROM templates WHERE id = ? AND status = 1').bind(template_id).first();
    if (!template) {
      return "<html><body><h1>模板不存在或已禁用</h1></body></html>";  // 统一返回HTML
    }

    const value = template.value
      .replace('{{no}}', no)
      .replace('{{phone}}', phone)
      .replace('{{is_notify}}', (is_notify === 1).toString())
      .replace('{{is_call}}', (is_call === 1).toString());

    return value;
  }

  //User相关操作
  async userRegister(json) {
    if (!this.config.canRegister) {
      return this.getResponse(JSON.stringify({ code: 400, data: "注册功能已关闭", message: "fail" }), 200);
    }
    const { user_name, user_pwd } = json;
    if (!user_name || !user_pwd) {
      return this.getResponse(JSON.stringify({ code: 400, data: "用户名和密码不能为空", message: "fail" }), 200);
    }

    const existingUser = await this.DB.prepare('SELECT id FROM users WHERE user_name = ?').bind(user_name).first();
    if (existingUser) {
      return this.getResponse(JSON.stringify({ code: 400, data: "用户名已存在", message: "fail" }), 200);
    }

    const hashedPwd = await this.hashPassword(user_pwd);

    const countResult = await this.DB.prepare('SELECT COUNT(*) as count FROM users').first();
    const userRole = countResult && countResult.count > 0 ? 2 : 1;

    await this.DB.prepare(
      'INSERT INTO users (user_name, user_pwd, user_role, add_time, status) VALUES (?, ?, ?, ?, ?)'
    ).bind(user_name, hashedPwd, userRole, new Date().toISOString(), 1).run();

    return this.getResponse(JSON.stringify({ code: 200, data: "注册成功", message: "success" }), 200);
  }

  // 管理员在后台添加用户（不受公开注册开关限制）
  async userAdd(json) {
    const { user_name, user_pwd, user_role, status } = json;
    if (!user_name || !user_pwd) {
      return this.getResponse(JSON.stringify({ code: 400, data: "用户名和密码不能为空", message: "fail" }), 200);
    }

    const existingUser = await this.DB.prepare('SELECT id FROM users WHERE user_name = ?').bind(user_name).first();
    if (existingUser) {
      return this.getResponse(JSON.stringify({ code: 400, data: "用户名已存在", message: "fail" }), 200);
    }

    const hashedPwd = await this.hashPassword(user_pwd);
    const role = user_role === 1 ? 1 : 2;
    const st = status === 0 ? 0 : 1;

    await this.DB.prepare(
      'INSERT INTO users (user_name, user_pwd, user_role, add_time, status) VALUES (?, ?, ?, ?, ?)'
    ).bind(user_name, hashedPwd, role, new Date().toISOString(), st).run();

    return this.getResponse(JSON.stringify({ code: 200, data: "添加成功", message: "success" }), 200);
  }

  async userLogin(json) {
    const { user_name, user_pwd } = json;
    if (!user_name || !user_pwd) {
      return this.getResponse(JSON.stringify({ code: 400, data: "用户名和密码不能为空", message: "fail" }), 200);
    }

    const user = await this.DB.prepare('SELECT * FROM users WHERE user_name = ?').bind(user_name).first();
    if (!user) {
      return this.getResponse(JSON.stringify({ code: 401, data: "用户名或密码错误", message: "fail" }), 200);
    }

    if (user.status !== 1) {
      return this.getResponse(JSON.stringify({ code: 401, data: "账号已被禁用", message: "fail" }), 200);
    }

    const hashedPwd = await this.hashPassword(user_pwd);
    if (user.user_pwd !== hashedPwd) {
      return this.getResponse(JSON.stringify({ code: 401, data: "用户名或密码错误", message: "fail" }), 200);
    }

    const token = await this.generateToken(user.id);
    return this.getResponse(JSON.stringify({
      code: 200,
      data: { token, user: { id: user.id, user_name: user.user_name, user_role: user.user_role } },
      message: "success"
    }), 200);
  }

  async userList() {
    const result = await this.DB.prepare('SELECT * FROM users').all();
    return this.getResponse(JSON.stringify({ code: 200, data: result.results || [], message: "success" }), 200);
  }

  async userDelete(json) {
    const { id } = json;
    if (!id) {
      return this.getResponse(JSON.stringify({ code: 400, data: "用户ID不能为空", message: "fail" }), 200);
    }

    // 先删除该用户的关联数据（车辆、登录会话），避免外键约束导致删除失败
    await this.DB.prepare('DELETE FROM cars WHERE user_id = ?').bind(id).run();
    await this.DB.prepare('DELETE FROM tokens WHERE user_id = ?').bind(id).run();

    const result = await this.DB.prepare('DELETE FROM users WHERE id = ?').bind(id).run();
    if (result.meta && result.meta.changes > 0) {
      return this.getResponse(JSON.stringify({ code: 200, data: "删除成功", message: "success" }), 200);
    }

    return this.getResponse(JSON.stringify({ code: 400, data: "用户不存在", message: "fail" }), 200);
  }

  async userUpdate(json) {
    const { id } = json;

    if (!id) {
      return this.getResponse(JSON.stringify({ code: 400, data: "用户ID不能为空", message: "fail" }), 200);
    }

    const updates = Object.entries(json)
      .filter(([_, value]) => value !== undefined)
      .map(([key, _]) => `${key} = ?`)
      .join(", ");

    if (!updates) {
      return this.getResponse(JSON.stringify({ code: 400, data: "没有需要更新的字段", message: "fail" }), 200);
    }

    const values = Object.entries(json)
      .filter(([_, value]) => value !== undefined)
      .map(([_, value]) => value);

    const result = await this.DB.prepare(`UPDATE users SET ${updates} WHERE id = ?`)
      .bind(...[...values, id])
      .run();

    if (result.meta.changes > 0) {
      return this.getResponse(JSON.stringify({ code: 200, data: "更新成功", message: "success" }), 200);
    }
    else {
      return this.getResponse(JSON.stringify({ code: 400, data: "用户不存在", message: "fail" }), 200);
    }
  }

  async userGet(json) {
    const { id } = json;
    if (!id) {
      return this.getResponse(JSON.stringify({
        code: 500,
        data: "ID不能为空",
        message: "fail"
      }), 200);
    }

    const user = await this.DB.prepare('SELECT * FROM users WHERE id = ?').bind(id).first();
    if (!user) {
      return this.getResponse(JSON.stringify({
        code: 404,
        data: "用户不存在",
        message: "fail"
      }), 200);
    }

    return this.getResponse(JSON.stringify({ code: 200, data: user, message: "success" }), 200);
  }

  //Template相关操作
  async templateList(user) {
    const result = await this.DB.prepare('SELECT * FROM templates WHERE status = 1 ORDER BY id').all();
    const templates = result.results || [];
    templates.forEach(tpl => {
      tpl.status = tpl.status === 1;
    });
    return this.getResponse(JSON.stringify({ code: 200, data: templates, message: "success" }), 200);
  }

  async templateAdd(json, user) {
    const { name, value } = json;
    if (!name || !value) {
      return this.getResponse(JSON.stringify({ code: 400, data: "模板名称和内容不能为空", message: "fail" }), 200);
    }

    const existing = await this.DB.prepare('SELECT id FROM templates WHERE name = ?').bind(name).first();
    if (existing) {
      return this.getResponse(JSON.stringify({ code: 400, data: "模板名称已存在", message: "fail" }), 200);
    }

    await this.DB.prepare(
      'INSERT INTO templates (name, value, add_time, status) VALUES (?, ?, ?, ?)'
    ).bind(name, value, new Date().toISOString(), 1).run();

    return this.getResponse(JSON.stringify({ code: 200, data: "添加成功", message: "success" }), 200);
  }

  async templateUpdate(json, user) {
    const { id, name, value, status } = json;
    if (!id) {
      return this.getResponse(JSON.stringify({ code: 400, data: "模板ID不能为空", message: "fail" }), 200);
    }

    if (name) {
      const existing = await this.DB.prepare('SELECT id FROM templates WHERE name = ? AND id != ?')
        .bind(name, id).first();
      if (existing) {
        return this.getResponse(JSON.stringify({ code: 400, data: "模板名称已存在", message: "fail" }), 200);
      }
    }

    let updateFields = [];
    let params = [];

    if (name) {
      updateFields.push('name = ?');
      params.push(name);
    }
    if (value) {
      updateFields.push('value = ?');
      params.push(value);
    }
    if (status !== undefined) {
      updateFields.push('status = ?');
      params.push(status ? 1 : 0);
    }

    if (updateFields.length === 0) {
      return this.getResponse(JSON.stringify({ code: 400, data: "没有需要更新的字段", message: "fail" }), 200);
    }

    params.push(id);

    const result = await this.DB.prepare(`UPDATE templates SET ${updateFields.join(', ')} WHERE id = ?`)
      .bind(...params).run();

    if (result.meta.changes > 0) {
      return this.getResponse(JSON.stringify({ code: 200, data: "更新成功", message: "success" }), 200);
    }

    return this.getResponse(JSON.stringify({ code: 400, data: "模板不存在", message: "fail" }), 200);
  }

  async templateDelete(json, user) {
    const { id } = json;
    if (!id) {
      return this.getResponse(JSON.stringify({ code: 400, data: "模板ID不能为空", message: "fail" }), 200);
    }

    const template = await this.DB.prepare('SELECT id FROM templates WHERE id = ?').bind(id).first();
    if (!template) {
      return this.getResponse(JSON.stringify({ code: 404, data: "模板不存在", message: "fail" }), 200);
    }

    await this.DB.prepare('UPDATE cars SET template_id = 0, template_name = NULL WHERE template_id = ?').bind(id).run();
    await this.DB.prepare('DELETE FROM templates WHERE id = ?').bind(id).run();

    return this.getResponse(JSON.stringify({ code: 200, data: "删除成功", message: "success" }), 200);
  }

  async templateGet(json) {
    const { id } = json;
    if (!id) {
      return this.getResponse(JSON.stringify({ code: 400, data: "模板ID不能为空", message: "fail" }), 200);
    }

    const template = await this.DB.prepare('SELECT * FROM templates WHERE id = ? AND status = 1').bind(id).first();
    if (!template) {
      return this.getResponse(JSON.stringify({ code: 404, data: "模板不存在或已禁用", message: "fail" }), 200);
    }

    return this.getResponse(JSON.stringify({ code: 200, data: template, message: "success" }), 200);
  }

  //Notify相关操作
  async notifyList(user) {
    const result = await this.DB.prepare('SELECT * FROM notify ORDER BY id DESC').all();
    const notifies = result.results || [];
    notifies.forEach(n => {
      n.status = n.status === 1;
    });
    return this.getResponse(JSON.stringify({ code: 200, data: notifies, message: "success" }), 200);
  }

  async notifyAdd(json, user) {
    const { name, tip, method, url, body, header, success } = json;
    if (!name) {
      return this.getResponse(JSON.stringify({ code: 400, data: "通知类型名称不能为空", message: "fail" }), 200);
    }

    const existing = await this.DB.prepare('SELECT id FROM notify WHERE name = ?').bind(name).first();
    if (existing) {
      return this.getResponse(JSON.stringify({ code: 400, data: "通知类型名称已存在", message: "fail" }), 200);
    }

    await this.DB.prepare(
      'INSERT INTO notify (name, tip, method, url, body, header, success, add_time, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(name, tip || null, method || 'GET', url || null, body || null, header || null, success || null, new Date().toISOString(), 1).run();

    return this.getResponse(JSON.stringify({ code: 200, data: "添加成功", message: "success" }), 200);
  }

  async notifyUpdate(json, user) {
    const { id, name, tip, method, url, body, header, success, status } = json;
    if (!id) {
      return this.getResponse(JSON.stringify({ code: 400, data: "通知类型ID不能为空", message: "fail" }), 200);
    }

    if (name) {
      const existing = await this.DB.prepare('SELECT id FROM notify WHERE name = ? AND id != ?')
        .bind(name, id).first();
      if (existing) {
        return this.getResponse(JSON.stringify({ code: 400, data: "通知类型名称已存在", message: "fail" }), 200);
      }
    }

    let updateFields = [];
    let params = [];

    if (name) {
      updateFields.push('name = ?');
      params.push(name);
    }
    if (tip !== undefined) {
      updateFields.push('tip = ?');
      params.push(tip);
    }
    if (method !== undefined) {
      updateFields.push('method = ?');
      params.push(method);
    }
    if (url !== undefined) {
      updateFields.push('url = ?');
      params.push(url);
    }
    if (body !== undefined) {
      updateFields.push('body = ?');
      params.push(body);
    }
    if (header !== undefined) {
      updateFields.push('header = ?');
      params.push(header);
    }
    if (success !== undefined) {
      updateFields.push('success = ?');
      params.push(success);
    }
    if (status !== undefined) {
      updateFields.push('status = ?');
      params.push(status ? 1 : 0);
    }

    if (updateFields.length === 0) {
      return this.getResponse(JSON.stringify({ code: 400, data: "没有需要更新的字段", message: "fail" }), 200);
    }

    params.push(id);

    const result = await this.DB.prepare(`UPDATE notify SET ${updateFields.join(', ')} WHERE id = ?`)
      .bind(...params).run();

    if (result.meta.changes > 0) {
      return this.getResponse(JSON.stringify({ code: 200, data: "更新成功", message: "success" }), 200);
    }

    return this.getResponse(JSON.stringify({ code: 400, data: "通知类型不存在", message: "fail" }), 200);
  }

  async notifyDelete(json, user) {
    const { id } = json;
    if (!id) {
      return this.getResponse(JSON.stringify({ code: 400, data: "通知类型ID不能为空", message: "fail" }), 200);
    }

    const notify = await this.DB.prepare('SELECT id FROM notify WHERE id = ?').bind(id).first();
    if (!notify) {
      return this.getResponse(JSON.stringify({ code: 404, data: "通知类型不存在", message: "fail" }), 200);
    }

    await this.DB.prepare('UPDATE cars SET notify_id = 0, notify_name = NULL WHERE notify_id = ?').bind(id).run();
    await this.DB.prepare('DELETE FROM notify WHERE id = ?').bind(id).run();

    return this.getResponse(JSON.stringify({ code: 200, data: "删除成功", message: "success" }), 200);
  }

  async notifyGet(json) {
    const { id } = json;
    if (!id) {
      return this.getResponse(JSON.stringify({ code: 400, data: "通知类型ID不能为空", message: "fail" }), 200);
    }

    const notify = await this.DB.prepare('SELECT * FROM notify WHERE id = ?').bind(id).first();
    if (!notify) {
      return this.getResponse(JSON.stringify({ code: 404, data: "通知类型不存在", message: "fail" }), 200);
    }

    return this.getResponse(JSON.stringify({ code: 200, data: notify, message: "success" }), 200);
  }
}

// ==========================================
// 1. 中间件与工具函数
// ==========================================

/**
 * 鉴权中间件：统一处理 Token 校验和角色权限
 */
const withAuth = (backend, handler, requiredRole = null) => async (request, json) => {
  const user = await backend.validateTokenFromRequest(request);

  if (!user) {
    return backend.getResponse(JSON.stringify({ code: 401, data: "Unauthorized", message: "fail" }), 200);
  }

  if (requiredRole !== null && user.user_role !== requiredRole) {
    return backend.getResponse(JSON.stringify({ code: 401, data: "Unauthorized", message: "fail" }), 200);
  }

  request.user = user;
  return handler(request, json);
};

/**
 * 页面鉴权中间件：处理前端页面的 302 重定向
 */
const withPageAuth = (backend, handler, requiredRole = null) => async (request) => {
  const user = await backend.validateTokenFromRequest(request);

  if (!user || (requiredRole !== null && user.user_role !== requiredRole)) {
    return new Response(null, {
      status: 302,
      headers: {
        'Location': '/login',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*'
      }
    });
  }
  return handler(request);
};

/**
 * 统一处理 POST 请求的 JSON 解析
 */
const withJson = (handler) => async (request) => {
  const json = await request.json();
  return handler(request, json);
};

/**
 * 动态路由匹配工具函数
 * @param {String} pathname - 当前请求的路径
 * @param {String} pattern - 路由模式，例如 '/car/:id'
 * @returns {Object|null} - 匹配成功返回参数对象，失败返回 null
 */
const matchDynamicRoute = (pathname, pattern) => {
  const patternParts = pattern.split('/');
  const pathParts = pathname.split('/');

  if (patternParts.length !== pathParts.length) return null;

  const params = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      // 提取动态参数
      params[patternParts[i].slice(1)] = pathParts[i];
    } else if (patternParts[i] !== pathParts[i]) {
      // 静态路径不匹配
      return null;
    }
  }
  return params;
};

// ==========================================
// 2. 路由表工厂函数
// ==========================================

/**
 * 每次请求进来时，通过工厂函数生成绑定当前 backend/frontend 实例的路由表
 */
function createRoutes(backend, frontend) {
  const POST_ROUTES = {
    // 无需鉴权
    '/api/notify/message': withJson((req, json) => backend.notifyMessage(json)),
    '/api/notify/call': withJson((req, json) => backend.notifyCall(json)),

    '/api/user/register': withJson((req, json) => backend.userRegister(json)),
    '/api/user/add': withAuth(backend, withJson((req, json) => backend.userAdd(json)), 1),
    '/api/user/login': withJson((req, json) => backend.userLogin(json)),

    '/api/notifyList': () => backend.getNotifyList(),
    '/api/templateList': () => backend.getTemplateList(),

    // 仅需登录鉴权
    '/api/car/add': withAuth(backend, withJson((req, json) => backend.carAdd(json, req.user))),
    '/api/car/delete': withAuth(backend, withJson((req, json) => backend.carDelete(json, req.user))),
    '/api/car/list': withAuth(backend, (req) => backend.carList(req.user)),
    '/api/car/update': withAuth(backend, withJson((req, json) => backend.carUpdate(json, req.user))),
    '/api/car/get': withAuth(backend, withJson((req, json) => backend.carGet(json, req.user))),

    // 需要管理员权限 (user_role === 1)
    '/api/template/add': withAuth(backend, withJson((req, json) => backend.templateAdd(json, req.user)), 1),
    '/api/template/update': withAuth(backend, withJson((req, json) => backend.templateUpdate(json, req.user)), 1),
    '/api/template/delete': withAuth(backend, withJson((req, json) => backend.templateDelete(json, req.user)), 1),
    '/api/template/list': withAuth(backend, (req) => backend.templateList(req.user), 1),
    '/api/template/get': withAuth(backend, withJson((req, json) => backend.templateGet(json, req.user)), 1),

    // 需要管理员权限 (user_role === 1)
    '/api/notify/add': withAuth(backend, withJson((req, json) => backend.notifyAdd(json, req.user)), 1),
    '/api/notify/update': withAuth(backend, withJson((req, json) => backend.notifyUpdate(json, req.user)), 1),
    '/api/notify/delete': withAuth(backend, withJson((req, json) => backend.notifyDelete(json, req.user)), 1),
    '/api/notify/list': withAuth(backend, (req) => backend.notifyList(req.user), 1),
    '/api/notify/get': withAuth(backend, withJson((req, json) => backend.notifyGet(json, req.user)), 1),

    // 需要管理员权限 (user_role === 1)
    '/api/user/get': withAuth(backend, withJson((req, json) => backend.userGet(json, req.user)), 1),
    '/api/user/list': withAuth(backend, (req) => backend.userList(), 1),
    '/api/user/delete': withAuth(backend, withJson((req, json) => backend.userDelete(json, req.user)), 1),
    '/api/user/update': withAuth(backend, withJson((req, json) => backend.userUpdate(json, req.user)), 1),
  };

  const GET_ROUTES = {
    // 公开页面
    '/login': () => frontend.loginPage(),
    '/register': () => frontend.registerPage(),

    // 需登录页面
    '/admin/index': withPageAuth(backend, () => frontend.adminIndexPage()),
    '/admin': withPageAuth(backend, () => frontend.adminIndexPage()),
    '/admin/cars': withPageAuth(backend, () => frontend.carManagerPage()),

    // 需管理员页面
    '/admin/users': withPageAuth(backend, () => frontend.userManagerPage(), 1),
    '/admin/templates': withPageAuth(backend, () => frontend.templateManagerPage(), 1),
    '/admin/notify': withPageAuth(backend, () => frontend.notifyManagerPage(), 1),
      // 兼容处理：访问 /?id=xxx 时，302 重定向到 /car/xxx
    '/': (req) => {
      const url = new URL(req.url);
      const id = url.searchParams.get('id');

      if (id) {
        // 如果存在 id 参数，执行 302 重定向
        return new Response(null, {
          status: 302,
          headers: {
            'Location': `/car/${id}`,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*'
          }
        });
      }

      // 无 id 参数时，跳转到登录页（避免返回 undefined 导致 1101 异常）
      return new Response(null, {
        status: 302,
        headers: {
          'Location': '/login',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*'
        }
      });
    }
  };

  // 动态路由表（支持 :param 格式）
  const DYNAMIC_GET_ROUTES = [
    {
      pattern: '/car/:id',
      handler: async (req, params) => {
        const htmlContent = await backend.carDetailPage(params.id);
        return new Response(htmlContent, {
          headers: {
            'Content-Type': 'text/html;charset=UTF-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*'
          }
        });
      }
    }
  ];

  return { POST_ROUTES, GET_ROUTES, DYNAMIC_GET_ROUTES };
}

// ==========================================
// 3. Cloudflare Pages Functions 主入口
// （由原 Worker 的 export default { fetch } 改造而来：
//   Pages Functions 通过 onRequest(context) 接收请求，
//   context.request 即 Request 对象，context.env 即环境绑定）
// ==========================================

export async function onRequest(context) {
  const { request, env } = context;

    // 1. 初始化当前请求的上下文实例
    const backend = new MoveCarBackend(env, config);
    const frontend = new MoveCarFrontend(config);

    // 2. 生成当前请求专属的路由表
    const { POST_ROUTES, GET_ROUTES, DYNAMIC_GET_ROUTES} = createRoutes(backend, frontend);

    const url = new URL(request.url);
    const pathname = url.pathname;

    // 3. 处理 OPTIONS 预检请求
    if (request.method === "OPTIONS") {
      return backend.getResponse("", 204);
    }

    // 4. 处理 POST 请求
    if (request.method === "POST") {
      const routeHandler = POST_ROUTES[pathname];
      if (routeHandler) {
        return await routeHandler(request);
      }
    }

    // 5. 处理 GET 请求
    if (request.method === "GET") {
      // 优先匹配静态路由表
      const routeHandler = GET_ROUTES[pathname];
      if (routeHandler) {
        return await routeHandler(request);
      }

      // 其次匹配动态路由表
      for (const dynamicRoute of DYNAMIC_GET_ROUTES) {
        const params = matchDynamicRoute(pathname, dynamicRoute.pattern);
        if (params) {
          return await dynamicRoute.handler(request, params);
        }
      }
    }

    // 6. 兜底 404 响应
    return new Response("Not Found", { status: 404 });
}

