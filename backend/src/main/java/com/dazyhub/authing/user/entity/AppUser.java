package com.dazyhub.authing.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.OffsetDateTime;

@Entity
@Table(
    name = "app_user",
    uniqueConstraints = @UniqueConstraint(name = "app_user_identity_unique", columnNames = {"issuer", "subject"}))
public class AppUser {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 255)
  private String issuer;

  @Column(nullable = false, length = 255)
  private String subject;

  @Column(length = 320)
  private String email;

  @Column(name = "display_name", length = 255)
  private String displayName;

  @Column(name = "avatar_url", columnDefinition = "text")
  private String avatarUrl;

  @Column(name = "created_at", nullable = false)
  private OffsetDateTime createdAt;

  @Column(name = "updated_at", nullable = false)
  private OffsetDateTime updatedAt;

  @Column(name = "last_login_at")
  private OffsetDateTime lastLoginAt;

  protected AppUser() {}

  public AppUser(String issuer, String subject) {
    this.issuer = issuer;
    this.subject = subject;
  }

  public Long getId() {
    return id;
  }

  public String getIssuer() {
    return issuer;
  }

  public String getSubject() {
    return subject;
  }

  public String getEmail() {
    return email;
  }

  public String getDisplayName() {
    return displayName;
  }

  public String getAvatarUrl() {
    return avatarUrl;
  }

  public void refreshProfile(String email, String displayName, String avatarUrl) {
    OffsetDateTime now = OffsetDateTime.now();
    this.email = email;
    this.displayName = displayName;
    this.avatarUrl = avatarUrl;
    this.lastLoginAt = now;
    this.updatedAt = now;
    if (this.createdAt == null) {
      this.createdAt = now;
    }
  }
}
