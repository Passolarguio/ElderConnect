# ElderConnect 🌿

**Plataforma Web + Mobile para facilitar a descoberta de atividades e encontros entre pessoas 50+ em Sergipe.**

Projeto acadêmico do MVP *Tópicos Integradores — Silver Economy*, UNINASSAU Aracaju (edital 02/2026).

> **Estado desta entrega:** frontend Web e Mobile com **modo demonstração**. Os exemplos de eventos são FICTÍCIOS. Banco de dados, autenticação real, backend Spring Boot e modelo de Machine Learning **ainda devem ser desenvolvidos pelos integrantes responsáveis**. O modo demonstração **não é um sistema pronto para produção**.

## Publicar no GitHub e testar pelo navegador

Use o guia **[docs/PUBLICAR_GITHUB_PAGES.md](docs/PUBLICAR_GITHUB_PAGES.md)**. Esta versão inclui um workflow automático para publicar o `frontend-web` no GitHub Pages, preservando os módulos do grupo no mesmo repositório.

## Tecnologias

| Camada | Tecnologia | Status |
|---|---|---|
| Web | React 19 + Vite + React Router | Código frontend implementado |
| Mobile | React Native 0.81 + Expo SDK 54 + React Navigation | Código frontend implementado |
| API | Java + Spring Boot, camadas Controller/Service/Repository | **A implementar pela equipe** |
| ORM | Hibernate / Spring Data JPA | **A implementar pela equipe** |
| Banco relacional | PostgreSQL | **A implementar pela equipe** |
| IA | ML clássico: classificação/regressão em Python exposto via API preditiva | **A implementar pela equipe** |

Essas escolhas seguem o item 7.2 do edital; React e React Native são obrigatórios para as plataformas Web e Mobile, assim como Java/Spring Boot, Hibernate e um banco relacional aprovado. O MVC solicitado na avaliação deve ficar explícito principalmente no backend Spring MVC; no frontend, usamos **arquitetura por funcionalidades com separação entre interfaces, estado, domínio e acesso a dados**, não uma implementação improvisada de MVC dentro dos componentes.

## Início rápido no Windows / VS Code

### Site Web

