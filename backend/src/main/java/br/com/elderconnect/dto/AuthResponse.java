package br.com.elderconnect.dto;

/** Contrato compartilhado por cadastro e login: o React espera { token, user }. */
public record AuthResponse(String token, UserResponse user) {
}
