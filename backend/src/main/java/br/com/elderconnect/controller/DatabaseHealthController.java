package br.com.elderconnect.controller;

import java.util.Map;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Testa a conexao com o banco executando uma consulta SQL real.
 * Este endpoint e temporario para desenvolvimento local.
 */
@RestController
public class DatabaseHealthController {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseHealthController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/api/health/database")
    public ResponseEntity<Map<String, String>> databaseHealth() {
        try {
            String databaseName = jdbcTemplate.queryForObject("SELECT current_database()", String.class);
            return ResponseEntity.ok(Map.of("status", "ok", "database", databaseName));
        } catch (DataAccessException exception) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("status", "error", "message", "Banco de dados indisponivel"));
        }
    }
}
