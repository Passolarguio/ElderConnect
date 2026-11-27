-- Migracao 01: estrutura minima necessaria ao futuro cadastro/login.
-- Nenhum usuario e criado automaticamente nesta etapa.
CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(254) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(16) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_users_role CHECK (role IN ('USER', 'ORGANIZER'))
);

-- Impede cadastros duplicados considerando maiusculas/minusculas no e-mail.
CREATE UNIQUE INDEX ux_users_email_ci ON users (LOWER(email));
