# Roteiro de teste manual — Web e Mobile

O desenvolvimento frontend não substitui teste no aparelho e integração real. Testar Web em desktop (~1440px), tablet (~768px), celular (~375px) e em Android com Expo Go SDK 54.

## Acesso
- [ ] Abertura com logo, depois cadastro por padrão.
- [ ] Criar conta como Participante, nome/e-mail/senha/confirmar.
- [ ] Erro de e-mail inválido, senha curta, confirmação diferente, cadastro duplicado.
- [ ] Após cadastrar, perfil pede idade, cidade e foto opcional.
- [ ] Seleção de ao menos um interesse; ao concluir, ir para página inicial.
- [ ] Sair e entrar com a mesma conta demo, verificando persistência local.
- [ ] Criar/entrar como Organizador; não exibir opções de inscrição para organizador.

## Descoberta de eventos
- [ ] Lista de eventos; rolagem; cartões responsivos.
- [ ] Pesquisar por palavra, filtrar categoria e gratuitos.
- [ ] Abrir detalhe; visualizar título, categoria, descrição, valor, local e horário.
- [ ] Participante inscreve-se, aparece em Minha agenda; pode cancelar.
- [ ] Favoritar e desfavoritar, refletindo na tela Favoritos.
- [ ] Não permitir inscrição duplicada nem quando lotado.
- [ ] Conferir que eventos do catálogo estão identificados como fictícios no material da apresentação.

## Organizador
- [ ] Tela de painel mostra eventos próprios.
- [ ] Publicar evento; validar título, descrição, data futura, categoria, vagas, preço e endereço.
- [ ] Evento aparece no catálogo da mesma instância do modo demo.

## Integração real (quando disponível)
- [ ] `VITE_API_MODE=api` e `EXPO_PUBLIC_API_MODE=api` funcionam com a API.
- [ ] 401/403/409 exibem mensagens apropriadas.
- [ ] Spring Security rejeita tentativa de criar evento por `USER` ou inscrever como `ORGANIZER`.
- [ ] Banco persiste registros após reiniciar servidor e navegador.
- [ ] ML retorna escores reais e a ordem na Web/Mobile corresponde ao retorno da API.
- [ ] URL no celular é IP LAN, não localhost; permissões CORS/rede configuradas.
- [ ] Testar falha do serviço de IA com resposta útil e sem travar o aplicativo.
