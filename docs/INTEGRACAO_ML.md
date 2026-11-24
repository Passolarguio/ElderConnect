# Integração do classificador — Spring Boot ↔ Python

Sugestão técnica de contrato interno (a negociar com o time de ML). O frontend **nunca** faz chamadas diretas para a API Python; Spring faz a ponte.

`POST /predict` na API Python (FastAPI ou serviço equivalente):

```json
{
  "userId": "u-123",
  "userInterests": ["musica", "caminhada"],
  "city": "Aracaju",
  "location": {"latitude": -10.94, "longitude": -37.06},
  "candidateEvents": [
    {"id": "ev-01", "categoryId": "musica", "city": "Aracaju", "price": 0, "distanceKm": 3.2},
    {"id": "ev-02", "categoryId": "arte", "city": "Lagarto", "price": 20, "distanceKm": 75.0}
  ]
}
```

Resposta proposta:

```json
{
  "modelVersion": "v1",
  "scores": [
    {"eventId": "ev-01", "probability": 0.88},
    {"eventId": "ev-02", "probability": 0.23}
  ]
}
```

Spring Boot valida IDs, busca objetos de evento completos no PostgreSQL, remove eventos encerrados/inativos, combina escores e retorna `GET /api/recommendations` conforme `CONTRATO_API.md`.

A localização enviada é opcional: sem coordenadas, usa cidade ou distância desconhecida. **Não inventar distância para o usuário**. O modelo pode usar imputação/indicador de ausência quando necessário.

## Evidências para apresentação

- Dataset (origem e tamanho), tratamento de dados, train/test split, features, métricas.
- Demonstração de `POST /predict` e de `GET /api/recommendations` real.
- Explicação do valor da IA para usuários 50+ e limites do treinamento.
- Segurança, tratamento de dados pessoais e resultados sem certeza indevida.