1. Instale [Node.js 22](https://nodejs.org/) ou uma versão compatível (Node >= 22.12).
2. Abra esta pasta no VS Code.
3. No terminal PowerShell:

```powershell
cd frontend-web
npm install
Copy-Item .env.example .env
npm run dev
```

4. Acesse **http://localhost:5173**.

### Aplicativo Android / iOS

Abra **outro terminal**:

```powershell
cd frontend-mobile
npm install
Copy-Item .env.example .env
npx expo start
```

No Android, abra com **Expo Go compatível com SDK 54** (ou um emulador Android). Se precisar, acesse https://expo.dev/go e escolha a versão compatível. A versão do SDK no projeto foi mantida próxima da versão anteriormente usada no protótipo para facilitar continuidade; antes de atualizar o Expo, faça uma atualização coordenada das dependências.

**Em ambos os projetos, o `.env.example` já usa `demo`**, portanto você NÃO precisa de banco ou servidor para experimentar as telas. As dependências são instaladas apenas na sua máquina e não devem ser colocadas no GitHub.

## Entrar para experimentar

| Tipo | E-mail | Senha |
|---|---|---|
| Participante | `usuario@elderconnect.demo` | `Demo1234!` |
| Organizador | `organizador@elderconnect.demo` | `Demo1234!` |

Também é possível criar uma nova conta na interface e percorrer as etapas de cadastro.

**NUNCA reutilize essas credenciais como credenciais reais.** O login demo é somente um simulador de autenticação local. No Web, credenciais criadas na demonstração ficam verificadas por hash com salt local. No Mobile, o verificador é apenas experimental. Nenhum deles substitui autenticação segura no servidor. Não registre dados pessoais reais no modo demonstração.

## Funcionalidades do frontend

- Cadastro inicial com seleção de **Participante** ou **Organizador**.
- Login e abertura com logo; alternância cadastro/entrar.
- Perfil com **idade**, **cidade** e **foto** opcional.
- Seleção múltipla de interesses, vinculados ao usuário.
- Home com catálogo de eventos e seção de sugestões.
- Pesquisa por texto, filtro de categorias e eventos gratuitos.
- Detalhe do evento, data, horário, endereço, valor e disponibilidade.
- Inscrição e cancelamento de inscrição do participante.
- Favoritos.
- Painel do organizador, lista de eventos e formulário de publicação.
- Geolocalização **somente mediante autorização**; a cidade manual funciona sem permissão.
- Estilos responsivos e componentes com rótulos acessíveis.

**Importante sobre IA:** em `demo`, a lista de recomendações é ordenada por **uma heurística explícita** (interesse + cidade + preço). A interface deixa claro que isso **NÃO é Machine Learning treinado**. No modo API, a lista vem de `GET /api/recommendations` e o Spring Boot deverá chamar o serviço preditivo feito pelo grupo. Não use a simulação para afirmar que a nota de integração da IA já está atendida.

## Trocar do modo demo para backend real

### Web `.env`

```env
VITE_API_MODE=api
VITE_API_URL=http://localhost:8080
```

### Mobile `.env`

```env
EXPO_PUBLIC_API_MODE=api
EXPO_PUBLIC_API_URL=http://192.168.1.100:8080
```

No celular físico, **não use `localhost`**: configure o IP local do computador onde Spring Boot está rodando. PC e celular precisam conseguir se comunicar na rede, e o servidor deve liberar a conexão necessária. Se o servidor não responder em `api`, o aplicativo exibirá erro; **ele não inventará respostas demonstrativas**.

**Nunca coloque senha, segredo de API, chave privada ou conexão com banco em `VITE_*`/`EXPO_PUBLIC_*`.** Valores públicos no frontend são expostos no bundle. O token de exemplo fica na sessão Web e em memória no aplicativo mobile; autenticação para produção exige revisão de segurança (preferir estratégia de cookies HttpOnly em Web ou armazenamento seguro apropriado no Mobile, refresh/expiração, HTTPS e validação de permissões no servidor).

## Estrutura de pastas

```text
ElderConnect/
├── frontend-web/
│   ├── src/app/         # App, contextos, proteção de rotas
│   ├── src/pages/       # Views: cadastro, perfil, catálogo, evento, organizador
│   ├── src/components/  # Componentes reutilizáveis
│   ├── src/domain/      # Validações e regras puras (testadas)
│   ├── src/services/    # Adaptadores demoStore e httpApi
│   └── src/data/        # Dados FICTÍCIOS do modo demo
├── frontend-mobile/
│   ├── App.js           # React Navigation Stack + Tabs
│   └── src/{context,screens,components,services,domain,data}/
├── backend/             # Orientações para Spring Boot (a implementar)
├── machine-learning/    # Orientações para a IA (a implementar)
├── database/            # Modelo relacional de referência (a implementar)
├── docs/                # Contrato REST, arquitetura, colaboração, checklist
└── .github/workflows/   # CI do frontend Web
```

## Para cada colega começar

**Responsável frontend:** Web `frontend-web/src/pages`, `frontend-web/src/components`, Mobile `frontend-mobile/src/screens`.

**Responsável backend:** leia `docs/CONTRATO_API.md` e `backend/README.md`. Respeite os nomes de campos e endpoints já usados por `httpApi` nos dois aplicativos. Se modificar contrato, abra PR alterando também as duas interfaces e a documentação.

**Responsável banco:** leia `database/MODELO_DADOS.md` e implemente migrações/entidades no backend usando Hibernate; nunca coloque conexão ao PostgreSQL no frontend.

**Responsável IA:** leia `machine-learning/README.md` e `docs/INTEGRACAO_ML.md`. O serviço Spring envia dados mínimos à API Python e devolve a lista ordenada para Web/Mobile.

**Todos:** leiam `docs/GITHUB_EQUIPE.md`, criem branches por tarefa e mantenham evidências individuais no GitHub (o edital cita commits, PRs e Kanban).

## Testes e checagens

No Web:

```powershell
cd frontend-web
npm test
npm run build
```

No Mobile:

```powershell
cd frontend-mobile
npx expo install --check
npm run check
```

O `npm run check` gera um bundle Android, **não é um teste de execução em aparelho**. É necessário ainda testar as ações no Expo Go/emulador e, posteriormente, com a API real.

## Referências de arquitetura / documentação oficial

- React: https://react.dev/learn/thinking-in-react
- React Router: https://reactrouter.com/start/declarative/installation
- Vite: https://vite.dev/guide/
- React Native e navegação: https://reactnative.dev/docs/navigation
- Expo: https://docs.expo.dev/get-started/create-a-project/
- Spring Data JPA: https://docs.spring.io/spring-boot/how-to/data-access.html
- Spring MVC REST: https://spring.io/guides/gs/rest-service/

Projeto escolar. Imagens remotas são apenas referências visuais via Unsplash; para distribuição pública, validar autoria, licenças e atribuições. Dados de eventos são fictícios e não representam eventos reais disponíveis para reserva.

## Atalhos para Windows

Na raiz do projeto existem `INICIAR_WEB.bat` e `INICIAR_MOBILE.bat`. Cada um cria `.env` de exemplo e instala dependências automaticamente na primeira abertura. Use-os **depois** de instalar Node.js e npm. Se preferir, use os comandos de terminal acima, que são os mais fáceis de depurar.

Depois do primeiro `npm install` em cada frontend, **commite os arquivos `package-lock.json` gerados** para garantir instalações reprodutíveis no GitHub e, se desejado, altere o GitHub Actions de `npm install` para `npm ci`.

Os cards de teste e a divisão sugerida de tarefas estão em `docs/CHECKLIST_TESTE.md` e `docs/TAREFAS_GRUPO.md`.
