# Machine Learning — PARA O INTEGRANTE RESPONSÁVEL

**Modelo ainda não treinado/implementado.** Escolher uma tarefa real de **classificação**: estimar `P(interesse em evento | perfil, evento)`. Ou regressão de escore de afinidade, desde que coerente com os dados.

Fluxo sugerido:

1. Definir o rótulo-alvo: `interessado=1` em caso de inscrição/salvamento; `0` para exemplos negativos construídos e justificados, **com cuidado para não assumir que ausência de clique é falta de interesse**.
2. Dados: categoria, interesses selecionados, cidade, distância quando disponível, preço, faixa etária **somente se necessário**, histórico de interações (com base adequada de privacidade).
3. Dividir treino/validação/teste sem vazamento de informação. Se só houver amostra sintética, declarar isso no relatório e não prometer performance real.
4. Treinar modelo interpretável primeiro (regressão logística, árvore etc.), comparar com baseline simples (a heurística do modo demo).
5. Reportar métricas relevantes (precision, recall, F1, ROC-AUC quando apropriado), distribuição de classes, limitações e viés.
6. Salvar modelo com versão e pipeline de pré-processamento; disponibilizar API Python preditiva. O Spring Boot consome e devolve eventos ordenados para Web e Mobile.
7. Registrar screenshots, chamadas de teste e versões para demonstrar funcionamento aos professores.

Veja `../docs/INTEGRACAO_ML.md` para o contrato proposto. **A heurística no frontend não é IA**: é só simulação para permitir testar o fluxo da interface.
