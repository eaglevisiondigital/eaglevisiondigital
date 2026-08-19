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

// Custom Websites FAQ — single-open accordion behavior.
// Opening a new FAQ closes any previously opened FAQ on the page.
const customWebsiteFaqItems = [...document.querySelectorAll('.websites-page .cw-faq details')];
customWebsiteFaqItems.forEach(item => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    customWebsiteFaqItems.forEach(other => {
      if (other !== item && other.open) other.removeAttribute('open');
    });
  });
});

// Mobile Apps FAQ — single-open accordion behavior.
const mobileAppFaqItems = [...document.querySelectorAll('.apps-page .ma-faq details')];
mobileAppFaqItems.forEach(item => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    mobileAppFaqItems.forEach(other => {
      if (other !== item && other.open) other.removeAttribute('open');
    });
  });
});


// =========================================================
// Eagle Vision Digital — Payments Savings Calculator System
// Shared math and URL handoff for homepage + expanded page.
// =========================================================
(() => {
  const cards = [...document.querySelectorAll('[data-paycalc]')];
  if (!cards.length) return;

  // Slider positions deliberately allocate most physical travel to $3K–$100K.
  const volumeMap = [
    { p: 0,   v: 3000 },
    { p: 8,   v: 5000 },
    { p: 18,  v: 10000 },
    { p: 34,  v: 25000 },
    { p: 46,  v: 40000 },
    { p: 58,  v: 60000 },
    { p: 72,  v: 100000 },
    { p: 82,  v: 200000 },
    { p: 92,  v: 500000 },
    { p: 100, v: 1000000 }
  ];

  const money = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });

  function clamp(n, min, max){ return Math.min(max, Math.max(min, n)); }

  function volumeFromPosition(pos){
    const p = clamp(Number(pos), 0, 100);
    let left = volumeMap[0], right = volumeMap[volumeMap.length - 1];
    for (let i = 0; i < volumeMap.length - 1; i++) {
      if (p >= volumeMap[i].p && p <= volumeMap[i + 1].p) {
        left = volumeMap[i]; right = volumeMap[i + 1]; break;
      }
    }
    const ratio = (p - left.p) / (right.p - left.p || 1);
    const raw = left.v + (right.v - left.v) * ratio;
    let increment = 500;
    if (raw >= 10000) increment = 1000;
    if (raw >= 100000) increment = 5000;
    if (raw >= 200000) increment = 10000;
    if (raw >= 500000) increment = 25000;
    return clamp(Math.round(raw / increment) * increment, 3000, 1000000);
  }

  function positionFromVolume(volume){
    const v = clamp(Number(volume) || 25000, 3000, 1000000);
    let left = volumeMap[0], right = volumeMap[volumeMap.length - 1];
    for (let i = 0; i < volumeMap.length - 1; i++) {
      if (v >= volumeMap[i].v && v <= volumeMap[i + 1].v) {
        left = volumeMap[i]; right = volumeMap[i + 1]; break;
      }
    }
    const ratio = (v - left.v) / (right.v - left.v || 1);
    return left.p + (right.p - left.p) * ratio;
  }

  function discountFor(volume){
    if (volume < 10000) return { upfront: 250, monthly: 10, tier: 'Under $10,000 / month' };
    if (volume < 20000) return { upfront: 500, monthly: 25, tier: '$10,000–$19,999 / month' };
    if (volume < 40000) return { upfront: 1000, monthly: 50, tier: '$20,000–$39,999 / month' };
    if (volume < 75000) return { upfront: 1500, monthly: 75, tier: '$40,000–$74,999 / month' };
    if (volume <= 100000) return { upfront: 2000, monthly: 100, tier: '$75,000–$100,000 / month' };
    return { upfront: null, monthly: null, tier: 'Over $100,000 / month — custom quote' };
  }

  function setText(card, selector, value){
    const node = card.querySelector(selector);
    if (node) node.textContent = value;
  }

  function updateCard(card, volume, position){
    card.classList.add('is-updating');
    window.clearTimeout(card._paycalcTimer);
    card._paycalcTimer = window.setTimeout(() => card.classList.remove('is-updating'), 110);

    card.dataset.volume = String(volume);
    setText(card, '[data-volume-output]', money.format(volume));

    const slider = card.querySelector('.paycalc-slider');
    if (slider) {
      slider.value = String(position);
      slider.style.setProperty('--progress', `${position}%`);
      slider.setAttribute('aria-valuetext', `${money.format(volume)} per month`);
    }

    if (card.dataset.paycalc === 'processing') {
      const fees = volume * 0.04;
      const monthlySavings = fees * 0.99;
      const annualSavings = monthlySavings * 12;
      setText(card, '[data-fees]', money.format(fees));
      setText(card, '[data-monthly-savings]', money.format(monthlySavings));
      setText(card, '[data-annual-savings]', money.format(annualSavings));
    }

    if (card.dataset.paycalc === 'advantage') {
      const d = discountFor(volume);
      if (d.upfront == null) {
        setText(card, '[data-upfront]', 'CUSTOM');
        setText(card, '[data-monthly-discount]', 'CUSTOM');
        setText(card, '[data-first-year]', 'CUSTOM QUOTE');
      } else {
        setText(card, '[data-upfront]', money.format(d.upfront));
        setText(card, '[data-monthly-discount]', `${money.format(d.monthly)}/MO`);
        setText(card, '[data-first-year]', money.format(d.upfront + d.monthly * 12));
      }
      const tier = card.querySelector('[data-tier-note] strong');
      if (tier) tier.textContent = d.tier;
    }

    const link = card.querySelector('[data-calculator-link]');
    if (link) {
      const calc = link.dataset.calculatorLink;
      const anchor = calc === 'processing' ? '#processing-savings' : '#digital-payments-advantage';
      link.href = `/services/payment-solutions/?calculator=${encodeURIComponent(calc)}&volume=${encodeURIComponent(volume)}${anchor}`;
    }
  }

  const params = new URLSearchParams(window.location.search);
  const initialVolumeParam = Number(params.get('volume'));
  const hasValidParam = Number.isFinite(initialVolumeParam) && initialVolumeParam >= 3000 && initialVolumeParam <= 1000000;
  const initialVolume = hasValidParam ? initialVolumeParam : 25000;
  const initialPosition = positionFromVolume(initialVolume);

  cards.forEach(card => {
    const slider = card.querySelector('.paycalc-slider');
    const defaultPosition = hasValidParam ? initialPosition : Number(slider?.value || 34);
    const defaultVolume = hasValidParam ? initialVolume : volumeFromPosition(defaultPosition);
    updateCard(card, defaultVolume, defaultPosition);

    slider?.addEventListener('input', () => {
      const position = Number(slider.value);
      updateCard(card, volumeFromPosition(position), position);
    });

    slider?.addEventListener('change', () => {
      const volume = Number(card.dataset.volume || 25000);
      // Keep both calculators synchronized after a committed slider selection.
      cards.forEach(other => {
        if (other !== card) updateCard(other, volume, positionFromVolume(volume));
      });
    });
  });
})();

