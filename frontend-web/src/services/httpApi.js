/* Adaptador HTTP: o time de backend só precisa respeitar docs/CONTRATO_API.md. */
const base=(import.meta.env.VITE_API_URL||'http://localhost:8080').replace(/\/$/,'');
async function request(path,{method='GET',body,token,isForm=false}={}){
 const headers={Accept:'application/json'};
 if(!isForm&&body!==undefined)headers['Content-Type']='application/json';
 if(token)headers.Authorization=`Bearer ${token}`;
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
 try{
  const response=await fetch(`${base}/api${path}`,{method,headers,body:body===undefined?undefined:(isForm?body:JSON.stringify(body)),signal:controller.signal});
  const data=await response.json().catch(()=>null);
  if(!response.ok)throw new Error(data?.message||data?.error||`Falha na solicitação (${response.status}).`);
  return data;
 }catch(error){if(error.name==='AbortError')throw new Error('A conexão demorou muito. Tente novamente.');if(error instanceof TypeError)throw new Error('Não foi possível acessar o servidor Spring Boot.');throw error;}
 finally{clearTimeout(timer);}
}
export const httpApi={
 mode:'api',
 register:input=>request('/auth/register',{method:'POST',body:{fullName:input.name,email:input.email,password:input.password,role:input.role}}),
 login:input=>request('/auth/login',{method:'POST',body:input}),
 getMe:token=>request('/users/me',{token}),
 updateProfile:async(token,patch)=>{
   let avatarUrl=patch.avatarUrl;
   // Fotos são enviadas como arquivo (multipart) no modo API; não salvamos Data URLs no banco.
   if(patch.avatarFile){const form=new FormData();form.append('file',patch.avatarFile);const image=await request('/users/me/avatar',{method:'POST',token,body:form,isForm:true});avatarUrl=image.avatarUrl;}
   const {avatarFile,...data}=patch;return request('/users/me',{method:'PUT',token,body:{...data,avatarUrl}});
 },
 setInterests:(token,interests)=>request('/users/me/interests',{method:'PUT',token,body:{interestIds:interests}}),
 getEvents:()=>request('/events'),
 getRecommendations:token=>request('/recommendations',{token}),
 getFavorites:token=>request('/users/me/favorites',{token}),
 toggleFavorite:(token,eventId,exists)=>request(`/users/me/favorites/${encodeURIComponent(eventId)}`,{method:exists?'DELETE':'POST',token}),
 getRegistrations:token=>request('/users/me/registrations',{token}),
 registerForEvent:(token,eventId)=>request(`/events/${encodeURIComponent(eventId)}/registrations`,{method:'POST',token}),
 cancelRegistration:(token,eventId)=>request(`/events/${encodeURIComponent(eventId)}/registrations/me`,{method:'DELETE',token}),
 createEvent:(token,payload)=>request('/events',{method:'POST',token,body:payload}),
};
