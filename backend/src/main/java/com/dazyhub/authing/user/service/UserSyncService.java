package com.dazyhub.authing.user.service;

import cn.authing.sdk.java.dto.authentication.UserInfo;
import com.dazyhub.authing.config.AuthingProperties;
import com.dazyhub.authing.user.entity.AppUser;
import com.dazyhub.authing.user.repository.UserRepository;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserSyncService {

  private final AuthingProperties authingProperties;
  private final UserRepository userRepository;

  public UserSyncService(AuthingProperties authingProperties, UserRepository userRepository) {
    this.authingProperties = authingProperties;
    this.userRepository = userRepository;
  }

  @Transactional
  public AppUser sync(UserInfo userInfo) {
    // Authing 用户的稳定身份是 issuer + sub，重复登录会更新同一条本地用户记录。
    String issuer = authingProperties.oidcIssuer();
    String subject = userInfo.getSub();
    String email = "";
    String displayName =
        firstPresent(
            userInfo.getName(),
            userInfo.getNickname(),
            userInfo.getPreferredUsername(),
            userInfo.getGivenName(),
            subject);
    String avatarUrl = valueOrEmpty(userInfo.getPicture());
    AppUser user = userRepository.findByIssuerAndSubject(issuer, subject).orElseGet(() -> new AppUser(issuer, subject));

    user.refreshProfile(email, displayName, avatarUrl);
    return userRepository.save(user);
  }

  public Optional<AppUser> findById(Long id) {
    return userRepository.findById(id);
  }

  private String firstPresent(String... values) {
    for (String value : values) {
      if (value != null && !value.isBlank()) {
        return value;
      }
    }
    return "";
  }

  private String valueOrEmpty(String value) {
    return value == null ? "" : value;
  }
}
