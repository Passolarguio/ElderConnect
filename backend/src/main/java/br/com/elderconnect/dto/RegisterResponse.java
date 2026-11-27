package br.com.elderconnect.dto;

/**
 * Resposta provisoria da 03B. O campo token sera adicionado no commit 03C,
 * quando a autenticacao JWT for implementada.
 */
public record RegisterResponse(UserResponse user) {
}
