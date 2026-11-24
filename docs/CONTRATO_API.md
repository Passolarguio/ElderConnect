# Contrato REST v1 — Web/Mobile ↔ Spring Boot

**Proposta de integração** (não é uma API já implementada). Base URL: `http://localhost:8080/api`. JSON UTF-8, timestamps ISO 8601 com offset UTC, IDs tratados como `string`, bearer token demonstrativo. Antes de integrar, o grupo deve validar quais campos serão obrigatórios e congelar o contrato.

## Autenticação

### `POST /api/auth/register`

```json
{"fullName":"Ana Silva","email":"ana@example.com","password":"senha-temporaria","role":"USER"}
```

`role` deve ser `USER` ou `ORGANIZER`. O servidor valida e retorna **201**:

```json
{"token":"jwt-ou-token-de-sessao","user":{"id":"u-1","name":"Ana Silva","email":"ana@example.com","role":"USER","age":null,"city":"","state":"SE","avatarUrl":"","interests":[]}}
```

O servidor **nunca retorna** senha ou hash. Respostas de erro: 400 campos inválidos; 409 e-mail existente.

### `POST /api/auth/login`

```json
{"email":"ana@example.com","password":"senha-temporaria"}
```

Retorno 200 com mesmo envelope `{token,user}`. Erro 401 para credencial inválida.

### `GET /api/users/me`

Requer `Authorization: Bearer <token>`. Retorna o objeto `user` **diretamente**, não `{user:...}`.

## Perfil e interesses

### `PUT /api/users/me`

Aceita alteração parcial de `name`, `age`, `city`, `state`, `latitude`, `longitude`, `avatarUrl`. Retorna objeto `user` completo. Recomenda-se a política de que o servidor NÃO aceite `role`, `id` e `email` nessa rota. O usuário é determinado pelo token.

### `POST /api/users/me/avatar`

`multipart/form-data` com campo `file`. Retorna `{ "avatarUrl": "https://..." }`. Validar formato, tamanho e segurança do upload.

### `PUT /api/users/me/interests`

```json
{"interestIds":["musica","caminhada","leitura"]}
```

Retorna objeto `user` completo com `interests`. Ver catálogo em `frontend-web/src/data/demo.js` (usar IDs estáveis no banco).

## Eventos

### `GET /api/events`

Retorna **array de eventos diretamente** `[{...},{...}]`. O frontend também tolera `{items:[...]}` como resposta.

### `POST /api/events`

Somente organizador autenticado. Exemplo:

```json
{
 "title":"Aula de dança na comunidade",
 "description":"Encontro para aprender dança de salão e conhecer pessoas, sem experiência prévia.",
 "categoryId":"danca",
 "startsAt":"2026-12-15T17:00:00.000Z",
 "city":"Aracaju",
 "neighborhood":"Atalaia",
 "address":"Rua Exemplo, 100 - Atalaia, Aracaju/SE",
 "capacity":30,
 "price":0,
 "image":""
}
```

Retorna **201** com evento completo:

```json
{
 "id":"ev-123", "organizerId":"u-2", "organizerName":"João Santos",
 "title":"Aula de dança na comunidade", "description":"Encontro para aprender dança de salão e conhecer pessoas, sem experiência prévia.",
 "categoryId":"danca", "startsAt":"2026-12-15T17:00:00.000Z",
 "city":"Aracaju", "neighborhood":"Atalaia", "state":"SE",
 "address":"Rua Exemplo, 100 - Atalaia, Aracaju/SE", "latitude":null, "longitude":null,
 "capacity":30, "registeredCount":0, "price":0, "image":"", "status":"PUBLISHED"
}
```

### `POST /api/events/{id}/registrations`

Somente `USER`, sem body. Retorna 201; 409 se já inscrito, ou se evento esgotado. O servidor verifica capacidade em transação.

### `DELETE /api/events/{id}/registrations/me`

Cancela inscrição do usuário autenticado. Retorna 200/204.

## Listas pessoais

- `GET /api/users/me/registrations` → `{ "eventIds": ["ev-123"] }`
- `GET /api/users/me/favorites` → `{ "eventIds": ["ev-123"] }`
- `POST /api/users/me/favorites/{eventId}` → 200/201
- `DELETE /api/users/me/favorites/{eventId}` → 200/204

## Recomendações por IA

### `GET /api/recommendations`

Somente `USER`. Spring Boot consulta o **serviço de Machine Learning do grupo** e retorna:

```json
{
 "items": [
   {
     "event": {"id":"ev-123","title":"Aula de dança na comunidade","categoryId":"danca","startsAt":"2026-12-15T17:00:00.000Z","city":"Aracaju","neighborhood":"Atalaia","state":"SE","address":"Rua Exemplo, 100","capacity":30,"registeredCount":0,"price":0,"image":"","description":"Encontro de dança para a comunidade.","organizerName":"João Santos","organizerId":"u-2","status":"PUBLISHED"},
     "score": 0.87,
     "reason": "Interesse em dança e proximidade"
   }
 ],
 "modelVersion": "v1"
}
```

O frontend aceita também array de eventos pronto. **Score é só ilustrativo neste documento; deve vir de inferência real quando o modo `api` for usado.**

## Erros e status

Formato padrão sugerido:

```json
{"message":"Não foi possível realizar a inscrição.","code":"EVENT_FULL"}
```

- 400: validação
- 401: não autenticado
- 403: sem permissão de participante/organizador
- 404: recurso ausente
- 409: conflito / sem vagas / duplicidade
- 500: erro interno sem vazamento de detalhes técnicos

Web e Mobile já exibem `message` ao receber erro. O backend deve liberar CORS apenas para as origens necessárias do frontend Web; CORS não é mecanismo de autenticação.
