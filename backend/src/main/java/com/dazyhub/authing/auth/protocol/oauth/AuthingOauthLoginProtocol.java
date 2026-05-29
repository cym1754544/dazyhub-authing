package com.dazyhub.authing.auth.protocol.oauth;

import cn.authing.sdk.java.client.AuthenticationClient;
import cn.authing.sdk.java.dto.authentication.IOauthParams;
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
public class AuthingOauthLoginProtocol implements AuthLoginProtocol {

  private final AuthingProperties authingProperties;
  private final AuthenticationClient authenticationClient;
  private final UserSyncService userSyncService;

  public AuthingOauthLoginProtocol(
      AuthingProperties authingProperties,
      @Qualifier("oauthAuthenticationClient") AuthenticationClient authenticationClient,
      UserSyncService userSyncService) {
    this.authingProperties = authingProperties;
    this.authenticationClient = authenticationClient;
    this.userSyncService = userSyncService;
  }

  @Override
  public String buildLoginUrl() {
    // OAuth 登录不需要 nonce；state 用于在回调时区分同一轮授权请求。
    IOauthParams params = new IOauthParams();
    params.setScope(authingProperties.getOauthScope());
    params.setResponseType(authingProperties.getResponseType());
    params.setRedirectUri(authingProperties.getRedirectUri());
    params.setState(UUID.randomUUID().toString());
    return authenticationClient.buildAuthorizeUrl(params);
  }

  @Override
  public AppUser handleCallback(String code) throws Exception {
    // OAuth 回调同样使用授权码换 token，再通过 access token 读取 Authing 用户资料。
    OIDCTokenResponse tokenResponse = authenticationClient.getAccessTokenByCode(code, authingProperties.getRedirectUri());
    UserInfo userInfo = authenticationClient.getUserInfoByAccessToken(tokenResponse.getAccessToken());
    return userSyncService.sync(userInfo);
  }
}
