import {DEMO_EVENTS,DEMO_PROFILES} from '../data/demo.js';
import {rankEvents} from '../domain/recommendations.js';
const PREFIX='elderconnect.demo.v1.';
const read=(key, fallback)=>{try{const val=localStorage.getItem(PREFIX+key);return val?JSON.parse(val):fallback;}catch{return fallback;}};
const write=(key, val)=>localStorage.setItem(PREFIX+key,JSON.stringify(val));
const seeded=[
 {...DEMO_PROFILES[0],salt:'elderconnect-demo-demo-u1',passwordHash:'fc3b36f5efcdb3933365c0f54865153215b414af4f36f0908dfa4ed9b1a9c332'},
 {...DEMO_PROFILES[1],salt:'elderconnect-demo-demo-o1',passwordHash:'a886573b5678dbfe9d0e59b17c8a5f182418113bc249ec24295779d77ad68b50'}
];
const users=()=>read('users',seeded);
const safe=({passwordHash,salt,...rest})=>rest;
async function passwordHash(password,salt){
 const encoder=new TextEncoder();
 const key=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveBits']);
 const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt:encoder.encode(salt),iterations:120000,hash:'SHA-256'},key,256);
 return Array.from(new Uint8Array(bits),b=>b.toString(16).padStart(2,'0')).join('');
}
export const demoStore={
 mode:'demo',
 async getMe(){const id=read('session',null);return users().find(u=>u.id===id)?safe(users().find(u=>u.id===id)):null;},
 async register({name,email,password,role}){
   const all=users();const normalized=email.toLowerCase().trim();
   if(all.some(u=>u.email===normalized))throw new Error('Este e-mail já possui cadastro.');
   const id=crypto.randomUUID(),salt=crypto.randomUUID();
   const newUser={id,name:name.trim(),email:normalized,role,age:null,city:'',state:'SE',avatarUrl:'',interests:[],salt,passwordHash:await passwordHash(password,salt)};
   write('users',[...all,newUser]);write('session',id);return {token:'demo-session',user:safe(newUser)};
 },
 async login({email,password}){
   const u=users().find(x=>x.email===email.trim().toLowerCase());
   if(!u||u.passwordHash!==await passwordHash(password,u.salt))throw new Error('E-mail ou senha incorretos.');
   write('session',u.id);return {token:'demo-session',user:safe(u)};
 },
 async logout(){localStorage.removeItem(PREFIX+'session');},
 async updateProfile(userId, patch){
   const all=users().map(u=>u.id===userId?{...u,...Object.fromEntries(Object.entries(patch).filter(([k])=>['age','city','state','avatarUrl','latitude','longitude','name'].includes(k)))}:u);
   write('users',all);return safe(all.find(u=>u.id===userId));
 },
 async setInterests(userId,interestIds){const all=users().map(u=>u.id===userId?{...u,interests:interestIds}:u);write('users',all);return safe(all.find(u=>u.id===userId));},
 async getEvents(){return [...read('createdEvents',[]),...DEMO_EVENTS].sort((a,b)=>new Date(a.startsAt)-new Date(b.startsAt));},
 async getRecommendations(user){return rankEvents(await this.getEvents(),user);},
 async getFavorites(userId){return read('favorites',[]).filter(f=>f.userId===userId).map(f=>f.eventId);},
 async toggleFavorite(userId,eventId){const all=read('favorites',[]),exists=all.some(f=>f.userId===userId&&f.eventId===eventId);write('favorites',exists?all.filter(f=>!(f.userId===userId&&f.eventId===eventId)):[...all,{userId,eventId}]);return !exists;},
 async getRegistrations(userId){return read('registrations',[]).filter(r=>r.userId===userId).map(r=>r.eventId);},
 async registerForEvent(userId,eventId){
   const all=read('registrations',[]); if(all.some(r=>r.userId===userId&&r.eventId===eventId))throw new Error('Você já está inscrito neste evento.');
   const event=(await this.getEvents()).find(e=>e.id===eventId);
   if(!event)throw new Error('Evento não encontrado.');if(new Date(event.startsAt).getTime()<=Date.now())throw new Error('Este evento já aconteceu.');
   if((event.registeredCount||0)+all.filter(r=>r.eventId===eventId).length>=event.capacity)throw new Error('As vagas para este evento acabaram.');
   write('registrations',[...all,{userId,eventId,registeredAt:new Date().toISOString()}]);return true;
 },
 async cancelRegistration(userId,eventId){write('registrations',read('registrations',[]).filter(r=>!(r.userId===userId&&r.eventId===eventId)));},
 async createEvent(userId,organizerName,payload){const current=read('createdEvents',[]);const event={...payload,id:crypto.randomUUID(),organizerId:userId,organizerName,registeredCount:0,state:'SE',status:'PUBLISHED',createdAt:new Date().toISOString()};write('createdEvents',[event,...current]);return event;}
};
