import {ArrowUpRight,CalendarDays,Heart,MapPin,Users} from 'lucide-react';
import {Link} from 'react-router-dom';
import {INTERESTS} from '../data/demo.js';
import {formatDate,formatTime,formatMoney} from '../domain/recommendations.js';
import {useApp} from '../app/AppContext.jsx';
export default function EventCard({event,compact=false}){
 const {favorites,toggleFavorite,user}=useApp();
 const category=INTERESTS.find(x=>x.id===event.categoryId)||{name:'Atividade',emoji:'🌼'};
 const saved=favorites.includes(event.id);
 return <article className={`event-card ${compact?'event-card-compact':''}`}>
  <Link to={`/evento/${event.id}`} className="event-cover" aria-label={`Ver ${event.title}`}>
   <div className="cover-fallback" style={{backgroundColor:category.color||'#d8eadf'}}><span>{category.emoji}</span></div>
   {event.image&&<img loading="lazy" src={event.image} alt="" onError={e=>{e.currentTarget.style.display='none';}}/>}
   <span className="cover-category">{category.emoji} {category.name}</span>
  </Link>
  {user?.role==='USER'&&<button type="button" className={`heart-btn ${saved?'selected':''}`} aria-label={saved?'Remover dos favoritos':'Adicionar aos favoritos'} aria-pressed={saved} onClick={()=>toggleFavorite(event.id)}><Heart size={19} fill={saved?'currentColor':'none'}/></button>}
  <div className="event-info">
   <div className="event-date"><CalendarDays size={15}/>{formatDate(event.startsAt)} · {formatTime(event.startsAt)}</div>
   <Link className="event-title" to={`/evento/${event.id}`}>{event.title}</Link>
   <div className="event-location"><MapPin size={15}/>{event.distanceFromUserKm!==null&&Number.isFinite(event.distanceFromUserKm)?`A ${event.distanceFromUserKm.toFixed(1)} km · `:''}{event.neighborhood?`${event.neighborhood} · `:''}{event.city}, SE</div>
   <div className="event-footer"><span className={`price ${event.price===0?'free':''}`}>{formatMoney(event.price)}</span><Link aria-label={`Detalhes de ${event.title}`} className="circle-arrow" to={`/evento/${event.id}`}><ArrowUpRight size={19}/></Link></div>
  </div>
 </article>;
}
