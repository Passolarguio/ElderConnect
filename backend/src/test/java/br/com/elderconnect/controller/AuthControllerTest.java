package br.com.elderconnect.controller;

import br.com.elderconnect.dto.RegisterRequest;
import br.com.elderconnect.model.Role;
import br.com.elderconnect.model.User;
import br.com.elderconnect.service.RegistrationService;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthControllerTest {
    @Test
    void retornoDoCadastroNaoExpoeSenhaNemHash() {
        RegistrationService service = mock(RegistrationService.class);
        RegisterRequest input = new RegisterRequest("Ana Silva", "ana@example.test", "SenhaSegura123!", Role.USER);
        when(service.register(input)).thenReturn(new User("Ana Silva", "ana@example.test", "$2a$hash-interno", Role.USER));

        var result = new AuthController(service).register(input);

        assertEquals(HttpStatus.CREATED, result.getStatusCode());
        assertNotNull(result.getBody());
        assertEquals("Ana Silva", result.getBody().user().name());
        assertNull(result.getBody().user().age());
        assertEquals("SE", result.getBody().user().state());
        assertEquals(0, result.getBody().user().interests().size());
        assertTrue(java.util.Arrays.stream(result.getBody().user().getClass().getRecordComponents())
                .noneMatch(component -> component.getName().toLowerCase().contains("password")));
        verify(service).register(input);
    }
}
