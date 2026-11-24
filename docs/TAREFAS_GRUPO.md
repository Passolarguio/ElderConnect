# Tarefas sugeridas para o quadro GitHub Projects

**Atenção:** estas são atribuições SUGERIDAS, não determinações do edital. O grupo deve confirmar quem ficará responsável por banco e IA. Cada integrante deve abrir PRs em sua conta; a nota pode considerar evidências individuais de contribuição.

## Frontend — responsável por interfaces

- [ ] Subir monorepo inicial para GitHub, adicionar colaboradores e organizar Kanban.
- [ ] Rodar `frontend-web` em desktop e largura 375px; corrigir eventuais diferenças visuais locais.
- [ ] Rodar `frontend-mobile` no Expo Go / emulador; corrigir diferenças de Android.
- [ ] Validar cadastro Participante/Organizador, criação de perfil e seleção de interesses.
- [ ] Validar filtros, detalhes, favoritos, inscrição/cancelamento e publicação.
- [ ] Definir dados esperados com o backend no `CONTRATO_API.md`.
- [ ] Trocar `.env` de demo para api assim que Spring Boot estiver pronto; testar ambos.
- [ ] Registrar capturas e vídeo da demonstração para apresentação final.

## Backend Spring Boot — colega responsável

- [ ] Criar projeto Maven/Gradle Spring Boot e pacotes MVC.
- [ ] Configurar PostgreSQL + Hibernate/JPA e migrations.
- [ ] Criar `AuthController`, serviço de autenticação e perfis `USER`/`ORGANIZER`.
- [ ] Criar endpoints de perfil e interesses, com autorização.
- [ ] Criar endpoints de lista/criação de eventos e validações.
- [ ] Criar inscrição, cancelamento, favoritos, e evitar vagas duplicadas com transação.
- [ ] Criar endpoint `/api/recommendations` que chama a API Python.
- [ ] Liberar CORS apenas para endereços Web necessários e testar conexão mobile pela rede.
- [ ] Adicionar testes de autorização, validação e limites de vagas.

## Banco de dados — colega responsável

- [ ] Criar tabelas normalizadas conforme `database/MODELO_DADOS.md`.
- [ ] Criar constraints (email único, inscrição única por usuário/evento, preço não negativo etc.).
- [ ] Criar seeds de categorias e dados fictícios para a demonstração.
- [ ] Gerar diagrama ER e documentar migrations.
- [ ] Provar persistência real de cadastro, eventos e inscrições.

## Machine Learning — colega responsável

- [ ] Definir tarefa de classificação ou regressão que justifique a recomendação.
- [ ] Documentar dados e rótulos, inclusive natureza sintética caso aplicável.
- [ ] Separar datasets corretamente, treinar baseline e modelo.
- [ ] Avaliar com métricas e registrar limitações, versão e pipeline de processamento.
- [ ] Expor endpoint Python `/predict` com payload combinado com backend.
- [ ] Integrar Spring Boot, demonstrar retorno `score` real em `/api/recommendations`.
- [ ] Preparar evidências: notebook, dataset, métricas, vídeo/requisições.

## Grupo inteiro

- [ ] Conferir fidelidade do MVP ao **roadmap da primeira etapa**.
- [ ] Revisar governança e documentação final.
- [ ] Ensaiar pitch com divisão das falas.
- [ ] Apresentar Web, Mobile, banco e inferência real rodando na mesma demonstração.
- [ ] Registrar tarefas, commits e PRs individuais.
