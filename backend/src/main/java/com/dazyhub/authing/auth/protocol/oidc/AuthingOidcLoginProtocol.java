package com.dazyhub.authing.auth.protocol.oidc;

import cn.authing.sdk.java.client.AuthenticationClient;
import cn.authing.sdk.java.dto.authentication.IOidcParams;
import cn.authing.sdk.java.dto.authentication.OIDCTokenResponse;
import cn.authing.sdk.java.dto.authentication.UserInfo;
import com.dazyhub.authing.auth.protocol.AuthLoginProtocol;
import com.dazyhub.authing.config.AuthingProperties;
import com.dazyhub.authing.user.entity.AppUser;
import com.dazyhub.authing.user.service.UserSyncService;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

@Service
public class AuthingOidcLoginProtocol implements AuthLoginProtocol {

  private final AuthingProperties authingProperties;
  private final AuthenticationClient authenticationClient;
  private final UserSyncService userSyncService;

  public AuthingOidcLoginProtocol(
      AuthingProperties authingProperties,
      @Qualifier("oidcAuthenticationClient") AuthenticationClient authenticationClient,
      UserSyncService userSyncService) {
    this.authingProperties = authingProperties;
    this.authenticationClient = authenticationClient;
    this.userSyncService = userSyncService;
  }

  @Override
  public String buildLoginUrl() {
    // OIDC 登录需要 state 和 nonce，后续接入其他协议时只需新增对应协议实现。
    IOidcParams params = new IOidcParams();
    params.setScope(authingProperties.getOidcScope());
    params.setResponseType(authingProperties.getResponseType());
    params.setRedirectUri(authingProperties.getRedirectUri());
    params.setState(UUID.randomUUID().toString());
    params.setNonce(UUID.randomUUID().toString());
    return authenticationClient.buildAuthorizeUrl(params);
  }

  @Override
  public AppUser handleCallback(String code) throws Exception {
    // Authing 回调只带一次性 code，本地用 code 换 token 后再拉取用户资料。
    OIDCTokenResponse tokenResponse = authenticationClient.getAccessTokenByCode(code);
    UserInfo userInfo = authenticationClient.getUserInfoByAccessToken(tokenResponse.getAccessToken());
    return userSyncService.sync(userInfo);
  }
}
