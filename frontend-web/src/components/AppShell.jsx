import {NavLink,Outlet,useLocation,useNavigate} from 'react-router-dom';
import {CalendarCheck,Compass,Heart,House,LogOut,PlusCircle,Search,Settings,UserCircle2,LayoutDashboard,MapPin,Menu} from 'lucide-react';
import {useApp} from '../app/AppContext.jsx';
import {getInitials} from '../domain/recommendations.js';
import Logo from './Logo.jsx';
const userNav=[{to:'/inicio',label:'Início',icon:House},{to:'/explorar',label:'Explorar',icon:Compass},{to:'/favoritos',label:'Favoritos',icon:Heart},{to:'/minhas-inscricoes',label:'Inscrições',icon:CalendarCheck},{to:'/perfil',label:'Meu perfil',icon:UserCircle2}];
const organizerNav=[{to:'/organizador',label:'Painel',icon:LayoutDashboard},{to:'/organizador/novo-evento',label:'Criar evento',icon:PlusCircle},{to:'/explorar',label:'Explorar',icon:Compass},{to:'/perfil',label:'Meu perfil',icon:UserCircle2}];
export default function AppShell(){
 const {user,logout,isDemo,notice,notify}=useApp();const navigate=useNavigate(),location=useLocation();const nav=user?.role==='ORGANIZER'?organizerNav:userNav;
 return <div className="shell">
  <aside className="sidebar">
   <Logo/>
   <div className="sidebar-caption">MENU PRINCIPAL</div>
   <nav className="desktop-nav" aria-label="Navegação principal">{nav.map(({to,label,icon:Icon})=><NavLink end={to==='/inicio'||to==='/organizador'} key={to} className={({isActive})=>`nav-item ${isActive?'active':''}`} to={to}><Icon size={20}/>{label}</NavLink>)}</nav>
   <div className="sidebar-bottom">
    <div className="community-note"><span>🌿</span><strong>Conexões que transformam</strong><small>Descubra experiências na sua comunidade.</small></div>
    <button className="nav-item exit" onClick={async()=>{await logout();navigate('/');}}><LogOut size={19}/> Sair da conta</button>
   </div>
  </aside>
  <div className="workspace">
   <header className="topbar">
    <div className="mobile-logo"><Logo/></div>
    <div className="topbar-location"><MapPin size={18}/><span>{user?.city||'Sergipe'}, {user?.state||'SE'}</span></div>
    <div className="topbar-actions">
     {isDemo&&<span className="demo-pill">Modo demonstração</span>}
     <button className="top-search" title="Pesquisar eventos" onClick={()=>navigate('/explorar')}><Search size={20}/></button>
     <button className="avatar avatar-small" aria-label="Abrir meu perfil" onClick={()=>navigate('/perfil')}>{user?.avatarUrl?<img src={user.avatarUrl} alt=""/>:getInitials(user?.name)}</button>
    </div>
   </header>
   <main className="main-content" id="principal"><Outlet/></main>
  </div>
  <nav className="bottom-nav" aria-label="Navegação mobile">{nav.slice(0,5).map(({to,label,icon:Icon})=><NavLink end={to==='/inicio'||to==='/organizador'} key={to} className={({isActive})=>`bottom-link ${isActive?'active':''}`} to={to}><Icon size={22}/><span>{label.length>10?label.split(' ')[0]:label}</span></NavLink>)}</nav>
  {notice&&<div className="toast" role="status"><span>{notice}</span><button aria-label="Fechar aviso" onClick={()=>notify('')}>×</button></div>}
 </div>;
}
