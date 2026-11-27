package br.com.elderconnect.service;

import br.com.elderconnect.dto.LoginRequest;
import br.com.elderconnect.exception.ApiException;
import br.com.elderconnect.model.Role;
import br.com.elderconnect.model.User;
import br.com.elderconnect.repository.UserRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class LoginServiceTest {
    private final UserRepository repository = mock(UserRepository.class);
    private final PasswordEncoder encoder = new BCryptPasswordEncoder(4);
    private final LoginService service = new LoginService(repository, encoder);

    @Test
    void aceitaEmailNormalizadoESenhaCorreta() {
        var user = new User("Ana", "ana@example.test", encoder.encode("SenhaSegura123!"), Role.USER);
        when(repository.findByEmailIgnoreCase("ana@example.test")).thenReturn(Optional.of(user));
        assertSame(user, service.authenticate(new LoginRequest("  ANA@EXAMPLE.TEST ", "SenhaSegura123!")));
    }

    @Test
    void organizadorTambemConsegueEntrar() {
        var user = new User("Joao", "org@example.test", encoder.encode("SenhaSegura123!"), Role.ORGANIZER);
        when(repository.findByEmailIgnoreCase("org@example.test")).thenReturn(Optional.of(user));
        assertEquals(Role.ORGANIZER,
                service.authenticate(new LoginRequest("org@example.test", "SenhaSegura123!")).getRole());
    }

    @Test
    void senhaErradaOuEmailDesconhecidoRetornamMesmoErro() {
        var user = new User("Ana", "ana@example.test", encoder.encode("SenhaSegura123!"), Role.USER);
        when(repository.findByEmailIgnoreCase("ana@example.test")).thenReturn(Optional.of(user));
        var senhaErrada = assertThrows(ApiException.class, () ->
                service.authenticate(new LoginRequest("ana@example.test", "senha-errada")));
        var semConta = assertThrows(ApiException.class, () ->
                service.authenticate(new LoginRequest("outra@example.test", "SenhaSegura123!")));
        assertEquals(HttpStatus.UNAUTHORIZED, senhaErrada.getStatus());
        assertEquals("INVALID_CREDENTIALS", senhaErrada.getCode());
        assertEquals(senhaErrada.getMessage(), semConta.getMessage());
    }

    @Test
    void naoAceitaDadosVazios() {
        assertThrows(ApiException.class, () -> service.authenticate(null));
        assertThrows(ApiException.class, () -> service.authenticate(new LoginRequest(null, "senha")));
        assertThrows(ApiException.class, () -> service.authenticate(new LoginRequest("ana@example.test", "")));
        verifyNoInteractions(repository);
    }
}
