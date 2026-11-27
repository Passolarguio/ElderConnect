package br.com.elderconnect.service;

import br.com.elderconnect.dto.LoginRequest;
import br.com.elderconnect.dto.RegisterRequest;
import br.com.elderconnect.exception.ApiException;
import br.com.elderconnect.model.Role;
import br.com.elderconnect.security.JwtService;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

/** Banco real; ao finalizar, rollback remove os cadastros ficticios. */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@ActiveProfiles("postgres")
@EnabledIfEnvironmentVariable(named = "DB_PASSWORD", matches = ".+")
@Transactional
class LoginIntegrationTest {
    @Autowired RegistrationService registration;
    @Autowired LoginService login;
    @Autowired JwtService jwt;

    @Test
    void usuarioEOrganizadorEntramERecebemJwtAssinado() {
        for (Role role : Role.values()) {
            String email = "login-" + UUID.randomUUID() + "@example.test";
            var created = registration.register(new RegisterRequest(
                    "Pessoa Teste", email, "SenhaTeste123!", role));
            var logged = login.authenticate(new LoginRequest(
                    email.toUpperCase(), "SenhaTeste123!"));
            assertEquals(created.getId(), logged.getId());
            assertEquals(role, logged.getRole());
            assertEquals(created.getId(), jwt.getUserId(jwt.issue(logged)));
            assertThrows(ApiException.class, () ->
                    login.authenticate(new LoginRequest(email, "senha-incorreta")));
        }
    }
}
