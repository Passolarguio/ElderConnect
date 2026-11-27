package br.com.elderconnect.service;

import br.com.elderconnect.dto.RegisterRequest;
import br.com.elderconnect.exception.ApiException;
import br.com.elderconnect.model.User;
import br.com.elderconnect.repository.UserRepository;
import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.regex.Pattern;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Regras de cadastro independentes do protocolo HTTP e da interface React. */
@Service
public class RegistrationService {
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");

    private final UserRepository users;
    private final PasswordEncoder encoder;

    public RegistrationService(UserRepository users, PasswordEncoder encoder) {
        this.users = users;
        this.encoder = encoder;
    }

    @Transactional
    public User register(RegisterRequest input) {
        if (input == null) {
            throw badRequest("Informe os dados do cadastro.");
        }
        String name = input.fullName() == null ? "" : input.fullName().trim();
        String email = input.email() == null ? "" : input.email().trim().toLowerCase(Locale.ROOT);
        String password = input.password();

        if (name.length() < 2 || name.length() > 120) {
            throw badRequest("O nome deve conter entre 2 e 120 caracteres.");
        }
        if (email.length() > 254 || !EMAIL_PATTERN.matcher(email).matches()) {
            throw badRequest("Informe um e-mail valido.");
        }
        // BCrypt usa no maximo 72 bytes UTF-8. Evitar truncamento silencioso.
        if (password == null || password.isBlank() || password.length() < 8
                || password.getBytes(StandardCharsets.UTF_8).length > 72) {
            throw badRequest("A senha deve ter ao menos 8 caracteres e no maximo 72 bytes UTF-8.");
        }
        if (input.role() == null) {
            throw badRequest("Escolha USER ou ORGANIZER como tipo de conta.");
        }
        if (users.existsByEmailIgnoreCase(email)) {
            throw emailConflict();
        }

        User user = new User(name, email, encoder.encode(password), input.role());
        try {
            // Flush executa o INSERT agora e detecta conflitos de unicidade.
            return users.saveAndFlush(user);
        } catch (DataIntegrityViolationException exception) {
            // Em cadastros simultaneos, o indice UNIQUE do PostgreSQL e a ultima barreira.
            throw emailConflict();
        }
    }

    private static ApiException badRequest(String message) {
        return new ApiException(HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", message);
    }

    private static ApiException emailConflict() {
        return new ApiException(HttpStatus.CONFLICT, "EMAIL_ALREADY_EXISTS", "Este e-mail ja esta cadastrado.");
    }
}