// =========================================================
// Eagle Vision Digital — Contact form conditional fields
// =========================================================
(() => {
  const pairs = [
    ['contact-industry', 'contact-industry-other', 'industry_other'],
    ['contact-interest', 'contact-interest-other', 'interest_other']
  ];

  pairs.forEach(([selectId, wrapperId, inputName]) => {
    const select = document.getElementById(selectId);
    const wrapper = document.getElementById(wrapperId);
    if (!select || !wrapper) return;
    const input = wrapper.querySelector(`[name="${inputName}"]`);

    const sync = () => {
      const show = select.value === 'Other';
      wrapper.hidden = !show;
      if (input) {
        input.required = show;
        if (!show) input.value = '';
      }
      if (show && input) window.setTimeout(() => input.focus({preventScroll:true}), 50);
    };

    select.addEventListener('change', sync);
    sync();
  });
})();


// =========================================================
// Homepage — New Client Result center-screen proof notification
// =========================================================
(() => {
  const popover = document.getElementById('client-result-popover');
  if (!popover) return;
  const close = popover.querySelector('.client-result-popover-close');
  const link = popover.querySelector('.client-result-popover-link');
  const storageKey = 'evd-client-result-aug-2026-seen';

  const hide = () => {
    popover.classList.remove('is-visible');
    window.setTimeout(() => { popover.hidden = true; }, 280);
    try { sessionStorage.setItem(storageKey, '1'); } catch (e) {}
  };

  let seen = false;
  try { seen = sessionStorage.getItem(storageKey) === '1'; } catch (e) {}
  if (!seen) {
    window.setTimeout(() => {
      popover.hidden = false;
      requestAnimationFrame(() => popover.classList.add('is-visible'));
    }, 5500);
  }

  close?.addEventListener('click', hide);
  link?.addEventListener('click', hide);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !popover.hidden) hide();
  });
})();
