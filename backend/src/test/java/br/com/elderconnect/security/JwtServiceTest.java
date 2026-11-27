package br.com.elderconnect.security;

import br.com.elderconnect.model.Role;
import br.com.elderconnect.model.User;
import io.jsonwebtoken.JwtException;
import java.util.Base64;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {
    private static JwtService newService(byte marker) {
        byte[] key = new byte[32];
        java.util.Arrays.fill(key, marker);
        return new JwtService(Base64.getEncoder().encodeToString(key), 8);
    }

    @Test
    void tokenTemAssinaturaValidadaEIdentificaUsuario() {
        var service = newService((byte) 11);
        var user = new User("Ana", "ana@example.test", "hash", Role.USER);
        UUID id = UUID.randomUUID();
        ReflectionTestUtils.setField(user, "id", id);
        String token = service.issue(user);

        assertEquals(3, token.split("\\.").length);
        assertEquals(id, service.getUserId(token));
        assertThrows(JwtException.class, () -> newService((byte) 22).getUserId(token));
    }

    @Test
    void rejeitaChaveMuitoCurta() {
        assertThrows(IllegalStateException.class, () ->
                new JwtService(Base64.getEncoder().encodeToString(new byte[8]), 8));
    }

    @Test
    void usuarioNaoPersistidoNaoRecebeToken() {
        assertThrows(IllegalStateException.class, () -> newService((byte) 11)
                .issue(new User("Ana", "ana@example.test", "hash", Role.USER)));
    }
}
