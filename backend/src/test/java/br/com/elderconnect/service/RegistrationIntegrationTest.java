package br.com.elderconnect.service;

import br.com.elderconnect.dto.RegisterRequest;
import br.com.elderconnect.exception.ApiException;
import br.com.elderconnect.model.Role;
import br.com.elderconnect.model.User;
import br.com.elderconnect.repository.UserRepository;
import jakarta.persistence.EntityManager;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

/** Testa o cadastro no banco real; rollback impede deixar usuario ficticio salvo. */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
@ActiveProfiles("postgres")
@EnabledIfEnvironmentVariable(named = "DB_PASSWORD", matches = ".+")
@Transactional
class RegistrationIntegrationTest {
    @Autowired RegistrationService service;
    @Autowired UserRepository repository;
    @Autowired PasswordEncoder passwordEncoder;
    @Autowired EntityManager entityManager;

    @Test
    void persisteUsuarioComBCryptEImpedeSegundoCadastro() {
        String email = "cadastro-" + UUID.randomUUID() + "@example.test";
        User registered = service.register(new RegisterRequest("Pessoa Integracao", email,
                "SenhaTestada123!", Role.ORGANIZER));

        assertNotNull(registered.getId());
        entityManager.clear();
        User loaded = repository.findByEmailIgnoreCase(email.toUpperCase()).orElseThrow();
        assertEquals(Role.ORGANIZER, loaded.getRole());
        assertNotEquals("SenhaTestada123!", loaded.getPasswordHash());
        assertTrue(passwordEncoder.matches("SenhaTestada123!", loaded.getPasswordHash()));

        ApiException error = assertThrows(ApiException.class, () -> service.register(
                new RegisterRequest("Outra Pessoa", email.toUpperCase(), "SenhaTestada123!", Role.USER)));
        assertEquals("EMAIL_ALREADY_EXISTS", error.getCode());
    }
}
