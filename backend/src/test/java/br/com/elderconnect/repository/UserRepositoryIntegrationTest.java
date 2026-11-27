package br.com.elderconnect.repository;

import br.com.elderconnect.model.Role;
import br.com.elderconnect.model.User;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Este teste acessa o PostgreSQL REAL. Por seguranca so roda com DB_PASSWORD definido.
 * A transacao e revertida apos o teste: nenhum usuario ficticio fica gravado.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
@ActiveProfiles("postgres")
@EnabledIfEnvironmentVariable(named = "DB_PASSWORD", matches = ".+")
@Transactional
class UserRepositoryIntegrationTest {

    @Autowired
    private UserRepository repository;

    @Autowired
    private EntityManager entityManager;

    @Test
    void salvaEConsultaUsuarioNoPostgres() {
        String email = "teste-" + UUID.randomUUID() + "@example.test";
        User user = new User("Pessoa Teste", email, "hash-temporario-apenas-para-teste", Role.USER);

        User saved = repository.saveAndFlush(user);
        assertNotNull(saved.getId());
        assertNotNull(saved.getCreatedAt());

        entityManager.clear(); // Obriga consulta ao banco, nao somente ao cache do JPA.

        User loaded = repository.findByEmailIgnoreCase(email.toUpperCase()).orElseThrow();
        assertEquals(saved.getId(), loaded.getId());
        assertEquals("Pessoa Teste", loaded.getName());
        assertEquals(Role.USER, loaded.getRole());
        assertTrue(repository.existsByEmailIgnoreCase(email));
    }
}
