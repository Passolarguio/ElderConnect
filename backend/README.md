# Backend — PARA O INTEGRANTE RESPONSÁVEL

**Não implementado nesta entrega de frontend.** Criar um projeto Spring Boot Java (Maven ou Gradle) nesta pasta, com Spring Web / Spring MVC, Spring Security, Spring Data JPA, Hibernate, validação e driver PostgreSQL.

Sugestão de organização convencional:

```text
backend/src/main/java/br/com/elderconnect/
├── ElderConnectApplication.java
├── config/
├── controller/
│   ├── AuthController.java
│   ├── UserController.java
│   ├── EventController.java
│   └── RecommendationController.java
├── service/
│   ├── AuthService.java
│   ├── UserService.java
│   ├── EventService.java
│   └── RecommendationService.java
├── repository/
│   ├── UserRepository.java
│   ├── EventRepository.java
│   └── RegistrationRepository.java
├── model/
│   ├── User.java
│   ├── Event.java
│   └── Registration.java
├── dto/
└── exception/
```

MVC/arquitetura por camadas: **Controller** recebe requests REST, **Service** valida regras e orquestra entidades, **Repository** persiste via JPA/Hibernate, **Model** representa dados/regras. Nunca consultar PostgreSQL dentro do componente React.

### Contrato a cumprir

Leia `../docs/CONTRATO_API.md`. Os adaptadores já estão em:
- `../frontend-web/src/services/httpApi.js`
- `../frontend-mobile/src/services/httpApi.js`

### Integração com IA

`RecommendationService` monta features de interesse, cidade, possível distância e histórico, consulta a API Python (contrato em `../docs/INTEGRACAO_ML.md`) e retorna `items` com evento e score ao frontend. Não exponha URL ou segredos do Python no Web/Mobile.

### Segurança mínima

Hash BCrypt/Argon2, autorização por papel no servidor, token com validade, validation annotations, tratamento centralizado de erro, transações para registro de vagas, CORS do Web, políticas de acesso por usuário e variáveis de ambiente para credenciais. NUNCA registrar senhas em log. Definir migração Flyway/Liquibase para PostgreSQL, testes de integração e configuração de dev com dados fictícios.
