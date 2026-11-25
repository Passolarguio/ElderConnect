package br.com.elderconnect.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;

class DatabaseHealthControllerTest {

    @Test
    void bancoDisponivelRetornaNomeDoBanco() {
        JdbcTemplate jdbcTemplate = mock(JdbcTemplate.class);
        when(jdbcTemplate.queryForObject("SELECT current_database()", String.class))
                .thenReturn("elderconnect");

        var response = new DatabaseHealthController(jdbcTemplate).databaseHealth();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("ok", response.getBody().get("status"));
        assertEquals("elderconnect", response.getBody().get("database"));
    }

    @Test
    void bancoIndisponivelRetorna503SemExporCredenciais() {
        JdbcTemplate jdbcTemplate = mock(JdbcTemplate.class);
        when(jdbcTemplate.queryForObject("SELECT current_database()", String.class))
                .thenThrow(new DataAccessResourceFailureException("conexao indisponivel"));

        var response = new DatabaseHealthController(jdbcTemplate).databaseHealth();

        assertEquals(HttpStatus.SERVICE_UNAVAILABLE, response.getStatusCode());
        assertEquals("error", response.getBody().get("status"));
    }
}
