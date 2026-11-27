package br.com.elderconnect.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class UserTest {
    @Test
    void normalizaNomeEEmailNaCriacao() {
        User user = new User("  Maria Oliveira  ", "  MARIA@EXAMPLE.COM  ",
                "hash-de-teste-sem-senha-real", Role.USER);

        assertEquals("Maria Oliveira", user.getName());
        assertEquals("maria@example.com", user.getEmail());
        assertEquals(Role.USER, user.getRole());
        assertNull(user.getId()); // O identificador sera atribuido pelo Hibernate ao salvar.
    }
}
