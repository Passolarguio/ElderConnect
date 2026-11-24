import {useEffect,useMemo,useState} from 'react';
import {Link,useNavigate,useSearchParams} from 'react-router-dom';
import {ArrowRight,CalendarDays,ChevronRight,Compass,Filter,MapPin,Search,SlidersHorizontal,Sparkles,TrendingUp} from 'lucide-react';
import {useApp} from '../app/AppContext.jsx';
import {INTERESTS} from '../data/demo.js';
import EventCard from '../components/EventCard.jsx';
import {EmptyState} from '../components/Ui.jsx';
import {isFuture} from '../domain/recommendations.js';
export function HomePage(){
 const {user,events,recommendations,isDemo}=useApp(),navigate=useNavigate();const firstName=user?.name?.split(' ')[0]||'Você';
 const future=events.filter(isFuture).filter(e=>e.status==='PUBLISHED');const recommended=recommendations.filter(isFuture).slice(0,4);const latest=[...future].sort((a,b)=>new Date(a.startsAt)-new Date(b.startsAt)).slice(0,6);
 return <div className="home-page page-content">
  <div className="welcome"><div><p className="overline">BEM-VINDO DE VOLTA 👋</p><h1>Olá, {firstName}!</h1><p>Que tal viver algo novo hoje?</p></div><span className="date-chip">🌤️ Descubra Sergipe</span></div>
  <section className="hero"><div className="hero-content"><span className="hero-badge">🌿 EXPERIÊNCIAS QUE APROXIMAM</span><h2>Os melhores encontros<br/>começam com um <em>olá.</em></h2><p>Encontre atividades perto de você, conheça novas pessoas e colecione boas histórias.</p><Link className="btn btn-cream" to="/explorar">Explorar atividades <ArrowRight size={19}/></Link></div><div className="hero-illustration" aria-hidden="true"><div className="blob one"/><div className="blob two"/><div className="hero-flower">🌻</div><div className="hero-card-mini"><span>♡</span><strong>Mais encontros</strong><small>Mais momentos felizes</small></div></div></section>
  <div className="section-heading"><div><span className="section-eyebrow"><Sparkles size={15}/> FEITO PARA VOCÊ</span><h2>Escolhidos para seus gostos</h2><p>{isDemo?'Sugestões simuladas com base nas suas preferências e cidade.':'Recomendações personalizadas geradas pelo serviço de Machine Learning.'}</p></div><Link className="text-link" to="/explorar">Ver todos <ChevronRight size={18}/></Link></div>
  {recommended.length?<div className="event-grid">{recommended.map(event=><EventCard event={event} key={event.id}/>)}</div>:<EmptyState title="Suas sugestões aparecerão aqui" description="Preencha seus interesses para encontrar atividades que combinam com você." action="Escolher interesses" to="/escolher-interesses"/>}
  <section className="category-section"><div className="section-heading"><div><span className="section-eyebrow">EXPLORE POR ASSUNTO</span><h2>O que você quer fazer?</h2></div></div><div className="categories-row">{INTERESTS.slice(0,7).map(c=><button className="category-chip" key={c.id} onClick={()=>navigate(`/explorar?categoria=${c.id}`)}><span style={{backgroundColor:c.color}}>{c.emoji}</span>{c.name}<ChevronRight size={15}/></button>)}</div></section>
  <div className="section-heading"><div><span className="section-eyebrow"><CalendarDays size={15}/> AGENDA DA COMUNIDADE</span><h2>Próximos encontros</h2><p>Mais oportunidades para sair, aprender e fazer amizades.</p></div><Link to="/explorar" className="text-link">Ver agenda <ChevronRight size={18}/></Link></div>
  <div className="event-grid">{latest.map(event=><EventCard event={event} key={event.id}/>)}</div>
 </div>;
}
export function ExplorePage(){
 const {events,user}=useApp();const [params]=useSearchParams();
 const [query,setQuery]=useState(''),[category,setCategory]=useState(params.get('categoria')||'todos'),[city,setCity]=useState('todas'),[free,setFree]=useState(false);
 useEffect(()=>setCategory(params.get('categoria')||'todos'),[params]);
 const cities=['todas',...new Set(events.map(e=>e.city).filter(Boolean))];
 const filtered=useMemo(()=>events.filter(isFuture).filter(e=>e.status==='PUBLISHED').filter(e=>category==='todos'||e.categoryId===category).filter(e=>city==='todas'||e.city===city).filter(e=>!free||Number(e.price)===0).filter(e=>`${e.title} ${e.description} ${e.city} ${e.neighborhood}`.toLowerCase().includes(query.toLowerCase())).sort((a,b)=>new Date(a.startsAt)-new Date(b.startsAt)),[events,query,category,city,free]);
 return <div className="page-content"><div className="page-heading"><span className="section-eyebrow">ENCONTRE O QUE AMA</span><h1>Explore os eventos</h1><p>Descubra atividades e experiências especiais em Sergipe.</p></div>
  <div className="explore-tools"><div className="search-bar"><Search size={21}/><input aria-label="Pesquisar eventos" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Busque por eventos, temas ou lugares..."/></div><div className="explore-filter"><MapPin size={18}/><select aria-label="Filtrar por cidade" value={city} onChange={e=>setCity(e.target.value)}>{cities.map(c=><option key={c} value={c}>{c==='todas'?'Todas as cidades':c}</option>)}</select></div><label className="free-toggle"><input type="checkbox" checked={free} onChange={e=>setFree(e.target.checked)}/> Gratuitos</label></div>
  <div className="filter-categories" aria-label="Filtrar categorias"><button className={category==='todos'?'active':''} onClick={()=>setCategory('todos')}>✨ Todos</button>{INTERESTS.map(c=><button className={category===c.id?'active':''} key={c.id} onClick={()=>setCategory(c.id)}>{c.emoji} {c.name}</button>)}</div>
  <div className="result-row"><strong>{filtered.length} {filtered.length===1?'evento encontrado':'eventos encontrados'}</strong><span>Ordenados por data</span></div>
  {filtered.length?<div className="event-grid">{filtered.map(e=><EventCard key={e.id} event={e}/>)}</div>:<EmptyState title="Não encontramos eventos com esses filtros" description="Tente outra categoria, cidade ou palavra-chave." action="Limpar filtros" to={null} emoji="🔎"/>}
 </div>;
}
