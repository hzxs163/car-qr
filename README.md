# 🚗 挪车通知系统（car-qr）

基于 **Cloudflare Pages Functions + D1 + KV** 的挪车二维码系统：给每辆车生成专属二维码贴纸，路人扫码即可一键**微信通知车主**或**拨打车主电话**，无需安装任何 App。

> 本项目由 [oozzbb/car-qrcode-notify](https://github.com/oozzbb/car-qrcode-notify)（Cloudflare Workers 版）改造而来，入口从 Workers 的 `export default { fetch }` 改为 Pages Functions 的 `export async function onRequest(context)`，**业务逻辑保持兼容**。改造原因：`*.workers.dev` 域名在国内被 DNS 污染，办公网/国内环境无法直连；Pages 的 `*.pages.dev` 域名通常可直接访问，且支持绑定自定义域名。

---

## ✨ 功能特性

| 功能 | 说明 |
|---|---|
| 🚗 车辆管理 | 增删改查，每辆车自动生成独立二维码 |
| 📱 扫码挪车页 | 路人扫码即用，模板可换、可自定义 |
| 🔔 微信通知 | 基于 WxPusher 推送，可自定义留言内容 |
| 📞 电话联系 | 一键拨打车主电话（`tel:` 协议） |
| 🎨 个性化二维码 | 彩色圆点二维码 + 完整挪车卡片（车牌号、提示语），一键打印 A6 贴纸 |
| 🧩 模板系统 | 5 个预置挪车页模板，支持 HTML 自定义、变量注入 |
| 👥 用户权限 | 管理员 / 普通用户，支持关闭公开注册（管理员仍可在后台添加用户） |
| 📱 移动端适配 | 后台管理页在手机上自适应，表格横向滑动 |

---

## 🧱 技术架构

```
┌─────────────────────────────────────────────┐
│  Cloudflare Pages（自定义域名 / *.pages.dev） │
│                                             │
│  functions/[[path]].js  ← 全部业务逻辑       │
│    ├─ 前台：挪车页 /car/:id                  │
│    ├─ 后台：/login /admin/cars 等            │
│    └─ API：/api/*（路由表 + JWT 鉴权）       │
│                                             │
│  ┌─────────┐   ┌─────────┐   ┌──────────┐  │
│  │ D1 数据库│   │ KV 缓存 │   │ WxPusher │  │
│  │ (绑定 DB)│   │(绑定DATA)│   │  微信推送 │  │
│  └─────────┘   └─────────┘   └──────────┘  │
└─────────────────────────────────────────────┘
```

- **Cloudflare Pages Functions**：`functions/[[path]].js` 为 catch-all 路由，页面与 API 全部由它处理，无构建步骤
- **D1 数据库**：SQLite 兼容，存储用户、车辆、模板、通知类型等（绑定名必须为 `DB`）
- **KV**：会话/速率限制等（绑定名必须为 `DATA`）
- **WxPusher**：免费微信推送服务，用于给车主发挪车通知

## 📁 目录结构

```
car-qr/
├── public/
│   └── _redirects        # 占位配置文件（保证 public 目录非空）
├── functions/
│   └── [[path]].js       # 全部业务逻辑（单文件，含前后端）
├── wrangler.toml         # Pages 配置 + D1 / KV 绑定
└── schema.sql            # D1 建表语句
```

---

## 🚀 快速部署

### 前置准备

- GitHub 账号（用于存放代码，Pages 连接 Git 仓库自动部署）
- Cloudflare 账号（免费）
- 微信：注册一个 [WxPusher](https://wxpusher.zjiecode.com) 账号（用于接收挪车通知）

### 第 1 步：上传代码

把本仓库代码推送到你的 GitHub 仓库（`functions/`、`public/`、`wrangler.toml`、`schema.sql`、`README.md`）。

### 第 2 步：创建 D1 数据库

1. Cloudflare Dashboard → **Workers 和 Pages** → **D1** → **创建数据库**
2. 名称随意（如 `car-qr`），创建后复制 **数据库 ID**（UUID 格式，如 `feae8b8f-xxxx-xxxx-xxxx-xxxxxxxxxxxx`）

### 第 3 步：创建 KV 命名空间

1. Dashboard → **Workers 和 Pages** → **KV** → **创建命名空间**
2. 名称随意（如 `car-qr-data`），创建后复制 **ID**（32 位十六进制）

### 第 4 步：配置 wrangler.toml

编辑 `wrangler.toml`，填入上面两个 ID：

```toml
name = "movecar-pages"
pages_build_output_dir = "public"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"                 # 变量名必须为 DB，与代码中 env.DB 对应
database_name = "car-qr"
database_id = "你的D1数据库ID"  # ← 替换

[[kv_namespaces]]
binding = "DATA"               # 变量名必须为 DATA，与代码中 env.DATA 对应
id = "你的KV命名空间ID"          # ← 替换
```

> ⚠️ **注意**：`database_name` 只是标识，**`database_id` 才是真正连接数据库的钥匙**。ID 填错或填成名称会报 `Error 8000022: Invalid database UUID`。

### 第 5 步：创建 Pages 项目并绑定

1. Dashboard → **Workers 和 Pages** → **创建** → **Pages** → **连接到 Git** → 选择你的仓库
2. 构建配置：
   - 构建命令：**留空**（无构建步骤）
   - 构建输出目录：**`public`**
3. 创建后进入项目 → **设置 → 函数 → 绑定**：
   - 添加 **D1 数据库**，变量名填 **`DB`**，选择刚创建的数据库
   - 添加 **KV 命名空间**，变量名填 **`DATA`**，选择刚创建的 KV
4. 推送代码到仓库（或手动触发部署），等待部署完成

> 绑定方式二选一即可：`wrangler.toml` 或 Dashboard 绑定。两者都配置也不冲突。

### 第 6 步：初始化数据库

1. Dashboard → **D1** → 进入你的数据库 → **控制台**
2. 把 `schema.sql` 的内容粘贴执行（建表）
3. （可选）初始化通知类型和模板，见下文「初始化数据」

### 第 7 步：初始化管理员

系统**默认关闭公开注册**（`canRegister: false`），两种方式创建管理员：

**方式 A（推荐，部署前）**：部署完成后、导入代码前，先临时把 `wrangler.toml` 同目录 `functions/[[path]].js` 顶部的 `"canRegister": false` 改为 `true`，访问 `/register` 注册第一个账号（**第一个注册的用户自动成为管理员**），注册完改回 `false` 再部署。

**方式 B（D1 控制台直接插入）**：

```sql
-- 密码需要先算好哈希（可先用任意密码注册一次后在 users 表复制哈希）
INSERT INTO users (user_name, user_pwd, user_role, add_time, status)
VALUES ('admin', '密码哈希', 1, '2026-01-01T00:00:00.000Z', 1);
```

> 管理员（`user_role = 1`）拥有全部权限；注册开关关闭后，管理员仍可在 **用户管理 → 添加用户** 中创建普通用户，不受限制。

### 第 8 步：访问后台

打开 `https://<你的项目名>.pages.dev/login` 登录，完成后续初始化。

---

## 🧩 初始化数据

### 1. 添加通知类型（WxPusher）

后台 → **通知管理** → **添加通知类型**：

| 字段 | 值 |
|---|---|
| 名称 | `WxPusher` |
| 提示 | `微信推送` |
| 请求方式 | `POST` |
| 请求URL | `https://wxpusher.zjiecode.com/api/send/message` |
| 请求体 | `{"appToken":"{{appToken}}","content":"{{message}}","summary":"{{title}}","uids":["{{uid}}"]}` |
| 成功标识 | `1000` |

> 变量说明：`{{appToken}}` / `{{uid}}` 来自**每辆车**上填的 AppToken 与 UID（添加/编辑车辆时分行填写，系统自动组装成 JSON）；`{{message}}` / `{{title}}` 为通知内容。

### 2. 添加模板

后台 → **模板管理** → **添加模板**，粘贴自定义 HTML 即可。模板支持变量：

| 变量 | 含义 |
|---|---|
| `{{no}}` | 车牌号 |
| `{{phone}}` | 车主手机号 |
| `{{is_notify}}` | 是否启用消息通知（`true`/`false`） |
| `{{is_call}}` | 是否启用电话通知（`true`/`false`） |

预置的 5 套模板（HTML）可在原项目仓库获取：`oozzbb/car-qrcode-notify` 的 `模板/` 目录。

### 3. 添加车辆并生成二维码

1. 后台 → **车辆管理** → **添加车辆**：填车牌号、手机号、AppToken、UID、选择通知类型与模板
2. 列表操作列点击 **二维码** 按钮：
   - 弹出**个性化彩色二维码 + 挪车卡片**（车牌号、提示语）
   - 点 **打印** 可打印成 A6 贴纸（打印时自动隐藏链接和按钮，只留卡片）
   - 路人扫码访问 `https://<域名>/car/<车辆ID>`，即可通知车主 / 拨打电话

---

## ⚙️ 配置项

`functions/[[path]].js` 顶部 `config` 对象：

| 配置 | 默认值 | 说明 |
|---|---|---|
| `canRegister` | `false` | 是否开启公开注册（第一个注册用户为管理员） |
| `notifyMessage` | `您好，有人需要您挪车，请及时处理。` | 默认通知留言 |
| `successMessage` | `您好，我已收到你的挪车通知...` | 通知成功后展示给路人的提示 |
| `rateLimitDelay` | `300` | 速率限制时间窗（秒） |
| `rateLimitMaxRequests` | `5` | 时间窗内最大请求次数 |
| `rateLimitMessage` | `我正在赶来的路上,请稍等片刻~~~` | 触发限流时的提示 |

---

## 🗄️ 数据库表

| 表 | 说明 |
|---|---|
| `users` | 用户（`user_role`：1=管理员，2=普通用户） |
| `cars` | 车辆（车牌、手机号、通知配置、模板、状态） |
| `templates` | 挪车页模板（HTML） |
| `notify` | 通知渠道类型（WxPusher 等） |
| `tokens` | 登录会话 |
| `rate_limits` | 速率限制 |

---

## ❓ 常见问题

**Q1：`*.workers.dev` 域名打不开？**
`workers.dev` 在国内被 DNS 污染。Pages 域名 `*.pages.dev` 通常可直连；**最稳妥是绑定自定义域名**（把域名托管到 Cloudflare 后，在 Pages 项目 → 自定义域中添加）。

**Q2：部署报 `Error 8000022: Invalid database UUID / KV namespace ID`？**
`wrangler.toml` 中填的不是 ID 而是名称。`database_id` 必须是 UUID 格式，KV `id` 必须是 32 位十六进制。

**Q3：部署后访问首页报 Error 1101（Worker threw exception）？**
访问根路径 `/` 不带 `?id=` 参数时，旧版代码会返回 undefined。已修复为自动跳转到 `/login`，请更新到最新代码。

**Q4：导入模板后扫码页只显示文字、按钮不显示？**
在 D1 控制台粘贴 SQL 时，如果**换行丢失**（变成长长一行），模板里的 JavaScript 行注释 `//` 会把同行后续代码全部注释掉。请用支持保留换行的方式执行 SQL，或使用修复压缩版模板 SQL。

**Q5：删除用户提示"网络错误"？**
车辆表和会话表外键引用了用户表。已修复为删除用户前**先清理该用户的车辆和会话**，再删除用户。

**Q6：怎么关掉注册，又能让管理员添加用户？**
把 `config.canRegister` 设为 `false` 关闭公开注册；后台 **用户管理 → 添加用户** 走管理员专用接口，不受影响。

---

## 📄 License

本项目基于 [oozzbb/car-qrcode-notify](https://github.com/oozzbb/car-qrcode-notify) 二次开发，仅供学习交流使用。
