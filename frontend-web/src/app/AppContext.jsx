import {createContext,useContext,useEffect,useMemo,useState} from 'react';
import {demoStore} from '../services/demoStore.js';
import {httpApi} from '../services/httpApi.js';
const service=import.meta.env.VITE_API_MODE==='api'?httpApi:demoStore;
const Context=createContext(null);
export const useApp=()=>{const state=useContext(Context);if(!state)throw new Error('useApp fora de AppProvider');return state;};
export function nextScreen(user){if(!user?.age || !user?.city)return '/criar-perfil';if(user.role==='USER' && !user.interests?.length)return '/escolher-interesses';return user.role==='ORGANIZER'?'/organizador':'/inicio';}
export function AppProvider({children}){
 const [user,setUser]=useState(null),[token,setToken]=useState(sessionStorage.getItem('elderconnect.api.token')||null);
 const [events,setEvents]=useState([]),[recommendations,setRecommendations]=useState([]);
 const [favorites,setFavorites]=useState([]),[registrations,setRegistrations]=useState([]);
 const [booting,setBooting]=useState(true),[busy,setBusy]=useState(false),[notice,setNotice]=useState('');
 const isDemo=service.mode==='demo';
 const notify=msg=>setNotice(msg);
 async function fetchData(current=user,authToken=token){
  if(!current)return;
  const results=await Promise.allSettled([
   service.getEvents(),
   isDemo?service.getRecommendations(current):service.getRecommendations(authToken),
   isDemo?service.getFavorites(current.id):service.getFavorites(authToken),
   isDemo?service.getRegistrations(current.id):service.getRegistrations(authToken)
  ]);
  const value=(index,fallback)=>results[index].status==='fulfilled'?results[index].value:fallback;
  const ev=value(0,[]), rec=value(1,[]), favs=value(2,[]), regs=value(3,[]);
  setEvents(Array.isArray(ev)?ev:ev?.items||[]);
  // Backend: {items:[{event,score,reason}]}; UI exibe evento normalizado.
  const recList=Array.isArray(rec)?rec:rec?.items||[];
  setRecommendations(recList.map(r=>r.event?{...r.event,recommendationScore:r.score,recommendationReason:r.reason}:r));
  setFavorites(Array.isArray(favs)?favs:favs?.eventIds||[]);
  setRegistrations(Array.isArray(regs)?regs:regs?.eventIds||[]);
  if(results.some(r=>r.status==='rejected'))notify('Alguns dados não puderam ser carregados. Confira quais endpoints já estão disponíveis na API.');
 }
 useEffect(()=>{let active=true;(async()=>{
   try{
    const session=isDemo?await service.getMe():token?await service.getMe(token):null;
    if(active&&session){setUser(session);await fetchData(session,token);}
   }catch{if(active){sessionStorage.removeItem('elderconnect.api.token');setToken(null);}}
   finally{if(active)setBooting(false);}
  })();return ()=>{active=false;}; // sessão no modo API volta pela rota autenticada
  // eslint-disable-next-line react-hooks/exhaustive-deps
 },[]);
 async function run(action){setBusy(true);setNotice('');try{return await action();}catch(e){notify(e.message||'Ocorreu um erro.');throw e;}finally{setBusy(false);}}
 async function register(input){return run(async()=>{const response=await service.register(input);await adopt(response);return response.user;});}
 async function login(input){return run(async()=>{const response=await service.login(input);await adopt(response);return response.user;});}
 async function adopt({user:next,token:nextToken}){
   setUser(next);setToken(nextToken||null);
   if(!isDemo&&nextToken)sessionStorage.setItem('elderconnect.api.token',nextToken);
   await fetchData(next,nextToken);
 }
 async function logout(){if(isDemo)await service.logout();sessionStorage.removeItem('elderconnect.api.token');setToken(null);setUser(null);setEvents([]);setFavorites([]);setRegistrations([]);setRecommendations([]);}
 async function saveProfile(patch){return run(async()=>{
   const next=isDemo?await service.updateProfile(user.id,patch):await service.updateProfile(token,patch);
   setUser(next);await fetchData(next,token);return next;
 });}
 async function saveInterests(ids){return run(async()=>{
   const next=isDemo?await service.setInterests(user.id,ids):await service.setInterests(token,ids);
   setUser(next);await fetchData(next,token);return next;
 });}
 async function toggleFavorite(eventId){return run(async()=>{
   const exists=favorites.includes(eventId);
   if(isDemo)await service.toggleFavorite(user.id,eventId);else await service.toggleFavorite(token,eventId,exists);
   setFavorites(old=>exists?old.filter(id=>id!==eventId):[...old,eventId]);
   notify(exists?'Evento removido dos favoritos.':'Evento salvo nos favoritos.');
 });}
 async function joinEvent(eventId){return run(async()=>{
   if(isDemo)await service.registerForEvent(user.id,eventId);else await service.registerForEvent(token,eventId);
   setRegistrations(old=>[...new Set([...old,eventId])]);notify('Inscrição realizada! Você pode acompanhar em Minhas inscrições.');
 });}
 async function cancelRegistration(eventId){return run(async()=>{
   if(isDemo)await service.cancelRegistration(user.id,eventId);else await service.cancelRegistration(token,eventId);
   setRegistrations(old=>old.filter(id=>id!==eventId));notify('Inscrição cancelada.');
 });}
 async function publishEvent(payload){return run(async()=>{
   const created=isDemo?await service.createEvent(user.id,user.name,payload):await service.createEvent(token,payload);
   await fetchData(user,token);notify('Evento publicado!');return created;
 });}
 const value=useMemo(()=>({user,token,events,recommendations,favorites,registrations,booting,busy,notice,notify,isDemo,register,login,logout,saveProfile,saveInterests,toggleFavorite,joinEvent,cancelRegistration,publishEvent,refresh:()=>fetchData()}),[user,token,events,recommendations,favorites,registrations,booting,busy,notice]);
 return <Context.Provider value={value}>{children}</Context.Provider>;
}
