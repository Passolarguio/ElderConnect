# ElderConnect — Banco de dados PostgreSQL

Implementação local do modelo relacional proposto em `MODELO_DADOS.md`. Em 26/11/2026, foram observadas evidências no pgAdmin de criação das sete tabelas, inserção de 41 registros fictícios, consultas relacionais e aprovação dos três testes de integridade. A integração real com o Spring Boot ainda não foi validada.

## Instalação em outro computador

1. Instale PostgreSQL (ambiente validado: 19) e pgAdmin 4. Utilize a porta 5432.
2. No pgAdmin, como administrador `postgres`, crie um Login/Group Role chamado `elderconnect_app`, com senha própria e `Can login` habilitado, sem privilégios administrativos. Não compartilhe nem versione senhas.
3. Crie o banco `elderconnect`, selecionando `elderconnect_app` como proprietário (ambiente de desenvolvimento).
4. Abra Query Tool nesse banco e execute `01_schema.sql` uma única vez em um banco vazio.
5. Execute `02_seed.sql` para inserir os dados fictícios. O script evita duplicações por ID; não atualiza datas de eventos previamente inseridos.
6. Execute `03_tests.sql`, selecionando cada consulta e, depois, o bloco de testes negativos inteiro (BEGIN a ROLLBACK). Confira Data Output e Messages.

Se você já criou o banco e executou os scripts durante o desenvolvimento, não precisa recriar as tabelas.

## Estrutura e normalização

| Tabela | Finalidade | Registros iniciais |
|---|---|---:|
| users | Participantes e organizadores | 2 |
| interests | Catálogo de interesses | 12 |
| user_interests | Associação N:N entre usuários e interesses | 3 |
| categories | Catálogo de categorias | 12 |
| events | Eventos e referências ao organizador e categoria | 9 |
| registrations | Inscrições de usuários em eventos | 1 |
| favorites | Associação N:N de usuários e eventos favoritos | 2 |

Total: 41 registros; 7 tabelas e 8 chaves estrangeiras. Os catálogos usam os identificadores do frontend. A modelagem foi projetada para 3FN: campos atômicos (1FN); nas tabelas associativas, os atributos dependem da chave inteira (2FN); nomes de organizadores e categorias não são replicados nos eventos (3FN). Contagens de inscrições e nomes relacionados são derivados por consultas.

## Diagrama

`ElderConnect_DER.pgerd`: arquivo original editável do pgAdmin. `ElderConnect_DER.png`: representação regenerada a partir das tabelas e relações do arquivo editável para que as linhas sejam visíveis. PK = chave primária; FK = chave estrangeira. Cada relação é 1:N (o lado N admite zero registros).

## Integração com o backend

Configuração já prevista no projeto: `jdbc:postgresql://localhost:5432/elderconnect`, usuário `elderconnect_app`, senha via variável de ambiente `DB_PASSWORD`. O backend utiliza `ddl-auto=none`. O responsável pelo backend deverá alinhar entidades Hibernate/JPA e migrações com este schema, sem executar a criação duas vezes. A API de saúde `/api/health/database` deve ser testada com PostgreSQL ativo. O resultado esperado é status `ok` e database `elderconnect`.

Os usuários fictícios contêm `!DEMO_NO_LOGIN!` como marcador, não um hash válido; não permitem testar autenticação real. O backend precisa implementar autenticação segura, autorização por perfil, controle transacional de capacidade, cancelamento/reinscrição, e acordar os valores de status. As restrições SQL não garantem essas regras de negócio sozinhas. A conta proprietária é uma escolha para desenvolvimento; em produção, separar papéis de migração e execução com privilégio mínimo.

## Evidências e limites

Foram observados: 9 eventos retornados com organizador e categoria, 6 associações pessoais (3 interesses, 1 inscrição, 2 favoritos), rejeição de inscrição duplicada, usuário inexistente e preço negativo, seguida de ROLLBACK. O pacote reproduz os scripts utilizados; a checagem de pré-requisitos em `03_tests.sql` foi acrescentada para evitar testes sem dados. Não houve nova execução SQL neste empacotamento. Não foram validados autenticação, concorrência ou integração com backend/ML.
