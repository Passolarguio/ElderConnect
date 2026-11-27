package br.com.elderconnect.controller;

import br.com.elderconnect.dto.AuthResponse;
import br.com.elderconnect.dto.LoginRequest;
import br.com.elderconnect.dto.RegisterRequest;
import br.com.elderconnect.dto.UserResponse;
import br.com.elderconnect.security.JwtService;
import br.com.elderconnect.service.LoginService;
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
    private final LoginService login;
    private final JwtService jwt;

    public AuthController(RegistrationService registration, LoginService login, JwtService jwt) {
        this.registration = registration;
        this.login = login;
        this.jwt = jwt;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest input) {
        var user = registration.register(input);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AuthResponse(jwt.issue(user), UserResponse.from(user)));
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest input) {
        var user = login.authenticate(input);
        return new AuthResponse(jwt.issue(user), UserResponse.from(user));
    }
}
