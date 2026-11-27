package br.com.elderconnect.controller;

import br.com.elderconnect.dto.RegisterRequest;
import br.com.elderconnect.dto.RegisterResponse;
import br.com.elderconnect.dto.UserResponse;
import br.com.elderconnect.service.RegistrationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final RegistrationService registration;

    public AuthController(RegistrationService registration) {
        this.registration = registration;
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest input) {
        var user = registration.register(input);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new RegisterResponse(UserResponse.from(user)));
    }
}
