package br.com.elderconnect.security;

import br.com.elderconnect.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;
import javax.crypto.SecretKey;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * JWT assinado HS256. Em ambiente real, JWT_SECRET deve conter Base64 de 32 bytes aleatorios.
 * Sem essa variavel, cria chave temporaria aleatoria apenas para desenvolvimento local.
 */
@Service
public class JwtService {
    private static final Logger log = LoggerFactory.getLogger(JwtService.class);
    private static final String ISSUER = "elderconnect";
    private final SecretKey signingKey;
    private final Duration lifetime;

    public JwtService(@Value("${JWT_SECRET:}") String base64Secret,
                      @Value("${JWT_TTL_HOURS:8}") long ttlHours) {
        if (ttlHours < 1 || ttlHours > 72) {
            throw new IllegalArgumentException("JWT_TTL_HOURS deve ficar entre 1 e 72.");
        }
        lifetime = Duration.ofHours(ttlHours);
        byte[] bytes;
        if (base64Secret == null || base64Secret.isBlank()) {
            bytes = new byte[32];
            new SecureRandom().nextBytes(bytes);
            log.warn("JWT_SECRET ausente: chave temporaria de desenvolvimento. "
                    + "Os tokens deixam de valer quando a API reiniciar.");
        } else {
            try {
                bytes = Decoders.BASE64.decode(base64Secret.trim());
            } catch (RuntimeException exception) {
                throw new IllegalStateException("JWT_SECRET deve conter Base64 de 32 bytes.", exception);
            }
            if (bytes.length != 32) {
                throw new IllegalStateException("JWT_SECRET deve decodificar exatamente 32 bytes.");
            }
        }
        signingKey = Keys.hmacShaKeyFor(bytes);
    }

    public String issue(User user) {
        if (user.getId() == null) {
            throw new IllegalStateException("Salve o usuario antes de emitir seu token.");
        }
        Instant now = Instant.now();
        return Jwts.builder()
                .issuer(ISSUER)
                .subject(user.getId().toString())
                .claim("role", user.getRole().name())
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(lifetime)))
                .signWith(signingKey, Jwts.SIG.HS256)
                .compact();
    }

    public UUID getUserId(String token) {
        Claims payload = Jwts.parser().verifyWith(signingKey).build()
                .parseSignedClaims(token).getPayload();
        if (!ISSUER.equals(payload.getIssuer())) {
            throw new JwtException("Emissor do JWT nao reconhecido.");
        }
        return UUID.fromString(payload.getSubject());
    }
}
