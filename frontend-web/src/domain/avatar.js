/** Reduz a foto no browser para que o modo demo não salve imagens gigantes. */
export async function resizeAvatar(file){
 if(file.size>2_000_000)throw new Error('Escolha uma imagem de até 2 MB.');
 if(!file.type.startsWith('image/'))throw new Error('Selecione uma imagem válida.');
 return new Promise((resolve,reject)=>{
  const image=new Image(),url=URL.createObjectURL(file);
  image.onload=()=>{const canvas=document.createElement('canvas');canvas.width=256;canvas.height=256;
   const ctx=canvas.getContext('2d'),side=Math.min(image.width,image.height);
   ctx.drawImage(image,(image.width-side)/2,(image.height-side)/2,side,side,0,0,256,256);
   URL.revokeObjectURL(url);resolve(canvas.toDataURL('image/jpeg',.70));
  };
  image.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('Não foi possível ler esta imagem.'));};
  image.src=url;
 });
}
