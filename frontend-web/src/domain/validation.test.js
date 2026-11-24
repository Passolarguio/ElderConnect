import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateAuth,validateProfile,validateEvent} from './validation.js';
import {rankEvents,distanceKm} from './recommendations.js';
test('cadastro exige dados válidos',()=>{
 assert.equal(Object.keys(validateAuth({name:'Ana',email:'ana@exemplo.com',password:'12345678',confirm:'12345678'},true)).length,0);
 assert.ok(validateAuth({name:'',email:'incorreto',password:'123',confirm:'x'},true).email);
});
test('perfil valida idade e município',()=>{
 assert.ok(validateProfile({age:12,city:''}).age);
 assert.deepEqual(validateProfile({age:61,city:'Aracaju'}),{});
});
test('evento exige futuro e conteúdo',()=>{
 assert.ok(validateEvent({title:'Oi',startsAt:'2000-01-01'}).startsAt);
 assert.ok(validateEvent({title:'Evento',startsAt:'não é uma data'}).startsAt);
});
test('simulador prioriza interesses e cidade',()=>{
 const items=[{id:'a',categoryId:'arte',city:'Lagarto',price:0,status:'PUBLISHED'}, {id:'b',categoryId:'musica',city:'Aracaju',price:0,status:'PUBLISHED'}];
 assert.equal(rankEvents(items,{interests:['musica'],city:'Aracaju'})[0].id,'b');
});
test('distância entre ponto e ele mesmo é zero',()=>{
 assert.equal(distanceKm({latitude:1,longitude:1},{latitude:1,longitude:1}),0);
});
