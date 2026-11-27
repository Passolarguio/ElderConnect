package br.com.elderconnect.service;

import br.com.elderconnect.dto.RegisterRequest;
import br.com.elderconnect.exception.ApiException;
import br.com.elderconnect.model.Role;
import br.com.elderconnect.model.User;
import br.com.elderconnect.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class RegistrationServiceTest {
    private UserRepository repository;
    private PasswordEncoder encoder;
    private RegistrationService service;

    @BeforeEach
    void setup() {
        repository = mock(UserRepository.class);
        encoder = new BCryptPasswordEncoder(4); // Custo baixo somente para o teste unitario.
        service = new RegistrationService(repository, encoder);
        when(repository.saveAndFlush(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void cadastraUsuarioComHashEEmailNormalizado() {
        User saved = service.register(new RegisterRequest("  Ana Silva  ",
                "  ANA@EXAMPLE.TEST  ", "SenhaSegura123!", Role.USER));

        assertEquals("Ana Silva", saved.getName());
        assertEquals("ana@example.test", saved.getEmail());
        assertEquals(Role.USER, saved.getRole());
        assertNotEquals("SenhaSegura123!", saved.getPasswordHash());
        assertTrue(encoder.matches("SenhaSegura123!", saved.getPasswordHash()));
        verify(repository).existsByEmailIgnoreCase("ana@example.test");
        verify(repository).saveAndFlush(any(User.class));
    }

    @Test
    void impedeEmailDuplicado() {
        when(repository.existsByEmailIgnoreCase("ana@example.test")).thenReturn(true);
        ApiException error = assertThrows(ApiException.class, () -> service.register(
                new RegisterRequest("Ana Silva", "ana@example.test", "SenhaSegura123!", Role.USER)));

        assertEquals(HttpStatus.CONFLICT, error.getStatus());
        assertEquals("EMAIL_ALREADY_EXISTS", error.getCode());
        verify(repository, never()).saveAndFlush(any(User.class));
    }

    @Test
    void recusaDadosInvalidos() {
        ApiException invalidName = assertThrows(ApiException.class, () -> service.register(
                new RegisterRequest(" ", "ana@example.test", "SenhaSegura123!", Role.USER)));
        assertEquals(HttpStatus.BAD_REQUEST, invalidName.getStatus());
        assertThrows(ApiException.class, () -> service.register(
                new RegisterRequest("Ana Silva", "email-invalido", "SenhaSegura123!", Role.USER)));
        assertThrows(ApiException.class, () -> service.register(
                new RegisterRequest("Ana Silva", "ana@example.test", "1234", Role.USER)));
        assertThrows(ApiException.class, () -> service.register(
                new RegisterRequest("Ana Silva", "ana@example.test", "SenhaSegura123!", null)));
        verify(repository, never()).saveAndFlush(any(User.class));
    }

    @Test
    void respeitaLimiteDeBytesDoBCrypt() {
        // 40 caracteres acentuados em UTF-8 = 80 bytes, acima dos 72 permitidos.
        String tooLong = "á".repeat(40);
        ApiException error = assertThrows(ApiException.class, () -> service.register(
                new RegisterRequest("Ana Silva", "ana@example.test", tooLong, Role.USER)));
        assertEquals("VALIDATION_ERROR", error.getCode());
    }

    @Test
    void conflitoDeUnicidadeRetorna409SemExporBanco() {
        when(repository.saveAndFlush(any(User.class)))
                .thenThrow(new org.springframework.dao.DataIntegrityViolationException("duplicate key in users"));
        ApiException error = assertThrows(ApiException.class, () -> service.register(
                new RegisterRequest("Ana Silva", "ana@example.test", "SenhaSegura123!", Role.ORGANIZER)));
        assertEquals(HttpStatus.CONFLICT, error.getStatus());
        assertFalse(error.getMessage().contains("duplicate key"));
    }
}
