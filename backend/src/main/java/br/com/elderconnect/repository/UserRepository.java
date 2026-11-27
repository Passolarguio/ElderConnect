package br.com.elderconnect.repository;

import br.com.elderconnect.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

/** Consultas e persistencia de usuarios via Spring Data JPA/Hibernate. */
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);
}
