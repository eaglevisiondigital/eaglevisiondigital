// Eagle Vision Digital — production interactions (no external libraries)
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
navToggle?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: .1 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// 60-second solution finder
const finder = document.querySelector('#solution-finder');
const startFinder = document.querySelector('#start-finder');
const modal = document.querySelector('.finder-modal');
const questions = [...document.querySelectorAll('.question')];
const progress = document.querySelector('.finder-progress span');
const next = document.querySelector('#finder-next');
const back = document.querySelector('#finder-back');
const result = document.querySelector('.finder-result');
const resultTitle = document.querySelector('#finder-result-title');
const resultText = document.querySelector('#finder-result-text');
let step = 0;

function showStep(){
  questions.forEach((q,i) => q.classList.toggle('active', i === step));
  progress.style.width = `${((step+1)/questions.length)*100}%`;
  back.style.visibility = step === 0 ? 'hidden' : 'visible';
  next.textContent = step === questions.length-1 ? 'Show My Recommendation →' : 'Next →';
}
startFinder?.addEventListener('click', () => {
  modal.classList.add('open');
  result.classList.remove('active');
  step = 0; showStep();
  modal.scrollIntoView({behavior:'smooth', block:'center'});
});
back?.addEventListener('click', () => { if(step>0){step--;showStep();} });

next?.addEventListener('click', () => {
  const q = questions[step];
  if (!q.querySelector('input:checked')) {
    q.querySelector('label')?.focus?.();
    return;
  }
  if(step < questions.length-1){ step++; showStep(); return; }

  const values = [...finder.querySelectorAll('input:checked')].map(i=>i.value);
  let title = 'Connected Digital Growth System';
  let text = 'Your answers point to a connected solution that combines a strong digital front door with automation and customer engagement.';
  if(values.includes('website') && !values.includes('app') && !values.includes('automation')){
    title='Custom Growth Website';
    text='A high-performance custom website is the strongest starting point for your current goals, with room to add automation, portals or apps as you grow.';
  } else if(values.includes('app') && values.includes('engagement')){
    title='Website + Mobile App Ecosystem';
    text='Your business would benefit from a website that attracts new customers and a mobile app that keeps customers or members connected.';
  } else if(values.includes('automation') || values.includes('operations')){
    title='AI & Workflow Automation System';
    text='Your biggest opportunity is reducing repetitive work and connecting systems so your team can operate more efficiently.';
  } else if(values.includes('portal')){
    title='Customer Portal / Membership Platform';
    text='A secure portal or membership environment can centralize content, communication, access and customer self-service.';
  }
  questions.forEach(q=>q.classList.remove('active'));
  resultTitle.textContent=title;
  resultText.textContent=text;
  result.classList.add('active');
  progress.style.width='100%';
  document.querySelector('.finder-actions').style.display='none';
});

document.querySelector('#restart-finder')?.addEventListener('click', () => {
  finder.querySelectorAll('input').forEach(i=>i.checked=false);
  result.classList.remove('active');
  document.querySelector('.finder-actions').style.display='flex';
  step=0; showStep();
});
