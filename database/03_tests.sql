-- Execute as consultas separadamente para ver cada resultado no pgAdmin.
SELECT tablename,tableowner FROM pg_tables WHERE schemaname='public' ORDER BY tablename;
SELECT 'users' AS tabela, COUNT(*) AS quantidade FROM public.users
UNION ALL SELECT 'interests',COUNT(*) FROM public.interests
UNION ALL SELECT 'user_interests',COUNT(*) FROM public.user_interests
UNION ALL SELECT 'categories',COUNT(*) FROM public.categories
UNION ALL SELECT 'events',COUNT(*) FROM public.events
UNION ALL SELECT 'registrations',COUNT(*) FROM public.registrations
UNION ALL SELECT 'favorites',COUNT(*) FROM public.favorites;
SELECT e.title AS evento,u.name AS organizador,c.name AS categoria,e.city AS cidade,e.capacity AS vagas,e.price AS valor
FROM public.events e JOIN public.users u ON e.organizer_id=u.id JOIN public.categories c ON e.category_id=c.id ORDER BY e.starts_at;
SELECT u.name AS participante,'Interesse' AS tipo,i.name AS descricao
FROM public.users u JOIN public.user_interests ui ON u.id=ui.user_id JOIN public.interests i ON ui.interest_id=i.id
UNION ALL SELECT u.name,'Inscrição',e.title FROM public.registrations r JOIN public.users u ON r.user_id=u.id JOIN public.events e ON r.event_id=e.id
UNION ALL SELECT u.name,'Favorito',e.title FROM public.favorites f JOIN public.users u ON f.user_id=u.id JOIN public.events e ON f.event_id=e.id ORDER BY tipo,descricao;
-- Testes negativos (executar o bloco inteiro). Nenhuma alteração persistida.
BEGIN;
SET LOCAL ROLE elderconnect_app;
DO $$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM public.registrations WHERE user_id='demo-u1' AND event_id='ev-01') OR NOT EXISTS (SELECT 1 FROM public.events WHERE id='ev-01') THEN RAISE EXCEPTION 'Execute o seed antes dos testes'; END IF;
 BEGIN
  INSERT INTO public.registrations(user_id,event_id,status) VALUES ('demo-u1','ev-01','ACTIVE');
  RAISE EXCEPTION 'FALHA: inscrição duplicada aceita';
 EXCEPTION WHEN unique_violation THEN RAISE NOTICE 'TESTE 1 - APROVADO'; END;
 BEGIN
  INSERT INTO public.favorites(user_id,event_id) VALUES ('usuario-inexistente','ev-01');
  RAISE EXCEPTION 'FALHA: usuário inexistente aceito';
 EXCEPTION WHEN foreign_key_violation THEN RAISE NOTICE 'TESTE 2 - APROVADO'; END;
 BEGIN
  UPDATE public.events SET price=-50 WHERE id='ev-01';
  RAISE EXCEPTION 'FALHA: preço negativo aceito';
 EXCEPTION WHEN check_violation THEN RAISE NOTICE 'TESTE 3 - APROVADO'; END;
END $$;
ROLLBACK;
