# Publicar o ElderConnect no GitHub e testar online

## 1. Criar repositório

- Em https://github.com/new crie o repositório público `ElderConnect` sem README inicial.
- Extraia o ZIP e abra **a pasta interna ElderConnect**, que contém README.md e as pastas frontend-web e frontend-mobile.
- Confirme que o Git está instalado com `git --version`.

## 2. Enviar pelo terminal (PowerShell / VS Code)

Na raiz do projeto:

```powershell
git init
git branch -M main
git add .
git commit -m "feat: MVP ElderConnect web e mobile"
git remote add origin https://github.com/SEU-USUARIO/ElderConnect.git
git push -u origin main
```

Substitua SEU-USUARIO. GitHub poderá solicitar login no navegador.
Nao envie `node_modules`, `.env` ou credenciais privadas; já existe `.gitignore`.

## 3. Ativar GitHub Pages

1. No GitHub abra `Settings` > `Pages`.
2. Em **Build and deployment**, escolha **Source: GitHub Actions**.
3. Abra `Actions` e execute **Publicar frontend Web no GitHub Pages** > **Run workflow** (ou aguarde a execução do push, se já disparada).
4. Quando o fluxo ficar verde, a URL será `https://SEU-USUARIO.github.io/ElderConnect/`.

O workflow `.github/workflows/deploy-pages.yml` instala dependências, executa testes, cria o build Vite do frontend-web e publica `frontend-web/dist`. O caminho `base` é definido automaticamente a partir do nome do repositório. As rotas do React usam HashRouter somente no domínio github.io, permitindo recarregar páginas de eventos sem 404.

## 4. Testes

- Cadastro de participante > idade/cidade/foto > interesses > início > pesquisar evento > inscrição.
- Conta de organizador > criar evento > encontrar evento publicado.
- Credenciais demonstrativas em README.md.
- Para conferir resultados dos checks: `Actions` > `Verificar frontend Web` e `Verificar frontend Mobile`.
- O GitHub Pages hospeda somente Web estática, em **modo demonstração**. API Spring Boot, PostgreSQL, IA preditiva e login real exigem servidores separados.
- Para testar mobile use `frontend-mobile` com Expo Go; Github Pages não executa React Native.

## 5. Alterar e atualizar

```powershell
git add .
git commit -m "feat: ajuste da interface"
git push
```

Ao enviar alterações ao frontend-web, o workflow de Pages atualiza automaticamente a publicação.

## Solução de problemas

- **404 em rotas**: confirme que foi enviada esta versão com HashRouter; as URLs internas terão `/#/inicio`.
- **Página sem estilo/imagens**: veja se o workflow gerou o build com `--base` e se o ícone está usando `import.meta.env.BASE_URL`.
- **Página não abre**: confirme `Settings > Pages > Source: GitHub Actions` e consulte os erros no painel `Actions`.
- **Não aparece em Actions**: habilite workflows para o repositório no GitHub e execute manualmente `Run workflow`.
