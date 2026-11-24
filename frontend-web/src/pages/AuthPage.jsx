import {useEffect,useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ArrowRight,Eye,EyeOff,ShieldCheck,UsersRound,CalendarHeart} from 'lucide-react';
import Logo from '../components/Logo.jsx';
import {Field} from '../components/Ui.jsx';
import {useApp,nextScreen} from '../app/AppContext.jsx';
import {validateAuth} from '../domain/validation.js';
const empty={name:'',email:'',password:'',confirm:'',role:'USER'};
export default function AuthPage({defaultMode='register'}){
 const [mode,setMode]=useState(defaultMode),[values,setValues]=useState(empty),[errors,setErrors]=useState({}),[visible,setVisible]=useState(false),[splash,setSplash]=useState(false);
 const {user,register,login,busy,isDemo,notice}=useApp();const navigate=useNavigate();
 useEffect(()=>{if(user)navigate(nextScreen(user),{replace:true});},[user,navigate]);
 // A tela de abertura aparece somente na primeira visita, sem bloquear o cadastro.
 useEffect(()=>{if(!sessionStorage.getItem('elderconnect.splash')){setSplash(true);sessionStorage.setItem('elderconnect.splash','1');const t=setTimeout(()=>setSplash(false),1150);return ()=>clearTimeout(t);}},[]);
 const isRegister=mode==='register';
 function change(field,value){setValues(v=>({...v,[field]:value}));setErrors(e=>({...e,[field]:null}));}
 function switchMode(next){setMode(next);setErrors({});setValues(v=>({...v,password:'',confirm:''}));}
 async function submit(e){e.preventDefault();const nextErrors=validateAuth(values,isRegister);setErrors(nextErrors);if(Object.keys(nextErrors).length)return;
  try{const logged=isRegister?await register(values):await login(values);navigate(nextScreen(logged),{replace:true});}catch{/* O AppContext apresenta a mensagem. */}
 }
 if(splash)return <div className="splash"><img src={`${import.meta.env.BASE_URL}logo.svg`} alt=""/><strong>Elder<span>Connect</span></strong><p>Experiências que aproximam</p></div>;
 return <div className="auth-layout"><div className="auth-top"><Logo link="/"/><span className="auth-top-aux"><ShieldCheck size={16}/> Seu espaço, seu ritmo</span></div>
  <div className="auth-grid"><section className="auth-form-card"><div className="auth-eyebrow"><span className="dot"/> BEM-VINDO AO ELDERCONNECT</div><h1>{isRegister?'Uma nova experiência começa aqui.':'Que bom ter você de volta!'}</h1><p className="auth-subtitle">{isRegister?'Crie sua conta e descubra atividades, pessoas e lugares que combinam com você.':'Acesse sua conta para continuar descobrindo encontros e experiências.'}</p>
   <div className="auth-tabs" role="tablist" aria-label="Acesso à conta"><button type="button" className={isRegister?'selected':''} onClick={()=>switchMode('register')} role="tab" aria-selected={isRegister}>Criar conta</button><button type="button" className={!isRegister?'selected':''} onClick={()=>switchMode('login')} role="tab" aria-selected={!isRegister}>Entrar</button></div>
   <form onSubmit={submit} noValidate>
    {isRegister&&<><div className="field"><span className="field-label">Como deseja participar?</span><div className="role-options"><button type="button" className={`role-option ${values.role==='USER'?'chosen':''}`} aria-pressed={values.role==='USER'} onClick={()=>change('role','USER')}><UsersRound size={23}/><strong>Participante</strong><small>Quero descobrir eventos</small></button><button type="button" className={`role-option ${values.role==='ORGANIZER'?'chosen':''}`} aria-pressed={values.role==='ORGANIZER'} onClick={()=>change('role','ORGANIZER')}><CalendarHeart size={23}/><strong>Organizador</strong><small>Quero publicar eventos</small></button></div></div>
    <Field label="Nome completo" id="name" error={errors.name}><input id="name" autoComplete="name" placeholder="Como podemos chamar você?" value={values.name} onChange={e=>change('name',e.target.value)} aria-invalid={!!errors.name}/></Field></>}
    <Field label="E-mail" id="email" error={errors.email}><input id="email" type="email" inputMode="email" autoComplete="email" placeholder="seuemail@exemplo.com" value={values.email} onChange={e=>change('email',e.target.value)} aria-invalid={!!errors.email}/></Field>
    <Field label="Senha" id="password" error={errors.password}><div className="password-wrap"><input id="password" autoComplete={isRegister?'new-password':'current-password'} type={visible?'text':'password'} placeholder="Pelo menos 8 caracteres" value={values.password} onChange={e=>change('password',e.target.value)} aria-invalid={!!errors.password}/><button type="button" className="password-toggle" onClick={()=>setVisible(x=>!x)} aria-label={visible?'Ocultar senha':'Mostrar senha'}>{visible?<EyeOff size={19}/>:<Eye size={19}/>}</button></div></Field>
    {isRegister&&<Field label="Confirmar senha" id="confirm" error={errors.confirm}><input id="confirm" type={visible?'text':'password'} autoComplete="new-password" placeholder="Repita sua senha" value={values.confirm} onChange={e=>change('confirm',e.target.value)} aria-invalid={!!errors.confirm}/></Field>}
    {notice&&<p className="alert-error" role="alert">{notice}</p>}
    <button disabled={busy} className="btn btn-primary btn-wide auth-submit" type="submit">{busy?'Aguarde...':isRegister?'Criar minha conta':'Entrar na minha conta'} <ArrowRight size={19}/></button>
   </form>
   <p className="switch-auth">{isRegister?'Já possui uma conta?':'Ainda não tem uma conta?'} <button type="button" onClick={()=>switchMode(isRegister?'login':'register')}>{isRegister?'Entrar':'Cadastrar-se'}</button></p>
   {isDemo&&<div className="demo-help"><span>🧪</span><div><strong>Teste sem servidor</strong><p>Use <b>usuario@elderconnect.demo</b> ou <b>organizador@elderconnect.demo</b> com senha <b>Demo1234!</b>. Os dados são fictícios e ficam apenas neste navegador.</p></div></div>}
  </section>

 </div><footer className="auth-footer">© {new Date().getFullYear()} ElderConnect · Projeto acadêmico Silver Economy · Sergipe</footer>
 </div>;
}
