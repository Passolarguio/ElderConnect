import React,{createContext,useContext,useEffect,useMemo,useState} from 'react';
import {demoStore} from '../services/demoStore';
import {httpApi} from '../services/httpApi';
const api=process.env.EXPO_PUBLIC_API_MODE==='api'?httpApi:demoStore;
const Context=createContext(null);
export const useApp=()=>useContext(Context);
export function Provider({children}){
 const [user,setUser]=useState(null),[token,setToken]=useState(null),[events,setEvents]=useState([]),[recommendations,setRecommendations]=useState([]),[favorites,setFavorites]=useState([]),[registrations,setRegistrations]=useState([]),[booting,setBooting]=useState(true),[busy,setBusy]=useState(false);
 const isDemo=api.mode==='demo';
 async function refresh(current=user,t=token){
  if(!current)return;
  const results=await Promise.allSettled([
   api.getEvents(),isDemo?api.getRecommendations(current):api.getRecommendations(t),
   isDemo?api.getFavorites(current.id):api.getFavorites(t),
   isDemo?api.getRegistrations(current.id):api.getRegistrations(t)
  ]);
  const value=(i,otherwise)=>results[i].status==='fulfilled'?results[i].value:otherwise;
  const ev=value(0,[]),rec=value(1,[]),fav=value(2,[]),reg=value(3,[]);
  setEvents(Array.isArray(ev)?ev:ev?.items||[]);
  const items=Array.isArray(rec)?rec:rec?.items||[];
  setRecommendations(items.map(x=>x.event?{...x.event,recommendationScore:x.score}:x));
  setFavorites(Array.isArray(fav)?fav:fav?.eventIds||[]);
  setRegistrations(Array.isArray(reg)?reg:reg?.eventIds||[]);
  if(results.some(r=>r.status==='rejected'))console.warn('ElderConnect: alguns endpoints ainda não estão disponíveis');
 }
 useEffect(()=>{(async()=>{try{if(isDemo){const u=await api.getMe();if(u){setUser(u);await refresh(u,'demo');}}}catch(e){console.warn('ElderConnect:',e.message);}finally{setBooting(false);}})();},[]);
 async function task(fn){setBusy(true);try{return await fn();}finally{setBusy(false);}}
 async function adopt(r){setUser(r.user);setToken(r.token);await refresh(r.user,r.token);return r.user;}
 async function register(input){return task(async()=>adopt(await api.register(input)));}
 async function login(input){return task(async()=>adopt(await api.login(input)));}
 async function logout(){if(isDemo)await api.logout();setToken(null);setUser(null);setEvents([]);setRecommendations([]);setFavorites([]);setRegistrations([]);}
 async function saveProfile(patch){return task(async()=>{const next=isDemo?await api.updateProfile(user.id,patch):await api.updateProfile(token,patch);setUser(next);await refresh(next,token);return next;});}
 async function saveInterests(ids){return task(async()=>{const next=isDemo?await api.setInterests(user.id,ids):await api.setInterests(token,ids);setUser(next);await refresh(next,token);return next;});}
 async function toggleFavorite(id){const already=favorites.includes(id);return task(async()=>{if(isDemo)await api.toggleFavorite(user.id,id);else await api.toggleFavorite(token,id,already);setFavorites(prev=>already?prev.filter(x=>x!==id):[...prev,id]);});}
 async function joinEvent(id){return task(async()=>{if(isDemo)await api.registerForEvent(user.id,id);else await api.registerForEvent(token,id);setRegistrations(prev=>[...new Set([...prev,id])]);});}
 async function cancelRegistration(id){return task(async()=>{if(isDemo)await api.cancelRegistration(user.id,id);else await api.cancelRegistration(token,id);setRegistrations(prev=>prev.filter(x=>x!==id));});}
 async function publishEvent(payload){return task(async()=>{const event=isDemo?await api.createEvent(user.id,user.name,payload):await api.createEvent(token,payload);await refresh(user,token);return event;});}
 const value={user,token,events,recommendations,favorites,registrations,booting,busy,isDemo,register,login,logout,saveProfile,saveInterests,toggleFavorite,joinEvent,cancelRegistration,publishEvent,refresh};
 return <Context.Provider value={value}>{children}</Context.Provider>;
}
