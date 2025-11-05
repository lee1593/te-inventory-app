export function CameraCapture({ onConfirm }){
  const input = document.createElement('input');
  input.type='file';
  input.accept='image/*';
  input.capture='environment';
  input.addEventListener('change', async (e)=>{
    const file = e.target.files && e.target.files[0];
    if(!file) return;
    const url = URL.createObjectURL(file);
    const preview = document.createElement('div');
    preview.className='card';
    preview.innerHTML=`<h2>Preview</h2><img class="thumb" style="width:100%;height:auto;border-radius:10px;border:1px solid #eee" src="${url}"/>`;
    const row=document.createElement('div');
    row.className='nav';
    const useBtn=document.createElement('button');
    useBtn.textContent='Use Photo';
    const retake=document.createElement('button');
    retake.textContent='Retake';
    retake.className='secondary';
    row.append(useBtn, retake);
    preview.append(row);
    document.getElementById('app').append(preview);

    useBtn.addEventListener('click', ()=>{
      onConfirm && onConfirm(file);
      URL.revokeObjectURL(url);
      preview.remove();
    });
    retake.addEventListener('click', ()=>{
      URL.revokeObjectURL(url);
      preview.remove();
      input.value='';
      input.click();
    });
  });
  input.click();
}
