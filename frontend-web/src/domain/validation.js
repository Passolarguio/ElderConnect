export const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((e||'').trim());
export function validateAuth(values, isRegister) {
  const errors = {};
  if (isRegister && (values.name||'').trim().length < 2) errors.name = 'Informe seu nome completo.';
  if (!isValidEmail(values.email)) errors.email = 'Informe um e-mail válido.';
  if (!values.password || values.password.length < 8) errors.password = 'A senha precisa ter pelo menos 8 caracteres.';
  if (isRegister && values.password !== values.confirm) errors.confirm = 'As senhas não coincidem.';
  return errors;
}
export function validateProfile(values) {
  const errors = {};
  if (!Number.isInteger(Number(values.age)) || Number(values.age) < 18 || Number(values.age) > 120) errors.age='Informe uma idade válida (18 a 120).';
  if ((values.city||'').trim().length < 2) errors.city = 'Informe sua cidade.';
  return errors;
}
export function validateEvent(v) {
  const errors={};
  if ((v.title||'').trim().length<5) errors.title='O título precisa ter pelo menos 5 caracteres.';
  if ((v.description||'').trim().length<20) errors.description='Descreva o evento com pelo menos 20 caracteres.';
  if (!v.categoryId) errors.categoryId='Escolha uma categoria.';
  if (!v.startsAt || !Number.isFinite(new Date(v.startsAt).getTime()) || new Date(v.startsAt).getTime() <= Date.now()) errors.startsAt='Escolha uma data e horário futuros.';
  if ((v.city||'').trim().length<2) errors.city='Informe a cidade.';
  if ((v.address||'').trim().length<5) errors.address='Informe o endereço.';
  if (!Number.isInteger(Number(v.capacity)) || Number(v.capacity)<1) errors.capacity='Informe uma capacidade válida.';
  if (!Number.isFinite(Number(v.price)) || Number(v.price)<0) errors.price='Informe um valor válido.';
  return errors;
}
