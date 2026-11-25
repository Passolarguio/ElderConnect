# ElderConnect — Etapa 02A: conectar Spring Boot ao PostgreSQL

Esta entrega adiciona a conexao com PostgreSQL e o suporte Spring Data JPA/Hibernate.
**Nao cria usuarios, tabelas, login nem JWT ainda.** Sao tarefas posteriores.

## Pre-requisitos

- Etapa 01 do backend ja instalada e testada.
- Java 21, Maven 3.9+.
- PostgreSQL rodando em localhost:5432.
- Banco `elderconnect` e usuario `elderconnect_app` criados, com senha definida.

## Aplicar

1. Extraia o ZIP desta etapa.
2. Copie a pasta `backend` extraida para a raiz do repositorio ElderConnect e **mescle** com a pasta existente.
3. Se perguntar, substitua somente `backend/pom.xml` e `backend/src/main/resources/application.properties`.
4. Nao exclua outros arquivos nem copie `target/`.

## Testes de codigo (nao requerem acesso real ao PostgreSQL)

No PowerShell, na pasta `backend`:

```powershell
mvn test
```

Os testes do controller de banco usam um mock, portanto aprovacao aqui **nao comprova acesso real ao banco**.

## Teste da conexao REAL (requer banco ativo)

1. Certifique-se de que `mvn -version` funciona neste terminal. Se o Maven nao estiver no PATH, configure-o.
2. Pare qualquer servidor anterior na porta 8080 (`Ctrl+C`).
3. Execute a partir da pasta `backend`:

```powershell
.\INICIAR_COM_POSTGRES.ps1
```

O script pedira sua senha sem mostrar os caracteres. Se o PowerShell bloquear o script,
execute diretamente:

```powershell
$senha = Read-Host 'Senha do banco' -AsSecureString
$ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($senha)
try { $env:DB_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr) }
finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) }
mvn spring-boot:run
```

Depois, abra no navegador:

- `http://localhost:8080/api/health` — verifica a API (ja existia).
- `http://localhost:8080/api/health/database` — consulta o PostgreSQL de verdade.

Resposta esperada para `/api/health/database`:

```json
{"status":"ok","database":"elderconnect"}
```

Se retornar erro 503, consulte o terminal do servidor e verifique a senha, a porta 5432 e o servico do PostgreSQL.
Se a aplicacao nao iniciar, verifique se o banco esta ativo e `DB_PASSWORD` foi informado corretamente.

## Primeiro commit desta etapa

Execute os comandos a partir da pasta raiz do repositorio, **depois de validar**:

```powershell
git status
git add backend/pom.xml backend/src/main/resources/application.properties backend/src/main/java/br/com/elderconnect/controller/DatabaseHealthController.java backend/src/test/java/br/com/elderconnect/controller/DatabaseHealthControllerTest.java backend/INICIAR_COM_POSTGRES.ps1 backend/ETAPA_02A_POSTGRES.md
git commit -m "feat(backend): conectar PostgreSQL com Spring Data JPA"
git push origin main
```

Nunca adicionar arquivos locais com senha (`.env`), credenciais ou a pasta `target/` ao Git.

## Observacoes

- `spring.jpa.hibernate.ddl-auto=none` evita mudar o banco automaticamente. Entidades e migracoes serao desenvolvidas separadamente.
- O GitHub Actions do backend executa **testes de unidade** sem banco. O sucesso do CI nao demonstra que o banco local esta acessivel.
- O servidor local nao fica hospedado no GitHub Pages. A integracao com o frontend publico exigira hospedagem posterior com HTTPS.
- O endpoint `/api/health/database` e temporario para ambiente de desenvolvimento. Antes de publicar a API em producao, restrinja-o ou remova-o.
