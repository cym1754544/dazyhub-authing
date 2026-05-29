package com.dazyhub.authing.auth.controller;

import com.dazyhub.authing.auth.protocol.AuthProtocolType;
import com.dazyhub.authing.auth.protocol.oauth.AuthingOauthLoginProtocol;
import com.dazyhub.authing.auth.protocol.oidc.AuthingOidcLoginProtocol;
import com.dazyhub.authing.auth.session.AuthSessionService;
import com.dazyhub.authing.config.AuthingProperties;
import com.dazyhub.authing.user.entity.AppUser;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping
public class AuthController {

  private final AuthingOidcLoginProtocol authingOidcLoginProtocol;
  private final AuthingOauthLoginProtocol authingOauthLoginProtocol;
  private final AuthSessionService authSessionService;
  private final AuthingProperties authingProperties;
  private final String frontendUrl;

  public AuthController(
      AuthingOidcLoginProtocol authingOidcLoginProtocol,
      AuthingOauthLoginProtocol authingOauthLoginProtocol,
      AuthSessionService authSessionService,
      AuthingProperties authingProperties,
      @Value("${app.frontend-url}") String frontendUrl) {
    this.authingOidcLoginProtocol = authingOidcLoginProtocol;
    this.authingOauthLoginProtocol = authingOauthLoginProtocol;
    this.authSessionService = authSessionService;
    this.authingProperties = authingProperties;
    this.frontendUrl = frontendUrl;
  }

  @GetMapping({"/api/auth/login", "/oauth2/authorization/authing"})
  public void login(HttpSession session, HttpServletResponse response) throws IOException {
    // 默认登录入口由配置控制，前端无需因为协议切换而改代码。
    AuthProtocolType defaultProtocol = authingProperties.defaultProtocolType();
    authSessionService.rememberProtocol(session, defaultProtocol);
    response.sendRedirect(buildLoginUrl(defaultProtocol));
  }

  @GetMapping("/api/auth/login/oauth")
  public void oauthLogin(HttpSession session, HttpServletResponse response) throws IOException {
    authSessionService.rememberProtocol(session, AuthProtocolType.OAUTH);
    response.sendRedirect(authingOauthLoginProtocol.buildLoginUrl());
  }

  @GetMapping("/index")
  public void callback(@RequestParam("code") String code, HttpSession session, HttpServletResponse response)
      throws Exception {
    AppUser user =
        switch (authSessionService.currentProtocol(session)) {
          case OAUTH -> authingOauthLoginProtocol.handleCallback(code);
          case OIDC -> authingOidcLoginProtocol.handleCallback(code);
        };
    authSessionService.login(session, user);
    response.sendRedirect(frontendUrl + "/");
  }

  @GetMapping("/api/auth/me")
  public ResponseEntity<Map<String, Object>> me(HttpSession session) {
    // 前端用这个接口的 401 响应判断是否需要发起 Authing 登录。
    return authSessionService
        .currentUser(session)
        .map(
            user ->
                ResponseEntity.ok(
                    Map.<String, Object>of(
                        "id", user.getId(),
                        "issuer", user.getIssuer(),
                        "sub", user.getSubject(),
                        "name", user.getDisplayName(),
                        "email", user.getEmail(),
                        "picture", user.getAvatarUrl())))
        .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
  }

  @PostMapping("/api/auth/logout")
  public ResponseEntity<Void> logout(HttpSession session) {
    authSessionService.logout(session);
    return ResponseEntity.noContent().build();
  }

  private String buildLoginUrl(AuthProtocolType protocolType) {
    return switch (protocolType) {
      case OAUTH -> authingOauthLoginProtocol.buildLoginUrl();
      case OIDC -> authingOidcLoginProtocol.buildLoginUrl();
    };
  }
}
