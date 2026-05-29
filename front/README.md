# 前端

导航页项目的 React + Vite 前端。

## 环境要求

- Node.js 20+

## 本地开发

```bash
npm install
npm run dev
```

开发服务运行在 `http://localhost:5173`，并把 `/api` 请求代理到 `http://localhost:8080`。

当 `/api/auth/me` 返回 `401` 时，前端会跳转到后端的 Authing 登录入口：

```text
http://localhost:8080/api/auth/login
```
