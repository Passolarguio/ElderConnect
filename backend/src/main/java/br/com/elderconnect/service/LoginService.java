package br.com.elderconnect.service;

import br.com.elderconnect.dto.LoginRequest;
import br.com.elderconnect.exception.ApiException;
import br.com.elderconnect.model.User;
import br.com.elderconnect.repository.UserRepository;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Verifica as credenciais contra o hash BCrypt armazenado no banco. */
@Service
public class LoginService {
    private final UserRepository users;
    private final PasswordEncoder encoder;

    public LoginService(UserRepository users, PasswordEncoder encoder) {
        this.users = users;
        this.encoder = encoder;
    }

    @Transactional(readOnly = true)
    public User authenticate(LoginRequest input) {
        if (input == null || input.email() == null || input.password() == null
                || input.email().isBlank() || input.password().isEmpty()) {
            throw invalidCredentials();
        }
        String email = input.email().trim().toLowerCase(Locale.ROOT);
        if (email.length() > 254) {
            throw invalidCredentials();
        }
        User user = users.findByEmailIgnoreCase(email).orElseThrow(LoginService::invalidCredentials);
        if (!encoder.matches(input.password(), user.getPasswordHash())) {
            throw invalidCredentials();
        }
        return user;
    }

    private static ApiException invalidCredentials() {
        return new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS",
                "E-mail ou senha incorretos.");
    }
}
