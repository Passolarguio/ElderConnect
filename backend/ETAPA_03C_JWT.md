# Etapa 03C - Login JWT

## Arquivos do pacote
- ATUALIZADOS: `pom.xml`, `src/main/java/br/com/elderconnect/controller/AuthController.java`,
  `src/test/java/br/com/elderconnect/controller/AuthControllerTest.java`.
- NOVOS: `dto/AuthResponse.java`, `dto/LoginRequest.java`,
  `service/LoginService.java`, `security/JwtService.java`,
  `security/JwtAuthenticationFilter.java`, `config/SecurityConfig.java`,
  testes e `TESTAR_LOGIN.ps1`.
- OBSOLETO: remova `src/main/java/br/com/elderconnect/dto/RegisterResponse.java`
  depois de copiar o pacote, pois `AuthResponse` o substitui.
- INTACTOS: `postgre_start.ps1`, `application.properties`, migrations Flyway,
  entidade User, UserRepository, endpoints health e pasta frontend.

## Objetivo
- `POST /api/auth/login` confere senha com BCrypt e retorna token assinado JWT.
- `POST /api/auth/register` tambem responde `{token,user}`; o React espera isso.
- Bearer token em `Authorization` verifica assinatura e expiracao, consulta
  o usuario no PostgreSQL e recupera o tipo de conta (USER ou ORGANIZER).
- Erro 401 em credenciais erradas, 401 em rota protegida sem JWT, 403 em rotas
  que futuramente restringiremos por tipo de conta.
- Sem nova migration SQL, sem Machine Learning.

## Cuidados de seguranca
- Por padrao, sem JWT_SECRET, uma chave aleatoria de desenvolvimento e criada
  em memoria na inicializacao. Isso e apropriado apenas para testes locais:
  todos os JWTs deixam de valer ao reiniciar o backend.
- Em ambiente hospedado e para uma demonstracao estavel, use JWT_SECRET com
  Base64 de **32 bytes aleatorios** (fora do Git). Para gerar no PowerShell:

```powershell
$bytes = [byte[]]::new(32)
[System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
$env:JWT_SECRET = [Convert]::ToBase64String($bytes)
```

Esse segredo existe somente na sessao atual do terminal. Nao imprima, grave
ou envie sua chave JWT para o GitHub.
- As senhas armazenadas ja sao BCrypt desde a 03B; jamais retornamos os hashes.
- A API usa tokens no header, nao cookies de sessao; a configuracao HTTP e stateless.
- CORS permite localhost:5173, 127.0.0.1:5173 e dominio do GitHub Pages, mas
  GitHub Pages remoto nao consegue acessar o localhost de outro usuario.

## Testes
1. Extraia o ZIP na raiz do ElderConnect e mescle backend; substitua os 3 arquivos.
2. Abra PowerShell em `backend/`, remova o DTO antigo:
   `Remove-Item .\src\main\java\br\com\elderconnect\dto\RegisterResponse.java`
3. `mvn test` (testes unitarios, nao exigem DB_PASSWORD).
4. `.\TESTAR_LOGIN.ps1` (pede senha do PostgreSQL, valida USER e ORGANIZER).
5. Inicie `.\postgre_start.ps1` e envie POST para `/api/auth/login` usando
   Invoke-RestMethod em outro terminal; email/senha de conta ja cadastrada.
6. Com backend iniciado, rode `.\TESTAR_LOGIN_HTTP.ps1` em outro terminal para
   verificar cadastro e login de ambos os tipos de conta. Este teste HTTP cria duas
   contas ficticias permanentes no PostgreSQL.

Exemplo de body:

```json
{"email":"ana.teste@elderconnect.com","password":"SenhaTeste123!"}
```

Resposta esperada 200 (token omitido):
`{"token":"...","user":{"id":"...","name":"Ana Silva","email":"...","role":"USER","age":null,"city":"","state":"SE","avatarUrl":"","interests":[]}}`

Login errado retorna status 401:
`{"message":"E-mail ou senha incorretos.","code":"INVALID_CREDENTIALS"}`

## Commit
`feat(auth): implementar login JWT e seguranca da API`

## Proxima etapa
03D: `GET /api/users/me`, perfil autenticado e controles de acesso
especificos para participante e organizador.
