import {useState} from 'react';
import {Link} from 'react-router-dom';
import {Camera,Check,Edit3,LogOut,MapPin,Navigation,ShieldCheck,Sparkles} from 'lucide-react';
import {useApp} from '../app/AppContext.jsx';
import {INTERESTS} from '../data/demo.js';
import {getInitials} from '../domain/recommendations.js';
import {validateProfile} from '../domain/validation.js';
import {resizeAvatar} from '../domain/avatar.js';
export default function ProfilePage(){
 const {user,saveProfile,logout,busy,isDemo,notify}=useApp();const [name,setName]=useState(user?.name||''),[age,setAge]=useState(String(user?.age||'')),[city,setCity]=useState(user?.city||'Aracaju'),[photo,setPhoto]=useState(user?.avatarUrl||''),[file,setFile]=useState(null),[error,setError]=useState('');
 async function fileChange(e){const img=e.target.files?.[0];if(!img)return;try{setPhoto(await resizeAvatar(img));setFile(img);setError('');}catch(err){setError(err.message);}}
 async function submit(e){e.preventDefault();const errors=validateProfile({age,city});if(name.trim().length<2||Object.keys(errors).length){setError(name.trim().length<2?'Informe seu nome.':Object.values(errors)[0]);return;}
  try{await saveProfile({name:name.trim(),age:Number(age),city:city.trim(),state:'SE',avatarUrl:isDemo?photo:undefined,avatarFile:!isDemo?file:undefined});notify('Perfil salvo com sucesso!');setError('');}catch(err){setError(err.message);}}
 function detectLocation(){if(!navigator.geolocation){setError('Seu navegador não permite localização.');return;}navigator.geolocation.getCurrentPosition(async p=>{try{await saveProfile({latitude:p.coords.latitude,longitude:p.coords.longitude});notify('Localização autorizada. A distância poderá ser calculada quando o serviço estiver integrado.');}catch(err){setError(err.message);}},()=>setError('Localização não autorizada. Você pode continuar usando sua cidade.'),{enableHighAccuracy:false,timeout:10000});}
 return <div className="page-content profile-page"><div className="page-heading"><span className="section-eyebrow">SUA CONTA</span><h1>Meu perfil</h1><p>Informações para tornar sua experiência ainda mais especial.</p></div><div className="profile-grid"><form className="form-panel" onSubmit={submit}>
  <div className="profile-avatar-row"><div className="avatar avatar-large">{photo?<img src={photo} alt="Sua foto de perfil"/>:getInitials(user?.name)}</div><div><strong>{user?.name}</strong><span>{user?.role==='ORGANIZER'?'Organizador de eventos':'Participante'}</span><label htmlFor="avatar" className="upload-label"><Camera size={17}/> Alterar foto<input hidden id="avatar" type="file" accept="image/*" onChange={fileChange}/></label></div></div>
  <div className="field"><label htmlFor="name">Nome completo</label><input id="name" value={name} onChange={e=>setName(e.target.value)}/></div>
  <div className="field"><label htmlFor="email">E-mail</label><input id="email" value={user?.email||''} readOnly disabled/></div>
  <div className="form-row"><div className="field"><label htmlFor="age">Idade</label><input id="age" type="number" min="18" max="120" value={age} onChange={e=>setAge(e.target.value)}/></div><div className="field"><label htmlFor="city">Cidade</label><input id="city" value={city} onChange={e=>setCity(e.target.value)}/></div></div>
  {error&&<p className="field-error" role="alert">{error}</p>}<button className="btn btn-primary" disabled={busy} type="submit"><Check size={19}/> Salvar alterações</button>
 </form>
 <aside className="profile-aside"><section className="side-card"><div className="side-icon"><Sparkles size={22}/></div><h3>Seus interesses</h3><p>Esses temas ajudam a encontrar eventos alinhados ao seu perfil.</p><div className="interest-tags">{(user?.interests||[]).map(id=>{const c=INTERESTS.find(i=>i.id===id);return c?<span key={id}>{c.emoji} {c.name}</span>:null;})}</div>{user?.role==='USER'&&<Link to="/escolher-interesses" className="text-link">Editar meus interesses →</Link>}</section>
 <section className="side-card"><div className="side-icon"><Navigation size={22}/></div><h3>Localização</h3><p>Você pode permitir acesso opcional à sua localização para calcular distâncias até os eventos. Não é necessário para usar o aplicativo.</p><button type="button" className="btn btn-outline btn-wide" onClick={detectLocation}><MapPin size={17}/> Permitir localização</button></section>
 <section className="side-card account-safety"><ShieldCheck size={22}/><strong>Seus dados importam</strong><p>{isDemo?'Este protótipo guarda dados de demonstração apenas no dispositivo. Não utilize uma senha real neste modo.':'A autenticação e a proteção de dados precisam ser configuradas pelo backend.'}</p></section>
 </aside></div></div>;
}
