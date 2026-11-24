import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import {DEMO_EVENTS,DEMO_PROFILES} from '../data/demo';
import {rankEvents} from '../domain/recommendations';
const key=k=>'elderconnect.native.demo.v1.'+k;
async function read(k,def){try{const v=await AsyncStorage.getItem(key(k));return v?JSON.parse(v):def;}catch{return def;}}
async function write(k,v){await AsyncStorage.setItem(key(k),JSON.stringify(v));}
const demoUsers=DEMO_PROFILES.map(u=>({...u,salt:'preset',passwordHash:'',preset:true}));
async function users(){return read('users',demoUsers);}
const safe=({passwordHash,salt,preset,...rest})=>rest;
const hash=(password,salt)=>Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256,`${salt}:${password}`); // SOMENTE protótipo local, nunca autenticação de produção
export const demoStore={
 mode:'demo',
 async getMe(){const id=await read('session',null);return (await users()).find(u=>u.id===id)?safe((await users()).find(u=>u.id===id)):null;},
 async register({name,email,password,role}){const all=await users();email=email.toLowerCase().trim();if(all.some(u=>u.email===email))throw new Error('Este e-mail já foi cadastrado.');const salt=Crypto.randomUUID(),id=Crypto.randomUUID();const u={id,name:name.trim(),email,role,age:null,city:'',state:'SE',avatarUrl:'',interests:[],salt,passwordHash:await hash(password,salt)};await write('users',[...all,u]);await write('session',id);return {token:'demo',user:safe(u)};},
 async login({email,password}){const u=(await users()).find(x=>x.email===email.toLowerCase().trim());const ok=!!u&&(u.preset?password==='Demo1234!':await hash(password,u.salt)===u.passwordHash);if(!ok)throw new Error('E-mail ou senha incorretos.');await write('session',u.id);return {token:'demo',user:safe(u)};},
 async logout(){await AsyncStorage.removeItem(key('session'));},
 async updateProfile(id,patch){const all=(await users()).map(u=>u.id===id?{...u,...Object.fromEntries(Object.entries(patch).filter(([k])=>['age','city','state','avatarUrl','latitude','longitude','name'].includes(k)))}:u);await write('users',all);return safe(all.find(u=>u.id===id));},
 async setInterests(id,interests){const all=(await users()).map(u=>u.id===id?{...u,interests}:u);await write('users',all);return safe(all.find(u=>u.id===id));},
 async getEvents(){return [...await read('createdEvents',[]),...DEMO_EVENTS].sort((a,b)=>new Date(a.startsAt)-new Date(b.startsAt));},
 async getRecommendations(user){return rankEvents(await this.getEvents(),user);},
 async getFavorites(id){return (await read('favorites',[])).filter(f=>f.userId===id).map(f=>f.eventId);},
 async toggleFavorite(id,eventId){const all=await read('favorites',[]),exists=all.some(f=>f.userId===id&&f.eventId===eventId);await write('favorites',exists?all.filter(f=>!(f.userId===id&&f.eventId===eventId)):[...all,{userId:id,eventId}]);},
 async getRegistrations(id){return (await read('registrations',[])).filter(r=>r.userId===id).map(r=>r.eventId);},
 async registerForEvent(id,eventId){const all=await read('registrations',[]);if(all.some(r=>r.userId===id&&r.eventId===eventId))throw new Error('Você já está inscrito.');const event=(await this.getEvents()).find(e=>e.id===eventId);if(!event)throw new Error('Evento não encontrado.');if(new Date(event.startsAt).getTime()<=Date.now())throw new Error('Este evento já aconteceu.');if((event.registeredCount||0)+all.filter(r=>r.eventId===eventId).length>=event.capacity)throw new Error('Não há vagas disponíveis.');await write('registrations',[...all,{userId:id,eventId}]);},
 async cancelRegistration(id,eventId){await write('registrations',(await read('registrations',[])).filter(r=>!(r.userId===id&&r.eventId===eventId)));},
 async createEvent(id,organizerName,payload){const event={...payload,id:Crypto.randomUUID(),organizerId:id,organizerName,registeredCount:0,state:'SE',status:'PUBLISHED'};await write('createdEvents',[event,...await read('createdEvents',[])]);return event;}
};
