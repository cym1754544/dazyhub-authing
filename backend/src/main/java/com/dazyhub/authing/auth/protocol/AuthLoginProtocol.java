package com.dazyhub.authing.auth.protocol;

import com.dazyhub.authing.user.entity.AppUser;

public interface AuthLoginProtocol {

  String buildLoginUrl();

  AppUser handleCallback(String code) throws Exception;
}
