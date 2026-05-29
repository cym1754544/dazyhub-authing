package com.dazyhub.authing.config;

import cn.authing.sdk.java.client.AuthenticationClient;
import cn.authing.sdk.java.enums.ProtocolEnum;
import cn.authing.sdk.java.model.AuthenticationClientOptions;
import java.io.IOException;
import java.text.ParseException;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(AuthingProperties.class)
public class AuthingClientConfig {

  private final AuthingProperties authingProperties;

  public AuthingClientConfig(AuthingProperties authingProperties) {
    this.authingProperties = authingProperties;
  }

  @Bean
  AuthenticationClient oidcAuthenticationClient() throws IOException, ParseException {
    return createAuthenticationClient(ProtocolEnum.OIDC.getValue());
  }

  @Bean
  AuthenticationClient oauthAuthenticationClient() throws IOException, ParseException {
    return createAuthenticationClient(ProtocolEnum.OAUTH.getValue());
  }

  private AuthenticationClient createAuthenticationClient(String protocol) throws IOException, ParseException {
    // Authing 应用参数统一放在 application.yml，方便后续按环境切换。
    AuthenticationClientOptions options = new AuthenticationClientOptions();
    options.setAppId(authingProperties.getAppId());
    options.setAppSecret(authingProperties.getAppSecret());
    options.setAppHost(authingProperties.getAppHost());
    options.setRedirectUri(authingProperties.getRedirectUri());
    options.setScope(authingProperties.getOidcScope());
    options.setProtocol(protocol);
    return new AuthenticationClient(options);
  }
}
