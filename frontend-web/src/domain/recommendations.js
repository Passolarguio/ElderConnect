/** Apenas heurística local do modo DEMO — não é um modelo de Machine Learning. */
export function rankEvents(events, profile) {
  const interests = profile?.interests || [];
  return [...events].filter(e => e.status === 'PUBLISHED').map(event => {
    const km = distanceKm(profile, event);
    return {
      ...event,
      distanceFromUserKm: km,
      demoScore: (interests.includes(event.categoryId) ? 60 : 0) +
        (event.city?.toLowerCase() === profile?.city?.toLowerCase() ? 20 : 0) +
        (km !== null ? (km <= 5 ? 20 : km <= 15 ? 12 : km <= 40 ? 5 : 0) : 0) +
        (event.price === 0 ? 5 : 0),
    };
  }).sort((a,b) => b.demoScore - a.demoScore || new Date(a.startsAt)-new Date(b.startsAt));
}
export function isFuture(event) { return new Date(event.startsAt).getTime() > Date.now(); }
export function formatDate(value) {
  return new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'short',year:'numeric',timeZone:'America/Maceio'}).format(new Date(value));
}
export function formatTime(value) {
  return new Intl.DateTimeFormat('pt-BR',{hour:'2-digit',minute:'2-digit',timeZone:'America/Maceio'}).format(new Date(value));
}
export function formatMoney(value) {return value === 0 ? 'Gratuito' : new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(value);}
export function getInitials(name='') {return name.trim().split(/\s+/).slice(0,2).map(x=>x[0]?.toUpperCase()).join('') || 'EC';}
export function distanceKm(a,b) {
  if (![a?.latitude,a?.longitude,b?.latitude,b?.longitude].every(Number.isFinite)) return null;
  const rad=x=>x*Math.PI/180, dLat=rad(b.latitude-a.latitude), dLon=rad(b.longitude-a.longitude);
  const h = Math.sin(dLat/2)**2+Math.cos(rad(a.latitude))*Math.cos(rad(b.latitude))*Math.sin(dLon/2)**2;
  return 6371*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h));
}
