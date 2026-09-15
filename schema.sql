-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT UNIQUE NOT NULL,
    user_pwd TEXT NOT NULL,
    user_role INTEGER DEFAULT 2,
    add_time TEXT NOT NULL,
    status INTEGER DEFAULT 1
);

-- 车辆表
CREATE TABLE IF NOT EXISTS cars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    user_name TEXT,
    no TEXT,
    phone TEXT,
    notify_id INTEGER DEFAULT 0,
    notify_name TEXT,
    notify_token TEXT,
    is_notify INTEGER DEFAULT 1,
    is_call INTEGER DEFAULT 1,
    template_id INTEGER DEFAULT 0,
    template_name TEXT,
    status INTEGER DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 模板表
CREATE TABLE IF NOT EXISTS templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    value TEXT NOT NULL,
    add_time TEXT NOT NULL,
    status INTEGER DEFAULT 1
);

-- 通知类型表
CREATE TABLE IF NOT EXISTS notify (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    tip TEXT,
    method TEXT,
    url TEXT,
    body TEXT,
    header TEXT,
    success TEXT,
    add_time TEXT NOT NULL,
    status INTEGER DEFAULT 1
);

-- Token表（会话管理）
CREATE TABLE IF NOT EXISTS tokens (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expires_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 速率限制表（可选，如果想使用D1存储速率限制数据）
CREATE TABLE IF NOT EXISTS rate_limits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    count INTEGER DEFAULT 1,
    created_at INTEGER NOT NULL
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_users_user_name ON users(user_name);
CREATE INDEX IF NOT EXISTS idx_tokens_user_id ON tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_tokens_expires_at ON tokens(expires_at);