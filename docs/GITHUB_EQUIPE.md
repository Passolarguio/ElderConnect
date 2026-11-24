# Como publicar e dividir tarefas no GitHub

O edital (item 3.6) considera evidências INDIVIDUAIS de contribuição, como commits, pull requests, code reviews e tarefas em quadro ágil. Não basta somente o líder fazer os commits de todos.

## Primeiro envio pelo dono do repositório

1. Descompacte o ZIP inteiro, sem mover arquivos de `frontend-web` para `frontend-mobile`.
2. No GitHub, crie repositório vazio (ex.: `elderconnect`), de preferência **privado** enquanto estiver em desenvolvimento. Não marque `Initialize with README` se já tem README local.
3. Na pasta raiz `ElderConnect`, abra terminal Git Bash ou PowerShell com Git instalado.

```powershell
git init
git branch -M main
git add .
git commit -m "feat: estrutura inicial dos frontends web e mobile"
git remote add origin https://github.com/SEU-USUARIO/elderconnect.git
git push -u origin main
```

Substitua a URL pelo endereço REAL do repositório criado. Para o push é necessário estar autenticado no GitHub (Git Credential Manager ou SSH).

4. Abra **Settings → Collaborators → Add people** e convide os demais integrantes. No repositório da organização, isso pode aparecer como `Collaborators and teams`.
5. No GitHub Projects, faça um quadro Kanban: `A fazer`, `Em andamento`, `Em revisão`, `Concluído`.
6. Proteja a branch `main` com PR/revisão se as permissões do repositório permitirem. Para um grupo pequeno e com prazo curto, no mínimo combinam que ninguém faz push sem avisar.

## Cada integrante começa assim

```powershell
git clone https://github.com/SEU-USUARIO/elderconnect.git
cd elderconnect
git switch -c feature/backend-eventos
# fazer alterações

git add .
git commit -m "feat(backend): adicionar endpoint de eventos"
git push -u origin feature/backend-eventos
```

No GitHub, abrir **Pull Request** para `main`. Um colega revisa e aprova. Se o contrato REST mudar, incluir a alteração de `docs/CONTRATO_API.md` na mesma PR.

## Áreas de responsabilidade

- Frontend: `frontend-web`, `frontend-mobile`.
- Backend: `backend`, contrato de integração.
- IA: `machine-learning`, experimentos/avaliação e endpoint preditivo.
- Banco: migrations dentro do backend, `database/MODELO_DADOS.md`.
- Todos: documentação, testes e apresentação.

## Convenção de commits

- `feat(web): implementar filtro de eventos`
- `feat(mobile): adicionar tela de inscrição`
- `feat(backend): criar EventController`
- `feat(ml): disponibilizar API de inferência`
- `test: validar limite de vagas`
- `docs: atualizar contrato da API`
- `fix: corrigir sessão de usuário`

## Segurança

**NUNCA envie para o GitHub:** `.env` real, senha, chave privada, credenciais PostgreSQL, token de IA ou dados de cidadãos reais. O `.gitignore` já cobre `.env`, mas confirme com `git status` antes de commitar. `frontend-web/.env.example` e `frontend-mobile/.env.example` são públicos e não contêm segredos.

## Cada um deve registrar

- Issues/tarefas com responsável e data.
- Commits em sua conta.
- PRs com descrição e capturas de tela quando houver UI.
- Evidências de execução (testes de endpoint, IA e telas).
