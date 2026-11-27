package br.com.elderconnect.dto;

import br.com.elderconnect.model.Role;
import br.com.elderconnect.model.User;
import java.util.List;
import java.util.UUID;

/**
 * Dados publicos do usuario. A senha e seu hash NUNCA saem nesta resposta.
 * Campos de perfil serao persistidos em uma etapa posterior.
 */
public record UserResponse(
        UUID id,
        String name,
        String email,
        Role role,
        Integer age,
        String city,
        String state,
        String avatarUrl,
        List<String> interests
) {
    public static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(),
                user.getRole(), null, "", "SE", "", List.of());
    }
}
