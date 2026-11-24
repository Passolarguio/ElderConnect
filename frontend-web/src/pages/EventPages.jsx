import {Link,useNavigate,useParams} from 'react-router-dom';
import {ArrowLeft,CalendarCheck,CalendarDays,CheckCircle2,Clock3,Heart,MapPin,UsersRound,UserRound,ArrowRight,MapPinned} from 'lucide-react';
import {useApp} from '../app/AppContext.jsx';
import {INTERESTS} from '../data/demo.js';
import {formatDate,formatTime,formatMoney,getInitials} from '../domain/recommendations.js';
import EventCard from '../components/EventCard.jsx';
import {EmptyState,PageBack} from '../components/Ui.jsx';
export function EventPage(){
 const {id}=useParams();const {events,user,registrations,joinEvent,cancelRegistration,busy,favorites,toggleFavorite}=useApp();const navigate=useNavigate();
 const event=events.find(e=>e.id===id);if(!event)return <div className="page-content"><EmptyState title="Evento não encontrado" description="Este evento pode ter sido removido."/></div>;
 const category=INTERESTS.find(c=>c.id===event.categoryId)||{name:'Atividade',emoji:'🌼',color:'#DFEDE4'};
 const registered=registrations.includes(id),saved=favorites.includes(id);const remaining=Math.max(0,(event.capacity||0)-(event.registeredCount||0));
 const others=events.filter(e=>e.id!==id&&e.categoryId===event.categoryId).slice(0,3);
 return <div className="page-content event-detail"><PageBack to="/explorar" label="Voltar aos eventos"/>
  <div className="event-detail-cover" style={{background:category.color}}><div className="cover-fallback detail-fallback">{category.emoji}</div>{event.image&&<img src={event.image} alt="" onError={e=>e.currentTarget.style.display='none'}/>}<span className="cover-category">{category.emoji} {category.name}</span></div>
  <div className="detail-grid"><article className="detail-body"><span className="section-eyebrow">✨ UM ENCONTRO ESPECIAL</span><h1>{event.title}</h1><div className="detail-tags"><span className="tag light"><CalendarDays size={16}/>{formatDate(event.startsAt)}</span><span className="tag light"><Clock3 size={16}/>{formatTime(event.startsAt)}</span><span className="tag light"><MapPin size={16}/>{event.city}, SE</span></div>
   <h2>Sobre este evento</h2><p className="event-description">{event.description}</p>
   <h2>Onde acontece</h2><div className="detail-address"><MapPinned size={24}/><div><strong>{event.neighborhood||event.city}</strong><span>{event.address}</span><small>Confirme o local com o organizador antes de sair de casa.</small></div></div>
   <h2>Organizado por</h2><div className="organizer-row"><div className="avatar">{getInitials(event.organizerName)}</div><div><strong>{event.organizerName}</strong><span>Organizador da comunidade</span></div></div>
   {others.length>0&&<><h2 className="other-heading">Você também pode gostar</h2><div className="event-grid related-grid">{others.map(e=><EventCard key={e.id} event={e}/>)}</div></>}
  </article>
  <aside className="booking-card"><div className="booking-heading"><strong>{formatMoney(event.price)}</strong><span>por participante</span></div><div className="booking-item"><CalendarDays size={21}/><div><strong>Data e horário</strong><span>{formatDate(event.startsAt)} · {formatTime(event.startsAt)}</span></div></div><div className="booking-item"><MapPin size={21}/><div><strong>Local</strong><span>{event.neighborhood}, {event.city}</span></div></div><div className="booking-item"><UsersRound size={21}/><div><strong>Vagas</strong><span>{remaining} vagas estimadas disponíveis</span></div></div>
   {user.role==='USER'?<><button disabled={busy||remaining===0&&!registered} className={`btn btn-wide ${registered?'btn-outline':'btn-primary'}`} onClick={()=>registered?cancelRegistration(id):joinEvent(id)}>{registered?<><CheckCircle2 size={20}/> Inscrito · Cancelar inscrição</>:<><CalendarCheck size={20}/> {remaining===0?'Vagas esgotadas':'Quero participar'}</>}</button><button type="button" className="save-detail" onClick={()=>toggleFavorite(id)}><Heart size={19} fill={saved?'currentColor':'none'}/>{saved?'Salvo nos favoritos':'Salvar nos favoritos'}</button></>:<Link to="/organizador" className="btn btn-outline btn-wide">Voltar ao painel <ArrowRight size={18}/></Link>}
   <div className="privacy-note">🔒 {registered?'Sua inscrição está registrada.':'A participação é confirmada no sistema ao se inscrever.'}</div>
  </aside></div>
 </div>;
}
export function MyEventsPage({saved=false}){
 const {events,registrations,favorites}=useApp();const ids=saved?favorites:registrations;const items=events.filter(e=>ids.includes(e.id));
 return <div className="page-content"><div className="page-heading"><span className="section-eyebrow">MINHA AGENDA</span><h1>{saved?'Meus favoritos':'Minhas inscrições'}</h1><p>{saved?'Os encontros que você guardou para ver depois.':'Acompanhe as atividades nas quais você se inscreveu.'}</p></div>
  {items.length?<div className="event-grid">{items.map(e=><EventCard key={e.id} event={e}/>)}</div>:<EmptyState emoji={saved?'❤️':'📅'} title={saved?'Você ainda não salvou eventos':'Sua agenda está esperando por você'} description={saved?'Use o coração para guardar seus favoritos.':'Explore as atividades e faça sua primeira inscrição.'}/>}
 </div>;
}
