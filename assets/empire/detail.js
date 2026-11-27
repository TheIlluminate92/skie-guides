export const TILE_MIME = 'application/vnd.skie.empire-images';
export const MAX_UPLOAD = 6 * 1024 * 1024;
export const MAX_IMAGES = 4;

export function strips(width,height){
  if(width<1500 || width/height<1.6)return [];
  const count=Math.min(3,Math.ceil(width/900));
  const margin=Math.min(72,Math.floor(width/(count*6)));
  return Array.from({length:count},(_,index)=>{
    const x=Math.max(0,Math.floor(index*width/count)-margin);
    const end=Math.min(width,Math.ceil((index+1)*width/count)+margin);
    return {x,width:end-x};
  });
}

// Each frame is a four-byte big-endian length followed by image bytes.
// The request-size cap includes the overview and every derived image.
export function imageSet(images){
  if(!images.length||images.length>MAX_IMAGES)throw Error('Invalid image count.');
  const chunks=[];
  for(const image of images){
    const length=new ArrayBuffer(4);
    new DataView(length).setUint32(0,image.size);
    chunks.push(length,image);
  }
  return new Blob(chunks,{type:TILE_MIME});
}
function encodeCanvas(canvas,type,quality){
  return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(Error('Unable to prepare screenshot.')),type,quality));
}
export async function prepareImage(file){
  if(typeof createImageBitmap!=='function')return file;
  const bitmap=await createImageBitmap(file);
  try{
    const {width,height}=bitmap;
    if(width>8192||height>8192||width*height>12000000)throw Error('Choose a crop up to 12 megapixels.');
    const selected=strips(width,height);if(!selected.length)return file;

    async function makeUpload(compress){
      const canvas=document.createElement('canvas');
      const frames=[];
      if(compress){
        const factor=Math.min(1,1600/Math.max(width,height));
        canvas.width=Math.round(width*factor);canvas.height=Math.round(height*factor);
        canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);
        frames.push(await encodeCanvas(canvas,'image/jpeg',0.9));
      }else frames.push(file);
      for(const area of selected){
        const scale=Math.min(1.5,1350/Math.max(height,area.width));
        canvas.width=Math.max(1,Math.round(area.width*scale)); canvas.height=Math.max(1,Math.round(height*scale));
        const context=canvas.getContext('2d');context.imageSmoothingEnabled=false;
        context.drawImage(bitmap,area.x,0,area.width,height,0,0,canvas.width,canvas.height);
        frames.push(await encodeCanvas(canvas,compress?'image/jpeg':'image/png',0.94));
      }
      canvas.width=canvas.height=1;
      return imageSet(frames);
    }
    const lossless=await makeUpload(false);
    if(lossless.size<=MAX_UPLOAD)return lossless;
    const compact=await makeUpload(true);
    if(compact.size>MAX_UPLOAD)throw Error('Crop to fewer planet columns per screenshot to preserve readable detail under 6 MiB.');
    return compact;
  }finally{bitmap.close();}
}
