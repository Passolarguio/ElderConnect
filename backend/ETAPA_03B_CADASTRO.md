# ElderConnect — Commit 03B: Cadastro com BCrypt

**Objetivo:** disponibilizar `POST /api/auth/register` no Spring Boot, cadastrando usuarios
na tabela `users` ja criada na Etapa 03A. O JWT sera implementado somente na Etapa 03C.

## Arquivos do pacote

**Atualizar:** `backend/pom.xml` (nova dependencia `spring-security-crypto`).

**Adicionar:** `config/PasswordConfig.java`, `dto/{RegisterRequest,UserResponse,RegisterResponse,ApiError}.java`,
`exception/{ApiException,ApiExceptionHandler}.java`, `service/RegistrationService.java`,
`controller/AuthController.java`, testes `RegistrationServiceTest.java`, `AuthControllerTest.java`,
`RegistrationIntegrationTest.java`, `TESTAR_CADASTRO.ps1` e este documento.

**Nao alterar:** `application.properties`, `model/User.java`, `repository/UserRepository.java`,
`db/migration/V1__create_users.sql`, `postgre_start.ps1` e arquivos do frontend.

## Contrato TEMPORARIO de cadastro

`POST http://localhost:8080/api/auth/register`

```json
{"fullName":"Ana Silva","email":"ana@example.test","password":"SenhaSegura123!","role":"USER"}
```

Retorno **201 Created** com `{ "user": { "id": "uuid", "name": "Ana Silva", "email": "ana@example.test",
"role": "USER", "age": null, "city": "", "state": "SE", "avatarUrl": "", "interests": [] } }`.

IMPORTANTE: **nao retorna token nesta etapa** e **ainda nao pode ativar o modo API do React**.
O endpoint do frontend espera `{token,user}`. A Etapa 03C vai concluir JWT e adaptar
este retorno; a integracao Web/Mobile sera realizada posteriormente.

Erros JSON: `{ "message": "...", "code": "..." }`.
- 400 `VALIDATION_ERROR`: nome, e-mail, senha ou tipo de conta invalidos.
- 400 `INVALID_JSON`: JSON invalido ou role diferente de USER/ORGANIZER.
- 409 `EMAIL_ALREADY_EXISTS`: email duplicado, inclusive com letras maiusculas.

Regras:
- Nome de 2 a 120 caracteres, sem espacos excedentes nas pontas.
- E-mail normalizado para minusculas, com ate 254 caracteres.
- Senha de no minimo 8 caracteres e no maximo 72 bytes UTF-8 (limite do BCrypt).
- Senhas nao aparecem nas respostas nem nos logs da API.
- A aplicacao usa BCrypt com custo 12; nao grava senha aberta.
- Role aceita USER ou ORGANIZER. A autorizacao por papeis sera na 03C.

## 1. Adicionar os arquivos

Extraia o pacote na raiz do repo e mescle a pasta `backend`, substituindo **somente** `pom.xml`.

## 2. Testes sem acesso ao banco

No PowerShell:

```powershell
cd "D:\DOWNLOAD\ElderConnect_GitHub_Pages_Pronto\ElderConnect\backend"
# Se mvn nao for reconhecido:
$env:Path = "C:\Users\caiov\Downloads\apache-maven-3.10.2-bin\apache-maven-3.10.2\bin;$env:Path"
mvn test
```

A integracao real com PostgreSQL sera ignorada caso `DB_PASSWORD` nao esteja definida.
Esperado: `BUILD SUCCESS`.

## 3. Teste real no banco

```powershell
.\TESTAR_CADASTRO.ps1
```

O script pede a senha de `elderconnect_app`, roda o teste real e limpa a variavel de ambiente.
O teste cria usuario ficticio e usa rollback, portanto nao o mantem no banco.
Esperado: `Tests run: 1, Failures: 0, Errors: 0` e `BUILD SUCCESS`.

## 4. Teste HTTP manual (OPCIONAL, cria um usuario que permanece no banco)

Em um terminal inicie o servidor:

```powershell
.\postgre_start.ps1
```

Em outro terminal PowerShell:

```powershell
$novoEmail = "cadastro-$(Get-Date -Format yyyyMMddHHmmss)@example.test"
$dados = @{fullName='Ana Silva'; email=$novoEmail; password='SenhaSegura123!'; role='USER'} | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri 'http://localhost:8080/api/auth/register' -ContentType 'application/json' -Body $dados
```

Deve retornar `user` com `id`, sem `password`/`passwordHash`.
Essa chamada HTTP realmente salva o cadastro: nao use dados pessoais verdadeiros enquanto testa.

## 5. Commit apenas apos os testes

Na pasta raiz do repositorio:

```powershell
git status
git add .
git diff --cached --stat
git commit -m "feat(auth): implementar cadastro com BCrypt"
git push origin main
```

Antes do commit, confira que nao entrou `.env`, senha ou `target/` no staging.
O comando `git add .` inclui todas as alteracoes na pasta atual e subpastas.

## Proxima etapa 03C

Login com JWT e protecao das rotas por papel; o cadastro passara a retornar `{token,user}`
conforme o contrato de `docs/CONTRATO_API.md`.
