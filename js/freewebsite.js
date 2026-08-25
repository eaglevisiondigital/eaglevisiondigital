(function () {
  const accordions = document.querySelectorAll('.faq-item');
  accordions.forEach((item) => {
    const btn = item.querySelector('.faq-q');
    btn.addEventListener('click', () => {
      const open = item.classList.contains('open');
      accordions.forEach((other) => {
        other.classList.remove('open');
        const icon = other.querySelector('.faq-q span:last-child');
        if (icon) icon.textContent = '+';
      });
      if (!open) {
        item.classList.add('open');
        const icon = item.querySelector('.faq-q span:last-child');
        if (icon) icon.textContent = '−';
      }
    });
  });

  const params = new URLSearchParams(window.location.search);
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].forEach((key) => {
    const field = document.getElementById(key);
    if (field) field.value = params.get(key) || '';
  });
  const referrer = document.getElementById('referrer');
  if (referrer) referrer.value = document.referrer || 'direct';
  const stamp = document.getElementById('submission_timestamp');
  if (stamp) stamp.value = new Date().toISOString();

  const fileInput = document.getElementById('statement_files');
  const statementFlag = document.getElementById('statement_uploaded');
  if (fileInput && statementFlag) {
    fileInput.addEventListener('change', () => {
      statementFlag.value = fileInput.files && fileInput.files.length ? 'yes' : 'no';
    });
  }

  document.querySelectorAll('a[href="#eligibility-form"]').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.dataLayer) {
        window.dataLayer.push({ event: 'freewebsite_cta_click', cta_text: link.textContent.trim() });
      }
      if (window.fbq) {
        window.fbq('trackCustom', 'FreeWebsiteCTA', { cta_text: link.textContent.trim() });
      }
    });
  });

  const form = document.querySelector('form[name="freewebsite-eligibility"]');
  if (form) {
    let started = false;
    form.addEventListener('focusin', () => {
      if (started) return;
      started = true;
      if (window.dataLayer) window.dataLayer.push({ event: 'freewebsite_form_start' });
      if (window.fbq) window.fbq('trackCustom', 'FreeWebsiteFormStart');
    });

    form.addEventListener('submit', () => {
      if (window.dataLayer) {
        window.dataLayer.push({
          event: 'freewebsite_form_submit',
          statement_uploaded: statementFlag ? statementFlag.value : 'no',
          processing_volume: document.getElementById('processing_volume')?.value || ''
        });
      }
      if (window.fbq) {
        window.fbq('track', 'Lead');
      }
    });
  }
})();
