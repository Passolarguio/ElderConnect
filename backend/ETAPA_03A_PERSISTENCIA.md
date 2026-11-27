# ElderConnect — Etapa 03A: persistencia de usuarios

## Objetivo

Adicionar a primeira tabela relacional (`users`) com migracao Flyway, mapear `User` com JPA/Hibernate e preparar o `UserRepository`. Ainda **nao existe cadastro/login HTTP** nesta etapa, nem JWT.

A base foi preparada a partir do estado confirmado no GitHub em 27/11/2026, commit de PostgreSQL `a03c47e9` (branch `main`). O pacote preserva o `/api/health/database`, `postgre_start.ps1`, a porta 8080 e a correcao `server.tomcat.max-locale-count=100`.

## Arquivos

**Atualizar (2):**
- `backend/pom.xml`: adiciona `spring-boot-starter-flyway` e `flyway-database-postgresql` (Spring Boot 4).
- `backend/src/main/resources/application.properties`: ativa Flyway e muda Hibernate de `ddl-auto=none` para `validate`.

**Adicionar (7):**
- `backend/src/main/resources/db/migration/V1__create_users.sql`
- `backend/src/main/java/br/com/elderconnect/model/Role.java`
- `backend/src/main/java/br/com/elderconnect/model/User.java`
- `backend/src/main/java/br/com/elderconnect/repository/UserRepository.java`
- `backend/src/test/java/br/com/elderconnect/model/UserTest.java`
- `backend/src/test/java/br/com/elderconnect/repository/UserRepositoryIntegrationTest.java`
- `backend/TESTAR_PERSISTENCIA.ps1`

Este documento tambem e novo.

## Antes de copiar

Na pasta raiz do repo, execute `git status`. Se houver alteracoes nao commitadas por voce ou pelos colegas nos arquivos `pom.xml` e `application.properties`, compare e mescle manualmente; nao as sobrescreva sem revisar. Nao copie nenhum pacote antigo de backend inteiro.

## Testes passo a passo

1. Verifique que PostgreSQL esta rodando: `Get-Service *postgres*`.
2. Na pasta `backend`, execute `mvn test`. Os testes unitarios passam sem senha; o teste de banco e **ignorado** sem `DB_PASSWORD` (isso e esperado no GitHub Actions).
3. Execute `.\TESTAR_PERSISTENCIA.ps1`. Digite a senha local do `elderconnect_app` quando solicitada. Esse teste inicia o contexto Spring, roda a migracao Flyway, salva um usuario temporario, consulta de volta e faz rollback.
4. Execute `.\postgre_start.ps1` para iniciar a aplicacao normalmente com PostgreSQL e teste `http://localhost:8080/api/health/database` (esperado: `database=elderconnect`, `status=ok`).
5. Para inspecionar a tabela diretamente, em outro PowerShell:

```powershell
& 'C:\Program Files\PostgreSQL\18\bin\psql.exe' -U elderconnect_app -h localhost -p 5432 -d elderconnect -c '\d users'
& 'C:\Program Files\PostgreSQL\18\bin\psql.exe' -U elderconnect_app -h localhost -p 5432 -d elderconnect -c 'SELECT version, description, success FROM flyway_schema_history ORDER BY installed_rank;'
```

O banco existente precisa estar com as tabelas do projeto ainda nao criadas, como na etapa 02A. Caso ja exista `users` ou `flyway_schema_history`, **nao apague nem renomeie nada**: confira com a equipe antes de executar a migracao.

## Seguranca e limite do escopo

- Nao publicar a senha do PostgreSQL ou `.env`.
- `password_hash` armazena somente hashes; BCrypt sera implementado no commit seguinte de cadastro.
- Nao ha endpoints de usuario expostos ainda. A entidade nao deve ser serializada diretamente em JSON.
- `Role` suporta `USER` e `ORGANIZER`, como exige o contrato com React.
- `V1__create_users.sql` e uma migracao versionada: **nao edite seu conteudo depois que ela for aplicada em um banco compartilhado**. Futuras alteracoes vao em V2, V3, etc.
- A transacao do teste de integracao e revertida. Isso nao desfaz a criacao da tabela pelo Flyway (o esquema permanece).

## Commit recomendado, depois dos testes

```powershell
cd 'D:\DOWNLOAD\ElderConnect_GitHub_Pages_Pronto\ElderConnect'
git status
git add backend/
git diff --cached --stat
git commit -m "feat(db): criar persistencia de usuarios com Flyway e JPA"
git push origin main
```

Use `git add backend/` **somente se** `git status` mostrar que nao ha arquivos inesperados ou segredos nessa pasta.

Proxima etapa: `03B — POST /api/auth/register`, validacao, BCrypt e DTO de resposta (nunca expor `password_hash`).
