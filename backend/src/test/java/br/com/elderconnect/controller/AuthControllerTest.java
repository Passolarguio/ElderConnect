package br.com.elderconnect.controller;

import br.com.elderconnect.dto.LoginRequest;
import br.com.elderconnect.dto.RegisterRequest;
import br.com.elderconnect.model.Role;
import br.com.elderconnect.model.User;
import br.com.elderconnect.security.JwtService;
import br.com.elderconnect.service.LoginService;
import br.com.elderconnect.service.RegistrationService;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthControllerTest {
    private final RegistrationService registration = mock(RegistrationService.class);
    private final LoginService login = mock(LoginService.class);
    private final JwtService jwt = mock(JwtService.class);
    private final AuthController controller = new AuthController(registration, login, jwt);

    @Test
    void cadastroRetornaTokenSemExporSenhaNemHash() {
        var input = new RegisterRequest("Ana Silva", "ana@example.test", "SenhaSegura123!", Role.USER);
        var user = new User("Ana Silva", "ana@example.test", "$2a$hash-interno", Role.USER);
        when(registration.register(input)).thenReturn(user);
        when(jwt.issue(user)).thenReturn("token-assinado");

        var result = controller.register(input);

        assertEquals(HttpStatus.CREATED, result.getStatusCode());
        assertNotNull(result.getBody());
        assertEquals("token-assinado", result.getBody().token());
        assertEquals("Ana Silva", result.getBody().user().name());
        assertNull(result.getBody().user().age());
        assertEquals("SE", result.getBody().user().state());
        assertTrue(java.util.Arrays.stream(result.getBody().user().getClass().getRecordComponents())
                .noneMatch(c -> c.getName().toLowerCase().contains("password")));
    }

    @Test
    void loginDeOrganizadorRetornaTokenEPerfil() {
        var input = new LoginRequest("org@example.test", "Senha123!");
        var user = new User("Joao", "org@example.test", "$2a$hash-interno", Role.ORGANIZER);
        when(login.authenticate(input)).thenReturn(user);
        when(jwt.issue(user)).thenReturn("token-organizador");

        var response = controller.login(input);

        assertEquals("token-organizador", response.token());
        assertEquals(Role.ORGANIZER, response.user().role());
    }
}
