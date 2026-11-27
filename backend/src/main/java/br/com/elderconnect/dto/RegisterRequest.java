package br.com.elderconnect.dto;

import br.com.elderconnect.model.Role;

/** Campos recebidos no cadastro. O role aceita apenas USER ou ORGANIZER. */
public record RegisterRequest(String fullName, String email, String password, Role role) {
}
