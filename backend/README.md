# 后端

导航页项目的 Java Spring Boot 后端。

## 环境要求

- JDK 17+
- Maven 3.9+
- fnos 上的 PostgreSQL：`192.168.100.154:5433/dazyhub-authing`

数据库连接配置写在本地 `src/main/resources/application.yml`。
Authing 应用配置也写在本地 `src/main/resources/application.yml` 的 `authing` 节点中。
这个文件只保留在本机，已经加入 `.gitignore`，不会提交到代码仓库。
默认登录协议由 `authing.default-protocol` 控制，可选值是 `oidc` 或 `oauth`。
项目使用 Spring Data JPA，启动时会自动创建或更新 `app_user` 表，并在用户登录时同步 Authing 用户信息。

## 登录模块结构

- `auth/controller`：HTTP 入口，只负责跳转、回调、当前用户和退出接口。
- `auth/protocol`：登录协议抽象，后续新增 SAML、CAS 等协议时在这里扩展。
- `auth/protocol/oidc`：当前 Authing OIDC 登录协议实现。
- `auth/protocol/oauth`：Authing OAuth 2.0 登录协议实现。
- `auth/session`：统一管理本地登录 Session。
- `user`：本地用户实体、仓库和同步逻辑。

## 本地开发

```bash
mvn spring-boot:run
```

当前登录用户：

```bash
curl -i http://localhost:8080/api/auth/me
```
