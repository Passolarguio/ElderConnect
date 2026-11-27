-- Dados fictícios para desenvolvimento; não são contas de login reais.
BEGIN;
SET LOCAL ROLE elderconnect_app;
INSERT INTO public.interests(id,name) VALUES
('musica','Música'),('danca','Dança'),('bem-estar','Bem-estar'),
('caminhada','Caminhadas'),('arte','Arte e artesanato'),('cultura','Cultura'),
('gastronomia','Gastronomia'),('tecnologia','Tecnologia'),('leitura','Leitura'),
('jardinagem','Jardinagem'),('voluntariado','Voluntariado'),('esportes','Esportes')
ON CONFLICT(id) DO NOTHING;
INSERT INTO public.categories(id,name) SELECT id,name FROM public.interests ON CONFLICT(id) DO NOTHING;
INSERT INTO public.users(id,name,email,password_hash,role,age,city,state) VALUES
('demo-u1','Maria Oliveira','usuario@elderconnect.demo','!DEMO_NO_LOGIN!','USER',62,'Aracaju','SE'),
('demo-o1','João Santos','organizador@elderconnect.demo','!DEMO_NO_LOGIN!','ORGANIZER',55,'Aracaju','SE')
ON CONFLICT(id) DO NOTHING;
INSERT INTO public.user_interests(user_id,interest_id) VALUES
('demo-u1','musica'),('demo-u1','caminhada'),('demo-u1','bem-estar') ON CONFLICT DO NOTHING;
INSERT INTO public.events(id,organizer_id,category_id,title,description,starts_at,address,neighborhood,city,capacity,price) VALUES
('ev-01','demo-o1','caminhada','Caminhada e bem-estar na Orla','Atividade coletiva de caminhada e socialização.',NOW()+INTERVAL '3 days','Orla de Atalaia','Atalaia','Aracaju',35,0),
('ev-02','demo-o1','musica','Tarde de música e boas memórias','Encontro musical e troca de experiências.',NOW()+INTERVAL '5 days','Centro de Aracaju','Centro','Aracaju',50,0),
('ev-03','demo-o1','arte','Oficina de pintura para iniciantes','Oficina de técnicas básicas de pintura.',NOW()+INTERVAL '7 days','Bairro Jardins','Jardins','Aracaju',20,25),
('ev-04','demo-o1','leitura','Roda de leitura e café','Encontro para leitura e socialização.',NOW()+INTERVAL '9 days','Centro Histórico','Centro Histórico','São Cristóvão',18,0),
('ev-05','demo-o1','danca','Dança de salão para todos','Aula coletiva de dança.',NOW()+INTERVAL '11 days','Siqueira Campos','Siqueira Campos','Aracaju',30,15),
('ev-06','demo-o1','bem-estar','Manhã de yoga e alongamento','Atividades de relaxamento e bem-estar.',NOW()+INTERVAL '13 days','13 de Julho','13 de Julho','Aracaju',25,0),
('ev-07','demo-o1','gastronomia','Sabores da nossa terra','Encontro de gastronomia sergipana.',NOW()+INTERVAL '15 days','Centro','Centro','Barra dos Coqueiros',24,20),
('ev-08','demo-o1','tecnologia','Tecnologia sem complicação','Oficina de inclusão digital.',NOW()+INTERVAL '17 days','Grageru','Grageru','Aracaju',25,0),
('ev-09','demo-o1','jardinagem','Horta urbana e novas amizades','Oficina comunitária de jardinagem.',NOW()+INTERVAL '19 days','Marcos Freire','Marcos Freire','Nossa Senhora do Socorro',20,0)
ON CONFLICT(id) DO NOTHING;
INSERT INTO public.registrations(user_id,event_id,status) VALUES ('demo-u1','ev-01','ACTIVE') ON CONFLICT(user_id,event_id) DO NOTHING;
INSERT INTO public.favorites(user_id,event_id) VALUES ('demo-u1','ev-02'),('demo-u1','ev-06') ON CONFLICT DO NOTHING;
COMMIT;
