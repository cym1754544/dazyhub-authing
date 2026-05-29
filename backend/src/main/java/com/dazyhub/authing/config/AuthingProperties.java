package com.dazyhub.authing.config;

import com.dazyhub.authing.auth.protocol.AuthProtocolType;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import java.util.Locale;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "authing")
public class AuthingProperties {

  @NotBlank(message = "Authing 应用 ID 不能为空")
  private String appId;

  @NotBlank(message = "Authing 应用密钥不能为空")
  private String appSecret;

  @NotBlank(message = "Authing 应用域名不能为空")
  private String appHost;

  @NotBlank(message = "Authing 回调地址不能为空")
  private String redirectUri;

  @NotBlank(message = "OIDC 授权范围不能为空")
  private String oidcScope;

  @NotBlank(message = "OAuth 授权范围不能为空")
  private String oauthScope;

  @NotBlank(message = "授权响应类型不能为空")
  private String responseType = "code";

  @NotBlank(message = "默认登录协议不能为空")
  private String defaultProtocol = "oidc";

  public String getAppId() {
    return appId;
  }

  public void setAppId(String appId) {
    this.appId = appId;
  }

  public String getAppSecret() {
    return appSecret;
  }

  public void setAppSecret(String appSecret) {
    this.appSecret = appSecret;
  }

  public String getAppHost() {
    return appHost;
  }

  public void setAppHost(String appHost) {
    this.appHost = trimTrailingSlash(appHost);
  }

  public String getRedirectUri() {
    return redirectUri;
  }

  public void setRedirectUri(String redirectUri) {
    this.redirectUri = redirectUri;
  }

  public String getOidcScope() {
    return oidcScope;
  }

  public void setOidcScope(String oidcScope) {
    this.oidcScope = oidcScope;
  }

  public String getOauthScope() {
    return oauthScope;
  }

  public void setOauthScope(String oauthScope) {
    this.oauthScope = oauthScope;
  }

  public String getResponseType() {
    return responseType;
  }

  public void setResponseType(String responseType) {
    this.responseType = responseType;
  }

  public String getDefaultProtocol() {
    return defaultProtocol;
  }

  public void setDefaultProtocol(String defaultProtocol) {
    this.defaultProtocol = defaultProtocol;
  }

  public AuthProtocolType defaultProtocolType() {
    // 配置文件里使用小写协议名，程序内部统一转换成枚举。
    return switch (defaultProtocol.toLowerCase(Locale.ROOT)) {
      case "oidc" -> AuthProtocolType.OIDC;
      case "oauth" -> AuthProtocolType.OAUTH;
      default -> throw new IllegalArgumentException("不支持的默认登录协议：" + defaultProtocol);
    };
  }

  @AssertTrue(message = "默认登录协议只能配置为 oidc 或 oauth")
  public boolean isDefaultProtocolSupported() {
    // 启动阶段提前校验协议名，避免用户点击登录时才发现配置错误。
    if (defaultProtocol == null) {
      return false;
    }
    String protocol = defaultProtocol.toLowerCase(Locale.ROOT);
    return "oidc".equals(protocol) || "oauth".equals(protocol);
  }

  public String oidcIssuer() {
    return appHost + "/oidc";
  }

  private String trimTrailingSlash(String value) {
    if (value == null || value.isBlank()) {
      return value;
    }
    return value.endsWith("/") ? value.substring(0, value.length() - 1) : value;
  }
}
