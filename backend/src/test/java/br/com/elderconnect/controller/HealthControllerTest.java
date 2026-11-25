package br.com.elderconnect.controller;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

class HealthControllerTest {
    @Test
    void healthRetornaStatusOk() {
        assertEquals("ok", new HealthController().health().get("status"));
    }
}
