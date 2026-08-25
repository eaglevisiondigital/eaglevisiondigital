(() => {
  const form = document.getElementById('freewebsite-form');
  const fileInput = document.getElementById('processing_statement');
  const fileList = document.getElementById('fw-file-list');
  const sticky = document.getElementById('fw-sticky-cta');

  const params = new URLSearchParams(location.search);
  ['utm_source','utm_medium','utm_campaign','utm_content'].forEach(k => {
    const el=document.getElementById(k); if(el) el.value=params.get(k)||'';
  });
  const ref=document.getElementById('referring_source'); if(ref) ref.value=document.referrer||'direct';
  const dt=document.getElementById('submission_datetime'); if(dt) dt.value=new Date().toISOString();

  const track=(name,extra={})=>{
    window.dataLayer=window.dataLayer||[];
    window.dataLayer.push({event:name,...extra});
    if(typeof window.fbq==='function') window.fbq('trackCustom',name,extra);
  };

  document.querySelectorAll('.js-scroll-form').forEach(a=>a.addEventListener('click',()=>track('freewebsite_cta_click',{placement:a.textContent.trim().slice(0,80)})));
  document.querySelectorAll('a[href^="tel:"]').forEach(a=>a.addEventListener('click',()=>track('freewebsite_phone_click')));
  document.querySelectorAll('a[href^="mailto:"]').forEach(a=>a.addEventListener('click',()=>track('freewebsite_email_click')));

  let started=false;
  form?.addEventListener('focusin',()=>{if(!started){started=true;track('freewebsite_form_start')}});

  fileInput?.addEventListener('change',()=>{
    const files=[...fileInput.files];
    document.getElementById('statement_uploaded').value=files.length?'yes':'no';
    fileList.textContent=files.length ? `${files.length} file${files.length>1?'s':''} selected: ${files.map(f=>f.name).join(', ')}` : '';
    if(files.length) track('freewebsite_statement_upload',{file_count:files.length});
  });

  if(sticky){
    const hero=document.querySelector('.fw-hero');
    const final=document.querySelector('.fw-final');
    const io=new IntersectionObserver(entries=>{
      entries.forEach(e=>{ if(e.target===hero) sticky.classList.toggle('visible',!e.isIntersecting); if(e.target===final&&e.isIntersecting) sticky.classList.remove('visible'); });
    },{threshold:.05});
    if(hero)io.observe(hero); if(final)io.observe(final);
  }

  form?.addEventListener('submit', async (e)=>{
    if(!form.checkValidity()) return;
    e.preventDefault();
    const status=document.getElementById('fw-form-status');
    const submit=form.querySelector('button[type="submit"]');
    submit.disabled=true; submit.textContent='SUBMITTING…';
    const fd=new FormData(form);
    fd.set('submission_datetime',new Date().toISOString());
    fd.set('statement_uploaded',fileInput?.files?.length?'yes':'no');
    try{
      const res=await fetch('/',{method:'POST',body:fd});
      if(!res.ok) throw new Error('Submission failed');
      track('freewebsite_form_submit',{volume:fd.get('monthly_processing_volume'),statement_uploaded:fd.get('statement_uploaded'),utm_source:fd.get('utm_source')});
      const q=new URLSearchParams({volume:String(fd.get('monthly_processing_volume')||''),statement:String(fd.get('statement_uploaded')||'no')});
      location.href='/freewebsite/thank-you/?'+q.toString();
    }catch(err){
      status.textContent='We could not submit the form automatically. Please try again or call (850) 812-4711.';
      submit.disabled=false; submit.innerHTML='CHECK MY ELIGIBILITY <span>→</span>';
    }
  });
})();
