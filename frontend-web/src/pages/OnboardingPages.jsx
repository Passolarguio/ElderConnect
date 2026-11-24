import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ArrowRight,Camera,Check,MapPin,Navigation,SkipForward} from 'lucide-react';
import Logo from '../components/Logo.jsx';
import {Field} from '../components/Ui.jsx';
import {useApp,nextScreen} from '../app/AppContext.jsx';
import {INTERESTS} from '../data/demo.js';
import {getInitials} from '../domain/recommendations.js';
import {validateProfile} from '../domain/validation.js';
import {resizeAvatar} from '../domain/avatar.js';
export function ProfileSetupPage(){
 const {user,saveProfile,busy,isDemo}=useApp(),navigate=useNavigate();
 const [age,setAge]=useState(user?.age?.toString()||''),[city,setCity]=useState(user?.city||'Aracaju'),[photo,setPhoto]=useState(user?.avatarUrl||''),[photoFile,setPhotoFile]=useState(null),[error,setError]=useState(''),[errors,setErrors]=useState({});
 async function pickPhoto(e){const f=e.target.files?.[0];if(!f)return;try{setPhoto(await resizeAvatar(f));setPhotoFile(f);setError('');}catch(err){setError(err.message);}}
 async function submit(e){e.preventDefault();const check=validateProfile({age,city});setErrors(check);if(Object.keys(check).length)return;
  try{const next=await saveProfile({age:Number(age),city:city.trim(),state:'SE',avatarUrl:isDemo?photo:undefined,avatarFile:!isDemo?photoFile:undefined});navigate(nextScreen(next),{replace:true});}catch(err){setError(err.message);}
 }
 return <div className="onboard-shell"><header className="onboard-header"><Logo/><span>ETAPA 1 DE {user?.role==='ORGANIZER'?'1':'2'}</span></header><div className="onboard-body"><div className="steps"><span className="active"/><span className={user?.role==='ORGANIZER'?'muted':''}/></div><div className="onboard-icon">👋</div><h1>Vamos nos conhecer melhor?</h1><p className="onboard-lead">Queremos que sua experiência seja acolhedora e feita especialmente para você.</p><form onSubmit={submit} className="onboard-form">
   <div className="photo-picker"><div className="avatar avatar-large">{photo?<img src={photo} alt="Prévia da foto de perfil"/>:getInitials(user?.name)}</div><label htmlFor="photo" className="upload-label"><Camera size={18}/> Escolher foto <input id="photo" type="file" accept="image/*" onChange={pickPhoto} hidden/></label><span>Opcional · JPG ou PNG · até 2 MB</span></div>
   <div className="form-row"><Field label="Sua idade" id="age" error={errors.age}><input id="age" type="number" min="18" max="120" value={age} onChange={e=>setAge(e.target.value)} placeholder="Ex.: 58"/></Field><Field label="Sua cidade em Sergipe" id="city" error={errors.city}><input id="city" value={city} onChange={e=>setCity(e.target.value)} placeholder="Ex.: Aracaju"/></Field></div>
   <div className="hint-box"><MapPin size={19}/><span>Usamos sua cidade para destacar atividades próximas. A localização precisa é opcional e será solicitada somente com sua autorização.</span></div>
   {error&&<p role="alert" className="field-error">{error}</p>}
   <button className="btn btn-primary btn-wide" disabled={busy} type="submit">{busy?'Salvando...':'Continuar'} <ArrowRight size={19}/></button>
  </form></div></div>;
}
export function InterestsPage(){
 const {user,saveInterests,busy}=useApp(),navigate=useNavigate();const [selected,setSelected]=useState(user?.interests||[]),[error,setError]=useState('');
 function toggle(id){setError('');setSelected(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);}
 async function submit(){if(!selected.length){setError('Escolha pelo menos uma atividade.');return;}try{const next=await saveInterests(selected);navigate(nextScreen(next),{replace:true});}catch(e){setError(e.message);}}
 return <div className="onboard-shell"><header className="onboard-header"><Logo/><span>ETAPA 2 DE 2</span></header><div className="onboard-body wide"><div className="steps"><span className="active"/><span className="active"/></div><div className="onboard-icon">✨</div><h1>O que faz seus olhos brilharem?</h1><p className="onboard-lead">Selecione as atividades de que gosta. Essas preferências serão usadas pelo sistema de recomendações para encontrar eventos que combinam com você.</p><div className="interests-grid">{INTERESTS.map(item=><button type="button" key={item.id} className={`interest-tile ${selected.includes(item.id)?'picked':''}`} onClick={()=>toggle(item.id)} aria-pressed={selected.includes(item.id)}><span className="interest-emoji" style={{backgroundColor:item.color}}>{item.emoji}</span><strong>{item.name}</strong>{selected.includes(item.id)&&<span className="interest-check"><Check size={15}/></span>}</button>)}</div>
 {error&&<p className="field-error" role="alert">{error}</p>}
 <div className="interest-bottom"><span>{selected.length} {selected.length===1?'interesse selecionado':'interesses selecionados'}</span><button className="btn btn-primary" disabled={busy} onClick={submit}>Descobrir meus eventos <ArrowRight size={19}/></button></div>
 </div></div>;
}
