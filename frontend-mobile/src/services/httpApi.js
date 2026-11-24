const base=(process.env.EXPO_PUBLIC_API_URL||'http://localhost:8080').replace(/\/$/,'');
async function request(path,{method='GET',body,token,form=false}={}){
 const h={Accept:'application/json'};
 if(body!==undefined&&!form)h['Content-Type']='application/json';
 if(token)h.Authorization=`Bearer ${token}`;
 const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),15000);
 try{const resp=await fetch(`${base}/api${path}`,{method,headers:h,body:body===undefined?undefined:form?body:JSON.stringify(body),signal:ctrl.signal});const data=await resp.json().catch(()=>null);if(!resp.ok)throw new Error(data?.message||'Erro ao conversar com o servidor.');return data;}catch(e){if(e.name==='AbortError')throw new Error('Tempo de conexão excedido.');if(e instanceof TypeError)throw new Error('Servidor indisponível. Confira o IP da API e a rede Wi-Fi.');throw e;}finally{clearTimeout(timer);}
}
export const httpApi={mode:'api',
 register:input=>request('/auth/register',{method:'POST',body:{fullName:input.name,email:input.email,password:input.password,role:input.role}}),
 login:input=>request('/auth/login',{method:'POST',body:input}),
 getMe:token=>request('/users/me',{token}),
 updateProfile:async(token,patch)=>{let avatarUrl=patch.avatarUrl;
  if(patch.avatarFile){const form=new FormData();form.append('file',{uri:patch.avatarFile.uri,type:patch.avatarFile.mimeType||'image/jpeg',name:patch.avatarFile.fileName||'avatar.jpg'});const response=await request('/users/me/avatar',{method:'POST',token,body:form,form:true});avatarUrl=response.avatarUrl;}
  const {avatarFile,...fields}=patch;return request('/users/me',{method:'PUT',token,body:{...fields,avatarUrl}});
 },
 setInterests:(token,interests)=>request('/users/me/interests',{method:'PUT',token,body:{interestIds:interests}}),
 getEvents:()=>request('/events'),getRecommendations:token=>request('/recommendations',{token}),
 getFavorites:token=>request('/users/me/favorites',{token}),toggleFavorite:(token,id,exists)=>request(`/users/me/favorites/${encodeURIComponent(id)}`,{method:exists?'DELETE':'POST',token}),
 getRegistrations:token=>request('/users/me/registrations',{token}),registerForEvent:(token,id)=>request(`/events/${encodeURIComponent(id)}/registrations`,{method:'POST',token}),
 cancelRegistration:(token,id)=>request(`/events/${encodeURIComponent(id)}/registrations/me`,{method:'DELETE',token}),
 createEvent:(token,event)=>request('/events',{method:'POST',token,body:event})
};
