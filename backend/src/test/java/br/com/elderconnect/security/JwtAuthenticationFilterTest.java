package br.com.elderconnect.security;

import br.com.elderconnect.model.Role;
import br.com.elderconnect.model.User;
import br.com.elderconnect.repository.UserRepository;
import jakarta.servlet.FilterChain;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class JwtAuthenticationFilterTest {
    private final JwtService jwt = mock(JwtService.class);
    private final UserRepository users = mock(UserRepository.class);
    private final JwtAuthenticationFilter filter = new JwtAuthenticationFilter(jwt, users);

    @AfterEach
    void clear() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void papelDoOrganizadorVemDoBanco() throws Exception {
        UUID id = UUID.randomUUID();
        var user = new User("Organizador", "org@example.test", "hash", Role.ORGANIZER);
        ReflectionTestUtils.setField(user, "id", id);
        when(jwt.getUserId("token-valido")).thenReturn(id);
        when(users.findById(id)).thenReturn(Optional.of(user));
        var request = new MockHttpServletRequest("GET", "/api/users/me");
        request.addHeader("Authorization", "Bearer token-valido");
        FilterChain chain = mock(FilterChain.class);

        filter.doFilter(request, new MockHttpServletResponse(), chain);

        var auth = SecurityContextHolder.getContext().getAuthentication();
        assertNotNull(auth);
        assertSame(user, auth.getPrincipal());
        assertTrue(auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ORGANIZER")));
        verify(chain).doFilter(any(), any());
    }

    @Test
    void tokenInvalidoNaoAutentica() throws Exception {
        when(jwt.getUserId("invalido")).thenThrow(new io.jsonwebtoken.JwtException("assinatura invalida"));
        var request = new MockHttpServletRequest("GET", "/api/users/me");
        request.addHeader("Authorization", "Bearer invalido");
        FilterChain chain = mock(FilterChain.class);
        filter.doFilter(request, new MockHttpServletResponse(), chain);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }
}
