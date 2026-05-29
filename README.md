# dazyhub-authing

导航页项目。

## 目录结构

- `backend`：Java Spring Boot 后端
- `front`：React + Vite 前端
- `Authing`：登录由 Authing 托管登录页处理

## 本地开发

启动后端：

```bash
cd backend
mvn spring-boot:run
```

启动前端：

```bash
cd front
npm install
npm run dev
```

未登录用户访问前端时会跳转到 `http://localhost:8080/api/auth/login`。
Authing 登录完成后的后端回调地址是 `http://localhost:8080/index`。
