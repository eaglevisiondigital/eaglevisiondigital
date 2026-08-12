const loadComponent = async (selector, path) => {
  const target = document.querySelector(selector);
  if (!target) return;
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Could not load ${path}`);
    target.innerHTML = await response.text();
  } catch (error) {
    console.error(error);
  }
};

const initializeNavigation = () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
};

const initializeReveals = () => {
  const items = document.querySelectorAll('.reveal');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach(item => item.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(item => observer.observe(item));
};

const initializeYear = () => {
  document.querySelectorAll('[data-current-year]').forEach(node => {
    node.textContent = new Date().getFullYear();
  });
};

(async () => {
  await Promise.all([
    loadComponent('[data-component="header"]', '/components/header.html'),
    loadComponent('[data-component="footer"]', '/components/footer.html')
  ]);
  initializeNavigation();
  initializeYear();
  initializeReveals();
})();
