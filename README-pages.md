# car-qrcode-notify —— Cloudflare Pages Functions 版

由原 Workers 版（`worker.js` 单文件）改造而来，**代码逻辑零改动**，仅把入口从
`export default { async fetch(request, env) }` 改为 Pages Functions 的
`export async function onRequest(context)`。

## 目录结构

```
car-qrcode-notify-pages/
├── public/
│   └── _redirects        # 占位配置文件（保证目录非空，不影响路由）
├── functions/
│   └── [[path]].js       # 全部业务逻辑（原 worker.js，catch-all 路由）
├── wrangler.toml         # Pages 项目配置（D1 + KV 绑定）
└── schema.sql            # D1 建表语句
```

## 与原 Workers 版的差异

| 项目 | Workers 版 | Pages Functions 版 |
|---|---|---|
| 入口 | `export default { fetch }` | `export async function onRequest(context)` |
| 请求对象 | `request` | `context.request` |
| 绑定对象 | `env` | `context.env` |
| 数据库 | D1（绑定名 DB） | 相同 |
| KV | KV（绑定名 DATA） | 相同 |
| 路由 | 代码内路由表 | `functions/[[path]].js` catch-all，行为一致 |

## 部署步骤（命令行方式）

```bash
cd car-qrcode-notify-pages

# 1.（首次）创建 D1 数据库并建表
npx wrangler d1 create movecar-db
# 把输出中的 database_id 填入 wrangler.toml

# 2.（首次）创建 KV 命名空间
npx wrangler kv namespace create DATA
# 把输出中的 id 填入 wrangler.toml

# 3. 执行建表语句
npx wrangler d1 execute movecar-db --file=schema.sql --remote

# 4. 本地调试
npx wrangler pages dev public

# 5. 部署
npx wrangler pages deploy public
```

> 已有原 Workers 项目的 D1 / KV 时无需重建：直接复用原 database_id 和
> KV namespace id 填入 `wrangler.toml` 即可，车辆数据原样保留。

## 部署步骤（网页 Dashboard 方式）

1. Cloudflare Dashboard → **Workers 和 Pages** → **创建** → **Pages** → 连接 Git 仓库（或上传 `public` 目录）。
2. 构建配置：构建命令留空，**构建输出目录填 `public`**。
3. 部署完成后进入项目 **设置 → 函数 → 绑定**：
   - 添加 **D1 数据库**，变量名填 **`DB`**，选择你的 `movecar-db`；
   - 添加 **KV 命名空间**，变量名填 **`DATA`**，选择你的 KV。
4. 到 D1 控制台执行 `schema.sql` 建表。
5. 访问 `https://<项目名>.pages.dev/login` 登录后台。

## 访问地址

- 登录页：`https://<项目名>.pages.dev/login`
- 注册页：`https://<项目名>.pages.dev/register`（第一个注册的为管理员）

## 关于域名无法访问的问题

原 Workers 域名 `*.workers.dev` 在国内被 DNS 污染，办公网/国内直连不通。
Pages 默认域名 `*.pages.dev` 通常可直连，但也不保证 100% 稳定。
**最可靠的方案是绑定自定义域名**：

1. 将你的域名托管到 Cloudflare（或把 DNS 接入 Cloudflare）。
2. Pages 项目 → **自定义域** → **设置自定义域**，添加 `xxx.example.com`。
3. 访问 `https://xxx.example.com` 即可，走 Cloudflare CDN。

> 注意：Pages Functions 本质上运行在 Workers 运行时上，与 Worker 是同一套
> 技术。若公司内网是白名单制（只允许特定域名），则任何 Cloudflare 域名都
> 可能不通，此时需要自建反代（如 VPS + Nginx/Caddy 反代到自定义域名）。
