package com.dazyhub.authing.user.repository;

import com.dazyhub.authing.user.entity.AppUser;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<AppUser, Long> {

  Optional<AppUser> findByIssuerAndSubject(String issuer, String subject);
}
