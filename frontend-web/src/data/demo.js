/* TODOS os eventos deste arquivo são fictícios. Servem apenas para demonstração. */
export const INTERESTS = [
  { id: 'musica', name: 'Música', emoji: '🎶', color: '#E7DFFB' },
  { id: 'danca', name: 'Dança', emoji: '💃', color: '#FFE4DB' },
  { id: 'bem-estar', name: 'Bem-estar', emoji: '🧘', color: '#DDF3E7' },
  { id: 'caminhada', name: 'Caminhadas', emoji: '🌿', color: '#E3F1D3' },
  { id: 'arte', name: 'Arte e artesanato', emoji: '🎨', color: '#F7E7CC' },
  { id: 'cultura', name: 'Cultura', emoji: '🏛️', color: '#DCE9F9' },
  { id: 'gastronomia', name: 'Gastronomia', emoji: '☕', color: '#FCE8D7' },
  { id: 'tecnologia', name: 'Tecnologia', emoji: '💻', color: '#DDEDF5' },
  { id: 'leitura', name: 'Leitura', emoji: '📚', color: '#F1E1F1' },
  { id: 'jardinagem', name: 'Jardinagem', emoji: '🌱', color: '#E6EFD8' },
  { id: 'voluntariado', name: 'Voluntariado', emoji: '🤝', color: '#F8E9DD' },
  { id: 'esportes', name: 'Esportes', emoji: '🚴', color: '#DAECEB' },
];

const daysLater = (days, hour) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

const event = (id, title, categoryId, days, hour, city, neighborhood, extras={}) => ({
  id, title, categoryId, startsAt: daysLater(days, hour), city, neighborhood,
  state: 'SE', description: 'Uma oportunidade de conhecer pessoas, compartilhar histórias e viver novas experiências em comunidade. Atividade fictícia criada para a demonstração do ElderConnect.',
  organizerId: 'demo-o1', organizerName: 'Comunidade ElderConnect',
  address: `${neighborhood}, ${city} - SE`, capacity: 30, registeredCount: 8,
  price: 0, image: '', status: 'PUBLISHED', ...extras,
});

export const DEMO_EVENTS = [
  event('ev-01', 'Caminhada e bem-estar na Orla', 'caminhada', 3, 7, 'Aracaju', 'Atalaia', {image:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=920&q=85', latitude:-10.9915, longitude:-37.0417, price:0, registeredCount:18, capacity:35, description:'Um encontro leve para caminhar, respirar ar puro e fazer novas amizades. Ritmo tranquilo, paradas para descanso e acolhimento para todos os níveis.'}),
  event('ev-02', 'Tarde de música e boas memórias', 'musica', 5, 16, 'Aracaju', 'Centro', {image:'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=920&q=85', latitude:-10.9175, longitude:-37.0558, price:0, registeredCount:24, capacity:50, description:'Músicas brasileiras, conversa e uma tarde especial em boa companhia. Traga suas lembranças e venha se divertir.'}),
  event('ev-03', 'Oficina de pintura para iniciantes', 'arte', 7, 14, 'Aracaju', 'Jardins', {image:'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=920&q=85', latitude:-10.9459, longitude:-37.0631, price:25, registeredCount:9, capacity:20, description:'Explore cores e técnicas simples de pintura em um ambiente descontraído. Não precisa ter experiência.'}),
  event('ev-04', 'Roda de leitura e café', 'leitura', 9, 15, 'São Cristóvão', 'Centro Histórico', {image:'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=920&q=85', latitude:-11.0155, longitude:-37.2067, price:0, registeredCount:11, capacity:18, description:'Histórias, livros e um bom café. Participe de uma roda de leitura acolhedora com pessoas que adoram conversar.'}),
  event('ev-05', 'Dança de salão para todos', 'danca', 11, 18, 'Aracaju', 'Siqueira Campos', {image:'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=920&q=85', latitude:-10.913, longitude:-37.079, price:15, registeredCount:12, capacity:30, description:'Passos simples e muita alegria para descobrir o prazer de dançar em grupo. Não é necessário levar par.'}),
  event('ev-06', 'Manhã de yoga e alongamento', 'bem-estar', 13, 8, 'Aracaju', '13 de Julho', {image:'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=920&q=85', latitude:-10.9319, longitude:-37.0524, price:0, registeredCount:16, capacity:25, description:'Uma manhã tranquila de movimento suave, alongamento e bem-estar, com orientações adaptadas.'}),
  event('ev-07', 'Sabores da nossa terra', 'gastronomia', 15, 10, 'Barra dos Coqueiros', 'Centro', {image:'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=920&q=85', latitude:-10.901, longitude:-37.033, price:20, registeredCount:8, capacity:24, description:'Encontro para trocar receitas, histórias e experimentar sabores da culinária sergipana.'}),
  event('ev-08', 'Tecnologia sem complicação', 'tecnologia', 17, 14, 'Aracaju', 'Grageru', {image:'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=920&q=85', latitude:-10.945, longitude:-37.072, price:0, registeredCount:20, capacity:25, description:'Aprenda a usar recursos úteis do celular e da internet no seu ritmo, com apoio paciente e prático.'}),
  event('ev-09', 'Horta urbana e novas amizades', 'jardinagem', 19, 9, 'Nossa Senhora do Socorro', 'Marcos Freire', {image:'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=920&q=85', latitude:-10.853, longitude:-37.117, price:0, registeredCount:6, capacity:20, description:'Descubra dicas de cultivo em pequenos espaços e participe de uma oficina de jardinagem comunitária.'}),
];

export const DEMO_PROFILES = [
  {id:'demo-u1', name:'Maria Oliveira', email:'usuario@elderconnect.demo', role:'USER', age:62, city:'Aracaju', state:'SE', avatarUrl:'', interests:['musica','caminhada','bem-estar']},
  {id:'demo-o1', name:'João Santos', email:'organizador@elderconnect.demo', role:'ORGANIZER', age:55, city:'Aracaju', state:'SE', avatarUrl:'', interests:[]},
];
export const DEMO_PASSWORD = 'Demo1234!';
