package br.com.elderconnect.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.Locale;
import java.util.Objects;
import java.util.UUID;

/**
 * Entidade de persistencia: representa um usuario no banco relacional.
 * Nao e uma resposta JSON do frontend. A senha jamais deve ser exposta pela API.
 * Cadastro, BCrypt, autorizacao e DTOs serao implementados em commits futuros.
 */
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "name", nullable = false, length = 120)
    private String name;

    @Column(name = "email", nullable = false, length = 254)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 16)
    private Role role;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected User() {
        // Construtor sem argumentos exigido pelo JPA.
    }

    public User(String name, String email, String passwordHash, Role role) {
        this.name = Objects.requireNonNull(name, "name").trim();
        this.email = Objects.requireNonNull(email, "email").trim().toLowerCase(Locale.ROOT);
        this.passwordHash = Objects.requireNonNull(passwordHash, "passwordHash");
        this.role = Objects.requireNonNull(role, "role");
    }

    @PrePersist
    void beforeInsert() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }

    public UUID getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPasswordHash() { return passwordHash; }
    public Role getRole() { return role; }
    public Instant getCreatedAt() { return createdAt; }

    public void setName(String name) {
        this.name = Objects.requireNonNull(name, "name").trim();
    }

    public void setEmail(String email) {
        this.email = Objects.requireNonNull(email, "email").trim().toLowerCase(Locale.ROOT);
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = Objects.requireNonNull(passwordHash, "passwordHash");
    }

    public void setRole(Role role) {
        this.role = Objects.requireNonNull(role, "role");
    }
}
