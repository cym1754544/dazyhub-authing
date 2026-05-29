package com.dazyhub.authing.auth.session;

import com.dazyhub.authing.auth.protocol.AuthProtocolType;
import com.dazyhub.authing.user.entity.AppUser;
import com.dazyhub.authing.user.service.UserSyncService;
import jakarta.servlet.http.HttpSession;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class AuthSessionService {

  private static final String SESSION_USER_KEY = "AUTHING_USER";
  private static final String SESSION_PROTOCOL_KEY = "AUTHING_PROTOCOL";

  private final UserSyncService userSyncService;

  public AuthSessionService(UserSyncService userSyncService) {
    this.userSyncService = userSyncService;
  }

  public void login(HttpSession session, AppUser user) {
    // Session 中只保存本地用户 ID，本项目不持久化 Authing token。
    session.setAttribute(SESSION_USER_KEY, user.getId());
    session.removeAttribute(SESSION_PROTOCOL_KEY);
  }

  public void rememberProtocol(HttpSession session, AuthProtocolType protocolType) {
    // Authing 两种协议共用同一个回调地址，回调时需要知道本轮登录使用的协议。
    session.setAttribute(SESSION_PROTOCOL_KEY, protocolType);
  }

  public AuthProtocolType currentProtocol(HttpSession session) {
    Object protocol = session.getAttribute(SESSION_PROTOCOL_KEY);
    return protocol instanceof AuthProtocolType protocolType ? protocolType : AuthProtocolType.OIDC;
  }

  public Optional<AppUser> currentUser(HttpSession session) {
    Object userId = session.getAttribute(SESSION_USER_KEY);
    if (!(userId instanceof Long id)) {
      return Optional.empty();
    }
    return userSyncService.findById(id);
  }

  public void logout(HttpSession session) {
    session.invalidate();
  }
}
