(() => {
  const form = document.getElementById('expressIntakeForm');
  if (!form) return;

  const STORAGE_KEY = 'evExpressIntakeV1';
  const LEAD_ID_KEY = 'evExpressLeadIdV1';
  const LEAD_FINGERPRINT_KEY = 'evExpressLeadFingerprintV1';
  const stepPanels = [...document.querySelectorAll('.ex-step-panel')];
  const navSteps = [...document.querySelectorAll('.ex-step-tab')];
  const progressBar = document.getElementById('progressBar');
  const eyebrow = document.getElementById('stepEyebrow');
  const stepTitle = document.getElementById('stepTitle');
  const stepDescription = document.getElementById('stepDescription');
  const backBtn = document.getElementById('backBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');
  const saveExitBtn = document.getElementById('saveExitBtn');
  const saveStatus = document.getElementById('saveStatus');
  const pageChoices = document.getElementById('pageChoices');
  const pageCount = document.getElementById('pageCount');
  const pageAddOnNote = document.getElementById('pageAddOnNote');
  const pageRecommendationTitle = document.getElementById('pageRecommendationTitle');
  const pageRecommendationCopy = document.getElementById('pageRecommendationCopy');
  const reviewGrid = document.getElementById('reviewGrid');
  const pagesSelectedField = document.getElementById('pages_selected');
  const capabilitiesSelectedField = document.getElementById('capabilities_selected');
  const intakeJsonField = document.getElementById('intake_json');
  const reviewSummaryField = document.getElementById('review_summary');
  const buildBriefField = document.getElementById('eagle_vision_build_brief');
  const submitStatus = document.getElementById('submitStatus');
  const addMediaBtn = document.getElementById('addMediaBtn');

  let currentStep = 1;
  let saveTimer;
  let leadCaptureTimer;

  const stepCopy = {
    1: ['STEP 1 OF 5', 'Quick Start', 'Just the basics we need to save your project and contact you if you do not finish the full intake.'],
    2: ['STEP 2 OF 5', 'Business + Goals', 'Now tell us a little more about the business and what the website or app should help people do.'],
    3: ['STEP 3 OF 5', 'Brand + Story', 'Give us enough direction to make it feel like your business, not everyone else.'],
    4: ['STEP 4 OF 5', 'People + Pages', 'Add priority media, confirm your page structure and finish any app setup preferences.'],
    5: ['STEP 5 OF 5', 'Review + Submit', 'Confirm what we understand before Eagle Vision reviews the project for Express scope.']
  };

  const pageBlueprints = {
    local_service: {
      label: 'Local Service Business',
      recommended: ['home','services','about','reviews_projects','contact_quote'],
      options: [
        ['home','Home'],['services','Services'],['about','About'],['reviews_projects','Reviews / Projects'],['contact_quote','Contact / Request a Quote'],
        ['service_areas','Service Areas'],['service_details','Individual Service Details'],['faq','FAQ'],['team','Team'],['specials','Specials'],['maintenance_plans','Maintenance Plans'],['careers','Careers']
      ]
    },
    church_ministry: {
      label: 'Church / Ministry',
      recommended: ['home','new_here','about_leadership_beliefs','watch_messages','connect_events'],
      options: [
        ['home','Home'],['new_here','New Here / Plan Your Visit'],['about_leadership_beliefs','About / Leadership / Beliefs'],['watch_messages','Watch / Messages'],['connect_events','Connect / Events'],
        ['give_partner','Give / Partner'],['kids_youth_ministries','Kids / Youth / Ministries'],['small_groups','Small Groups'],['prayer_care','Prayer / Care'],['outreach_missions','Outreach / Missions'],['courses','Courses'],['resources','Resources']
      ]
    },
    restaurant: {
      label: 'Restaurant',
      recommended: ['home','menu','order_online','our_story','visit_contact'],
      options: [
        ['home','Home'],['menu','Menu'],['order_online','Order Online'],['our_story','Our Story'],['visit_contact','Visit / Hours / Contact'],
        ['catering_private_events','Catering / Private Events'],['reservations','Reservations'],['specials_events','Specials / Events'],['gallery','Gallery'],['careers','Careers']
      ]
    },
    generic: {
      label: 'Business / Organization',
      recommended: ['home','services','about','reviews_projects','contact_quote'],
      options: [
        ['home','Home'],['services','Services / Offerings'],['about','About'],['reviews_projects','Reviews / Results'],['contact_quote','Contact'],
        ['faq','FAQ'],['team','Team'],['gallery','Gallery'],['resources','Resources'],['careers','Careers']
      ]
    }
  };

  const $ = (id) => document.getElementById(id);
  const val = (id) => ($(id)?.value || '').trim();
  const checkedValue = (name) => form.querySelector(`[name="${name}"]:checked`)?.value || '';
  const checkedValues = (selector) => [...form.querySelectorAll(selector)].filter(el => el.checked).map(el => el.value);
  const lines = (text) => (text || '').split(/\n+/).map(s => s.trim()).filter(Boolean);
  const csv = (text) => (text || '').split(/[,\n]+/).map(s => s.trim()).filter(Boolean);
  const normalizeUrl = (value) => {
    const text = String(value || '').trim();
    if (!text) return null;
    if (/^https?:\/\//i.test(text)) return text;
    if (/^www\./i.test(text)) return `https://${text}`;
    return null;
  };
  const visible = (el) => !!(el && el.offsetParent !== null);
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, ch => {
    if (ch === '&') return '&amp;';
    if (ch === '<') return '&lt;';
    if (ch === '>') return '&gt;';
    if (ch === '"') return '&quot;';
    return '&#039;';
  });

  function getLeadCaptureId() {
    let id = val('lead_capture_id');
    if (id) return id;
    try { id = localStorage.getItem(LEAD_ID_KEY) || ''; } catch (_) {}
    if (!id) {
      id = (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function')
        ? globalThis.crypto.randomUUID()
        : `evlead-${Date.now()}-${Math.random().toString(36).slice(2,10)}`;
      try { localStorage.setItem(LEAD_ID_KEY, id); } catch (_) {}
    }
    if ($('lead_capture_id')) $('lead_capture_id').value = id;
    return id;
  }

  function leadPayload() {
    return {
      'form-name': 'express-lead-capture',
      subject: 'New Eagle Vision Express Lead',
      email: val('contact_email'),
      lead_capture_id: getLeadCaptureId(),
      lead_stage: 'step_1_basics',
      lead_captured_at: new Date().toISOString(),
      package_product: productValue(),
      business_name: val('business_name'),
      contact_first: val('contact_first'),
      contact_last: val('contact_last'),
      contact_role: val('contact_role'),
      contact_phone: val('contact_phone'),
      contact_email: val('contact_email'),
      business_city: val('business_city'),
      business_region: val('business_region'),
      business_country: val('business_country'),
      industry: industryValue(),
      industry_other: val('industry_other'),
      source: val('source') || 'self_service',
      utm_source: val('utm_source'),
      utm_medium: val('utm_medium'),
      utm_campaign: val('utm_campaign'),
      utm_content: val('utm_content'),
      referrer: val('referrer')
    };
  }

  function leadReady() {
    const email = $('contact_email');
    return Boolean(
      productValue() &&
      val('business_name') &&
      val('contact_first') &&
      val('contact_last') &&
      val('contact_role') &&
      val('contact_phone') &&
      val('contact_email') &&
      (!email || email.checkValidity()) &&
      val('business_city') &&
      val('business_region') &&
      val('business_country') &&
      industryValue() &&
      (industryValue() !== 'other' || val('industry_other'))
    );
  }

  function leadFingerprint(payload) {
    const copy = { ...payload };
    delete copy.lead_captured_at;
    return JSON.stringify(copy);
  }

  function setLeadCaptureState(saved) {
    const note = $('leadCaptureNote');
    if (!note) return;
    note.classList.toggle('saved', saved);
    const strong = note.querySelector('strong');
    const small = note.querySelector('small');
    if (saved) {
      if (strong) strong.textContent = 'Project basics saved with Eagle Vision.';
      if (small) small.textContent = 'You can continue the full intake now, or return later and finish from this device.';
    } else {
      if (strong) strong.textContent = 'Your project basics are saved as a lead once this section is complete.';
      if (small) small.textContent = 'If you do not finish the full intake today, Eagle Vision can still follow up about the website or app you started.';
    }
  }

  async function captureLead(force = false) {
    if (!leadReady()) return false;
    const payload = leadPayload();
    const fingerprint = leadFingerprint(payload);
    let lastFingerprint = '';
    try { lastFingerprint = localStorage.getItem(LEAD_FINGERPRINT_KEY) || ''; } catch (_) {}
    if (!force && fingerprint === lastFingerprint) {
      setLeadCaptureState(true);
      return true;
    }

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: new URLSearchParams(payload).toString()
      });
      if (!response.ok) throw new Error(`Lead capture failed with status ${response.status}`);
      try {
        localStorage.setItem(LEAD_FINGERPRINT_KEY, fingerprint);
        localStorage.setItem(LEAD_ID_KEY, payload.lead_capture_id);
      } catch (_) {}
      setLeadCaptureState(true);
      saveStatus.textContent = 'Project basics saved with Eagle Vision';
      return true;
    } catch (_) {
      saveStatus.textContent = 'Draft saved on this device';
      return false;
    }
  }

  function queueLeadCapture() {
    clearTimeout(leadCaptureTimer);
    if (currentStep !== 1 || !leadReady()) {
      setLeadCaptureState(false);
      return;
    }
    leadCaptureTimer = setTimeout(() => { captureLead(false); }, 900);
  }

  function setConditional(id, show) {
    const el = $(id);
    if (!el) return;
    el.classList.toggle('show', !!show);
  }

  function productValue() {
    return checkedValue('package_product');
  }

  function hasWebsite() {
    const p = productValue();
    return p === 'website' || p === 'website_app';
  }

  function hasApp() {
    const p = productValue();
    return p === 'app' || p === 'website_app';
  }

  function industryValue() {
    return val('industry');
  }

  function syncConditionals() {
    const industry = industryValue();
    setConditional('industryOtherWrap', industry === 'other');
    if ($('industry_other')) $('industry_other').required = industry === 'other';
    setConditional('localServiceQuestions', industry === 'local_service');
    setConditional('churchQuestions', industry === 'church_ministry');
    setConditional('restaurantQuestions', industry === 'restaurant');
    setConditional('beliefsWrap', industry === 'church_ministry');

    setConditional('appNeedsSection', hasApp());
    setConditional('appSetupSection', hasApp());
    setConditional('websitePagesSection', hasWebsite());

    setConditional('primaryOtherWrap', checkedValue('primary_action') === 'other');
    setConditional('orderingProviderWrap', val('has_online_ordering') === 'yes');
    setConditional('posProviderWrap', val('has_pos') === 'yes');
    setConditional('keepPosWrap', val('has_pos') === 'yes');
    setConditional('accessGroupsWrap', hasApp() && val('app_requires_login') === 'yes');

    const publicContactDifferent = val('public_contact_same') === 'no';
    setConditional('publicContactFields', publicContactDifferent);
    if ($('public_phone')) $('public_phone').required = publicContactDifferent;
    if ($('public_email')) $('public_email').required = publicContactDifferent;

    if (hasApp()) {
      const action = checkedValue('primary_action');
      if (action === 'order') $('capOrdering').checked = true;
      if (action === 'book') $('capBooking').checked = true;
      if (action === 'donate') $('capGiving').checked = true;
    }

    updateCapabilities();
  }

  function defaultPrimaryActionForIndustry() {
    if (checkedValue('primary_action')) return;
    const map = { local_service: 'request_quote', church_ministry: 'visit', restaurant: 'order' };
    const target = map[industryValue()];
    if (!target) return;
    const el = form.querySelector(`[name="primary_action"][value="${target}"]`);
    if (el) el.checked = true;
  }

  function getBlueprint() {
    return pageBlueprints[industryValue()] || pageBlueprints.generic;
  }

  function renderPages(preserve = false) {
    if (!pageChoices) return;
    const blueprint = getBlueprint();
    const existing = preserve ? checkedValues('#pageChoices input[type="checkbox"]') : [];
    const selected = existing.length ? existing : blueprint.recommended;
    pageRecommendationTitle.textContent = `Recommended 5 for ${blueprint.label}`;
    pageRecommendationCopy.textContent = 'The five recommended pages are preselected. Swap them if another page better fits your business.';
    pageChoices.innerHTML = blueprint.options.map(([id,label]) => {
      const isRecommended = blueprint.recommended.includes(id);
      const isChecked = selected.includes(id) ? ' checked' : '';
      return `<div class="ex-page-option"><input type="checkbox" id="page_${id}" value="${id}"${isChecked}><label for="page_${id}"><b>${label}</b><span>${isRecommended ? 'Recommended' : 'Optional'}</span></label></div>`;
    }).join('');
    pageChoices.querySelectorAll('input').forEach(input => input.addEventListener('change', () => {
      updatePageCount();
      queueSave();
    }));
    updatePageCount();
  }

  function applySavedPageSelection(savedValue) {
    if (!savedValue || !pageChoices) return;
    const ids = savedValue.split(',').map(v => v.trim()).filter(Boolean);
    if (!ids.length) return;
    pageChoices.querySelectorAll('input[type=\"checkbox\"]').forEach(input => { input.checked = ids.includes(input.value); });
    updatePageCount();
  }

  function updatePageCount() {
    if (!hasWebsite()) {
      pagesSelectedField.value = '';
      return;
    }
    const selected = checkedValues('#pageChoices input[type="checkbox"]');
    pagesSelectedField.value = selected.join(', ');
    pageCount.textContent = selected.length;
    if (selected.length === 5) {
      pageAddOnNote.textContent = 'Perfect. This matches the standard five-page Express starting scope.';
    } else if (selected.length < 5) {
      pageAddOnNote.textContent = 'You can select up to five standard marketing pages.';
    } else {
      pageAddOnNote.textContent = `${selected.length - 5} additional page${selected.length - 5 === 1 ? '' : 's'} may be treated as an add-on.`;
    }
  }

  function updateCapabilities() {
    const selected = hasApp() ? checkedValues('#capabilityChoices input[type="checkbox"]') : [];
    capabilitiesSelectedField.value = selected.join(', ');
  }

  function enforceDescriptorLimit(changed) {
    const boxes = [...document.querySelectorAll('#visualDescriptors input[type="checkbox"]')];
    const selected = boxes.filter(b => b.checked);
    if (selected.length > 3 && changed) changed.checked = false;
    const now = boxes.filter(b => b.checked);
    boxes.forEach(b => {
      b.disabled = now.length >= 3 && !b.checked;
      b.closest('.ex-pill')?.classList.toggle('is-disabled', b.disabled);
    });
    $('descriptorHelp').textContent = now.length >= 3 ? '3 selected. Uncheck one to choose another.' : `${now.length}/3 selected.`;
  }

  function revealMediaRows() {
    const rows = [...document.querySelectorAll('[data-media-row]')];
    const hidden = rows.find(row => row.classList.contains('hidden'));
    if (hidden) hidden.classList.remove('hidden');
    if (!rows.some(row => row.classList.contains('hidden'))) addMediaBtn.style.display = 'none';
    queueSave();
  }

  function ensureMediaRowsFromSaved() {
    [...document.querySelectorAll('[data-media-row]')].forEach(row => {
      const n = row.dataset.mediaRow;
      if (val(`media_label_${n}`) || val(`media_subject_${n}`) || val(`media_placement_${n}`) !== 'anywhere') row.classList.remove('hidden');
    });
    if (![...document.querySelectorAll('[data-media-row]')].some(row => row.classList.contains('hidden'))) addMediaBtn.style.display = 'none';
  }

  function validateStep(step) {
    const panel = stepPanels.find(p => Number(p.dataset.step) === step);
    if (!panel) return true;
    const required = [...panel.querySelectorAll('[required]')].filter(visible);
    for (const field of required) {
      if (!field.checkValidity()) {
        field.reportValidity();
        field.closest('.ex-field')?.classList.add('invalid');
        return false;
      }
      field.closest('.ex-field')?.classList.remove('invalid');
    }
    if (step === 4 && hasWebsite()) {
      const selected = checkedValues('#pageChoices input[type="checkbox"]');
      if (!selected.length) {
        pageRecommendationCopy.textContent = 'Please select at least one website page before continuing.';
        pageRecommendationCopy.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return false;
      }
    }
    return true;
  }

  function fieldIsApplicable(field) {
    let node = field.parentElement;
    while (node && node !== form) {
      if ((node.classList?.contains('ex-conditional') || node.classList?.contains('ex-conditional-grid')) && !node.classList.contains('show')) {
        return false;
      }
      node = node.parentElement;
    }
    return true;
  }

  function validateAllSteps() {
    for (let step = 1; step <= 5; step += 1) {
      const panel = stepPanels.find(p => Number(p.dataset.step) === step);
      if (!panel) continue;
      const fields = [...panel.querySelectorAll('[required]')].filter(fieldIsApplicable);
      for (const field of fields) {
        if (!field.checkValidity()) {
          showStep(step);
          window.setTimeout(() => {
            field.closest('.ex-field')?.classList.add('invalid');
            field.reportValidity();
            field.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 80);
          submitStatus.textContent = `Please complete the required information in Step ${step} before submitting.`;
          submitStatus.classList.add('show');
          return false;
        }
      }
    }
    return true;
  }

  function showStep(step) {
    currentStep = Math.max(1, Math.min(5, step));
    stepPanels.forEach(panel => panel.classList.toggle('active', Number(panel.dataset.step) === currentStep));
    navSteps.forEach(tab => {
      const n = Number(tab.dataset.navStep);
      tab.classList.toggle('active', n === currentStep);
      tab.classList.toggle('done', n < currentStep);
    });
    progressBar.style.width = `${currentStep * 20}%`;
    const copy = stepCopy[currentStep];
    eyebrow.textContent = copy[0];
    stepTitle.textContent = copy[1];
    stepDescription.textContent = copy[2];

    backBtn.classList.toggle('ex-btn-hidden', currentStep === 1);
    nextBtn.style.display = currentStep === 5 ? 'none' : '';
    submitBtn.style.display = currentStep === 5 ? '' : 'none';

    if (currentStep === 2) {
      defaultPrimaryActionForIndustry();
      syncConditionals();
    }
    if (currentStep === 4) {
      syncConditionals();
      updatePageCount();
    }
    if (currentStep === 5) buildReview();

    window.scrollTo({ top: 0, behavior: 'smooth' });
    queueSave();
  }

  function serializeDraft() {
    const data = {};
    [...form.elements].forEach(el => {
      if (!el.name || el.type === 'file' || el.name === 'bot-field' || el.name.startsWith('confirm_') || el.name === 'intake_json' || el.name === 'review_summary') return;
      if (el.type === 'radio') {
        if (el.checked) data[el.name] = el.value;
      } else if (el.type === 'checkbox') {
        if (!Array.isArray(data[el.name])) data[el.name] = [];
        if (el.checked) data[el.name].push(el.value || 'on');
      } else {
        data[el.name] = el.value;
      }
    });
    data.__step = currentStep;
    data.__industry = industryValue();
    return data;
  }

  function saveDraft() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializeDraft()));
      saveStatus.textContent = 'Draft saved on this device';
    } catch (_) {
      saveStatus.textContent = 'Draft saving is unavailable in this browser';
    }
  }

  function queueSave() {
    clearTimeout(saveTimer);
    saveStatus.textContent = 'Saving draft...';
    saveTimer = setTimeout(saveDraft, 350);
  }

  function restoreDraft() {
    let data;
    try { data = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch (_) { data = null; }
    if (!data) return;

    Object.entries(data).forEach(([name,value]) => {
      if (name.startsWith('__')) return;
      const els = [...form.querySelectorAll(`[name="${CSS.escape(name)}"]`)];
      if (!els.length) return;
      els.forEach(el => {
        if (el.type === 'radio') el.checked = el.value === value;
        else if (el.type === 'checkbox') el.checked = Array.isArray(value) && value.includes(el.value || 'on');
        else el.value = value ?? '';
      });
    });
    currentStep = Number(data.__step || 1);
  }

  function applyQueryParams() {
    const params = new URLSearchParams(location.search);
    const pkg = params.get('package');
    if (['website','website_app','app'].includes(pkg)) {
      const el = form.querySelector(`[name="package_product"][value="${pkg}"]`);
      if (el) el.checked = true;
    }
    const source = params.get('source');
    if (source) $('source').value = source;

    ['utm_source','utm_medium','utm_campaign','utm_content'].forEach(key => {
      const v = params.get(key);
      if (v) $(key).value = v;
    });
    $('referrer').value = document.referrer || $('referrer').value || '';
  }

  function parsePeople() {
    return lines(val('people_notes')).map(line => {
      const parts = line.split('|').map(x => x.trim());
      return {
        name: parts[0] || '',
        role: parts[1] || '',
        bioOrBullets: parts.slice(2).join(' | ') || null,
        publicEmail: null,
        publicPhone: null,
        mediaAssetId: null,
        contentHandlingOverride: 'inherit'
      };
    }).filter(p => p.name);
  }

  function fileDescriptor(inputId, category) {
    const input = $(inputId);
    if (!input || !input.files || !input.files.length) return [];
    return [...input.files].map(file => ({
      category,
      fileName: file.name,
      mimeType: file.type || null,
      sizeBytes: Number.isFinite(file.size) ? file.size : null
    }));
  }

  function sourceMaterialFiles() {
    return [
      ...fileDescriptor('source_file_1', 'source_material'),
      ...fileDescriptor('source_file_2', 'source_material'),
      ...fileDescriptor('source_file_3', 'source_material'),
      ...fileDescriptor('logo_upload', 'logo'),
      ...fileDescriptor('brand_guide_upload', 'brand_guide_or_alternate_logo')
    ];
  }

  function mediaMetadata() {
    const out = [];
    [...document.querySelectorAll('[data-media-row]')].forEach(row => {
      const n = row.dataset.mediaRow;
      const file = $(`media_file_${n}`)?.files?.[0];
      const subject = val(`media_subject_${n}`);
      const label = val(`media_label_${n}`);
      if (!file && !subject && !label) return;
      out.push({
        assetId: `media_${n}`,
        kind: 'photo',
        label: label || 'other',
        subject: subject || null,
        caption: null,
        placement: val(`media_placement_${n}`) || 'anywhere',
        specificService: null,
        rightsConfirmed: $('confirm_rights')?.checked || false,
        sourceUrl: null,
        uploadToken: file?.name || null
      });
    });
    return out;
  }

  function capabilityObjects() {
    const selected = hasApp() ? checkedValues('#capabilityChoices input[type="checkbox"]') : [];
    return selected.map(id => ({ capabilityId: id, needed: true, priority: 'must_have', notes: null }));
  }

  function normalizedRestaurantNeeds() {
    const raw = csv(val('restaurant_needs')).map(v => v.toLowerCase());
    const out = [];
    const add = (v) => { if (!out.includes(v)) out.push(v); };
    raw.forEach(item => {
      if (item.includes('order')) add('online_ordering');
      else if (item.includes('menu')) add('menu');
      else if (item.includes('payment')) add('payments');
      else if (item.includes('loyal') || item.includes('reward')) add('loyalty');
      else if (item.includes('reserv')) add('reservations');
      else if (item.includes('customer') || item.includes('crm')) add('customer_data');
      else if (item.includes('deliver')) add('delivery');
      else add('other');
    });
    return out;
  }

  function integrationsData() {
    const list = [];
    if (industryValue() === 'restaurant') {
      if (val('pos_provider')) list.push({ category:'pos', provider:val('pos_provider'), keepExisting:val('keep_existing_pos') !== 'no', integrationNeeds:normalizedRestaurantNeeds(), publicUrl:null, notes:null });
      if (val('ordering_provider')) list.push({ category:'ordering', provider:val('ordering_provider'), keepExisting:true, integrationNeeds:['online_ordering'], publicUrl:null, notes:null });
    }
    if (industryValue() === 'church_ministry' && val('giving_url')) {
      list.push({ category:'giving', provider:'Existing giving provider', keepExisting:true, integrationNeeds:['link_or_embed'], publicUrl:val('giving_url'), notes:null });
    }
    return list;
  }

  function proofPoints() {
    return lines(val('proof_points')).map(claim => ({ claim, category:'other', verified:$('confirm_accuracy')?.checked || false, sourceNote:'Client supplied in Express intake' }));
  }

  function industryData() {
    const industry = industryValue();
    return {
      localService: industry === 'local_service' ? {
        emergencyService: val('emergency_service') === 'yes' ? true : val('emergency_service') === 'no' ? false : null,
        freeEstimates: val('free_estimates') === 'yes' ? true : val('free_estimates') === 'no' ? false : null,
        financingAvailable: val('financing_available') === 'yes' ? true : val('financing_available') === 'no' ? false : null,
        licensesOrCredentials: csv(val('licenses_credentials')),
        serviceAreaStrategy: val('service_areas') ? 'named_areas' : 'not_applicable'
      } : null,
      churchMinistry: industry === 'church_ministry' ? {
        serviceTimes: lines(val('service_times')),
        pastorOrLeader: val('pastor_leader') || null,
        beliefsText: val('beliefs_text') || null,
        ministries: csv(val('ministries')),
        givingUrl: val('giving_url') || null,
        mediaFeedUrls: [],
        planVisitNeeds: ['service_times','directions','visitor_information']
      } : null,
      restaurant: industry === 'restaurant' ? {
        cuisine: val('cuisine') || null,
        hasOnlineOrdering: val('has_online_ordering') === 'yes' ? true : val('has_online_ordering') === 'no' ? false : null,
        orderingProvider: val('ordering_provider') || null,
        hasPos: val('has_pos') === 'yes' ? true : val('has_pos') === 'no' ? false : null,
        posProvider: val('pos_provider') || null,
        keepExistingPos: val('keep_existing_pos') === 'yes' ? true : val('keep_existing_pos') === 'no' ? false : null,
        needsNewPosRecommendation: val('has_pos') === 'no',
        reservationProvider: null,
        menuSource: val('menu_source') || 'unknown',
        orderingIntegrationNeeds: normalizedRestaurantNeeds()
      } : null
    };
  }

  function buildIntakeData() {
    const product = productValue();
    const selectedPages = hasWebsite() ? checkedValues('#pageChoices input[type="checkbox"]') : [];
    const extras = selectedPages.length > 5 ? selectedPages.slice(5) : [];
    const contentHandling = checkedValue('content_handling') || 'professional_rewrite';
    const descriptors = checkedValues('#visualDescriptors input[type="checkbox"]');

    return {
      schemaVersion: '1.0.0',
      submission: {
        submissionId: `EV-${Date.now()}`,
        leadCaptureId: getLeadCaptureId(),
        status: 'client_confirmed',
        source: val('source') || 'self_service',
        utm: {
          source: val('utm_source') || null,
          medium: val('utm_medium') || null,
          campaign: val('utm_campaign') || null,
          content: val('utm_content') || null,
          referrer: val('referrer') || null
        },
        startedAt: null,
        clientConfirmedAt: new Date().toISOString(),
        acceptedForBuildAt: null
      },
      package: {
        product,
        websiteTier: hasWebsite() ? 'express_standard' : 'not_applicable',
        appTier: hasApp() ? 'express_standard' : 'not_applicable',
        salesProgram: 'standard',
        requestedLaunchDate: null
      },
      business: {
        legalOrPublicName: val('business_name'),
        industry: industryValue(),
        industryOther: val('industry_other') || null,
        oneLineDescription: val('one_line_description') || null,
        primaryContact: {
          firstName: val('contact_first'),
          lastName: val('contact_last'),
          role: val('contact_role') || null,
          email: val('contact_email'),
          phone: val('contact_phone')
        },
        publicContact: {
          useLeadContact: val('public_contact_same') === 'yes',
          email: val('public_contact_same') === 'yes' ? val('contact_email') : (val('public_email') || null),
          phone: val('public_contact_same') === 'yes' ? val('contact_phone') : (val('public_phone') || null)
        },
        currentWebsiteUrl: val('current_website') || null,
        currentApp: null,
        locations: [{
          name: 'Primary Location',
          street: val('public_street') || null,
          city: val('business_city'),
          region: val('business_region'),
          postalCode: null,
          country: val('business_country') || 'US',
          public: true,
          phone: val('public_contact_same') === 'yes' ? val('contact_phone') : (val('public_phone') || null),
          email: val('public_contact_same') === 'yes' ? val('contact_email') : (val('public_email') || null),
          hours: val('public_hours') || null
        }],
        serviceAreas: csv(val('service_areas')),
        socialLinks: lines(val('social_links')).map(normalizeUrl).filter(Boolean)
      },
      goals: {
        primaryAction: checkedValue('primary_action') || 'contact',
        primaryActionOther: val('primary_action_other') || null,
        secondaryActions: [],
        targetAudience: val('target_audience') || null,
        customerProblem: val('customer_problem') || null,
        differentiators: lines(val('differentiators')),
        proudOf: null,
        approvedProofPoints: proofPoints()
      },
      offerings: lines(val('top_offerings')).map((name,i) => ({
        id: `offering_${i+1}`,
        name,
        descriptionOrNotes: null,
        featured: i < 3,
        publicPrice: null,
        cta: null,
        contentHandlingOverride: 'inherit'
      })),
      brand: {
        visualDescriptors: descriptors.length ? descriptors : ['professional'],
        colorStrategy: checkedValue('color_strategy') || 'eagle_vision_recommends',
        appearancePreference: val('appearance_preference') || 'eagle_vision_chooses',
        existingColors: csv(val('existing_colors')),
        inspirationUrls: csv(val('inspiration_urls')).map(normalizeUrl).filter(Boolean),
        designDirection: val('design_direction') || 'eagle_vision_selects'
      },
      contentPolicy: {
        defaultHandling: contentHandling,
        about: 'inherit',
        mission: 'inherit',
        bios: 'inherit',
        beliefs: industryValue() === 'church_ministry' ? (val('beliefs_handling') || 'exact') : 'not_applicable',
        testimonials: 'exact',
        legalDisclaimers: 'exact',
        aboutNotes: val('about_notes') || null,
        missionNotes: val('mission_notes') || null,
        historyNotes: val('history_notes') || null
      },
      people: parsePeople(),
      pages: {
        selectionMode: 'customize',
        selected: selectedPages,
        additionalPaidPages: extras,
        utilityPages: hasWebsite() ? ['privacy','thank_you'] : []
      },
      capabilities: capabilityObjects(),
      integrations: integrationsData(),
      sourceMaterials: sourceMaterialFiles(),
      media: mediaMetadata(),
      industryData: industryData(),
      app: hasApp() ? {
        experiencePreference: val('app_experience') || 'eagle_vision_chooses',
        requiresLogin: val('app_requires_login') === 'yes',
        accessGroups: csv(val('app_access_groups')),
        developerAccountPreference: val('developer_account') || 'eagle_vision_guidance_needed',
        existingAppleAccount: null,
        existingGoogleAccount: null,
        bundleIdPreference: null
      } : null,
      information: [],
      permissions: {
        contentRightsConfirmed: $('confirm_rights')?.checked || false,
        testimonialRightsConfirmed: $('confirm_rights')?.checked || false,
        contactPermission: true,
        legalAuthorityToApprove: $('confirm_authority')?.checked || false
      },
      review: {
        clientSummaryConfirmed: currentStep === 5,
        clientConfirmedVersion: 'intake-v1',
        daveApprovedVersion: null,
        finalApprovedVersion: null
      }
    };
  }

  function titleCaseToken(value) {
    return String(value || '')
      .replaceAll('_', ' ')
      .replace(/\b\w/g, ch => ch.toUpperCase());
  }

  function briefValue(value, fallback = 'Not supplied') {
    if (value === null || value === undefined) return fallback;
    if (Array.isArray(value)) return value.length ? value.join(', ') : fallback;
    const text = String(value).trim();
    return text || fallback;
  }

  function bulletLines(items, fallback = '- Not supplied') {
    if (!items || !items.length) return fallback;
    return items.map(item => `- ${item}`).join('\n');
  }

  function buildIndustryBrief(data) {
    const industry = data.business.industry;
    if (industry === 'local_service' && data.industryData.localService) {
      const d = data.industryData.localService;
      return [
        `- Service areas: ${briefValue(data.business.serviceAreas)}`,
        `- Emergency / same-day service: ${d.emergencyService === null ? 'Not supplied' : d.emergencyService ? 'Yes' : 'No'}`,
        `- Free estimates: ${d.freeEstimates === null ? 'Not supplied' : d.freeEstimates ? 'Yes' : 'No'}`,
        `- Financing available: ${d.financingAvailable === null ? 'Not supplied' : d.financingAvailable ? 'Yes' : 'No'}`,
        `- Licenses / credentials supplied: ${briefValue(d.licensesOrCredentials)}`
      ].join('\n');
    }
    if (industry === 'church_ministry' && data.industryData.churchMinistry) {
      const d = data.industryData.churchMinistry;
      return [
        `- Service / gathering times: ${briefValue(d.serviceTimes)}`,
        `- Lead pastor / leader: ${briefValue(d.pastorOrLeader)}`,
        `- Ministries: ${briefValue(d.ministries)}`,
        `- Giving URL: ${briefValue(d.givingUrl)}`,
        `- Beliefs supplied: ${d.beliefsText ? 'Yes - preserve according to the content handling rule below' : 'No'}`
      ].join('\n');
    }
    if (industry === 'restaurant' && data.industryData.restaurant) {
      const d = data.industryData.restaurant;
      return [
        `- Cuisine / concept: ${briefValue(d.cuisine)}`,
        `- Existing online ordering: ${d.hasOnlineOrdering === null ? 'Not supplied' : d.hasOnlineOrdering ? 'Yes' : 'No'}`,
        `- Ordering provider: ${briefValue(d.orderingProvider)}`,
        `- Existing POS: ${d.hasPos === null ? 'Not supplied' : d.hasPos ? 'Yes' : 'No'}`,
        `- POS provider: ${briefValue(d.posProvider)}`,
        `- Keep existing POS: ${d.keepExistingPos === null ? 'Not supplied' : d.keepExistingPos ? 'Yes' : 'No'}`,
        `- Menu source: ${titleCaseToken(d.menuSource)}`,
        `- Integration needs: ${briefValue(d.orderingIntegrationNeeds.map(titleCaseToken))}`
      ].join('\n');
    }
    return '- No additional industry-specific answers were required for this intake.';
  }

  function buildAssetBrief(data) {
    const sourceFiles = data.sourceMaterials || [];
    const labeledMedia = data.media || [];
    const sourceBlock = sourceFiles.length
      ? sourceFiles.map(file => `- ${titleCaseToken(file.category)}: ${file.fileName}`).join('\n')
      : '- No source documents, logo files, or brand guide files were uploaded in the intake.';
    const mediaBlock = labeledMedia.length
      ? labeledMedia.map(asset => `- ${titleCaseToken(asset.label)}: ${briefValue(asset.subject, asset.uploadToken || 'Image')} | placement: ${titleCaseToken(asset.placement)} | file: ${briefValue(asset.uploadToken)}`).join('\n')
      : '- No labeled project photos were uploaded in the intake.';
    return `SOURCE / BRAND FILES\n${sourceBlock}\n\nLABELED PHOTOS / MEDIA\n${mediaBlock}`;
  }

  function buildReviewFlags(data) {
    const flags = [];
    if (!data.business.oneLineDescription) flags.push('Business one-line description was not supplied.');
    if (!data.contentPolicy.aboutNotes && !data.business.currentWebsiteUrl && !(data.sourceMaterials || []).length) {
      flags.push('Limited source copy was supplied. Build from verified offerings, goals, and differentiators, and flag any factual gaps rather than inventing them.');
    }
    if (!(data.brand.visualDescriptors || []).length) flags.push('No visual descriptors selected. Eagle Vision should choose a premium direction.');
    if (data.goals.approvedProofPoints.some(point => !point.verified)) flags.push('One or more proof claims require confirmation before publication.');
    if (data.business.industry === 'church_ministry' && !data.industryData.churchMinistry?.beliefsText) flags.push('No beliefs / statement of faith text was supplied.');
    if (data.business.industry === 'restaurant' && data.industryData.restaurant?.hasOnlineOrdering && !data.industryData.restaurant?.orderingProvider) flags.push('Existing online ordering was indicated, but the provider was not supplied.');
    if (['restaurant','church_ministry'].includes(data.business.industry) && !data.business.locations?.[0]?.street) flags.push('No public street address / physical location was supplied. Confirm before publishing visit or directions content.');
    if (data.business.industry === 'restaurant' && !data.business.locations?.[0]?.hours) flags.push('Restaurant hours were not supplied. Confirm before publishing hours.');
    if (!data.business.publicContact?.phone && !data.business.publicContact?.email) flags.push('No public phone or email is available for the website. Confirm before publishing contact details.');
    return flags.length ? bulletLines(flags) : '- No obvious intake gaps requiring pre-build clarification.';
  }

  function buildChatReadyBrief(data) {
    const location = data.business.locations?.[0] || {};
    const pageLabels = (data.pages.selected || []).map(labelForPage);
    const offerings = (data.offerings || []).map(o => o.name);
    const proofPoints = (data.goals.approvedProofPoints || []).map(p => `${p.claim} [client supplied]`);
    const people = (data.people || []).map(p => `${p.name} | ${p.role}${p.bioOrBullets ? ` | ${p.bioOrBullets}` : ''}`);
    const capabilities = (data.capabilities || []).filter(c => c.needed).map(c => titleCaseToken(c.capabilityId));
    const integrations = (data.integrations || []).map(i => `${titleCaseToken(i.category)} | ${i.provider} | keep existing: ${i.keepExisting ? 'Yes' : 'No'} | needs: ${briefValue((i.integrationNeeds || []).map(titleCaseToken))}`);
    const extras = data.pages.additionalPaidPages || [];
    const contentMode = titleCaseToken(data.contentPolicy.defaultHandling);
    const app = data.app;

    return `# EAGLE VISION EXPRESS - PRODUCTION BUILD BRIEF
COPY THIS ENTIRE BUILD BRIEF INTO A NEW EAGLE VISION DIGITAL PROJECT CHAT WITH THE ASSOCIATED CLIENT ASSETS.
Brief version: EV-EXPRESS-BRIEF-1.0
Lead capture ID: ${briefValue(data.submission.leadCaptureId)}
Intake submission ID: ${briefValue(data.submission.submissionId)}

## BUILD INSTRUCTION
Use this brief as the authoritative client intake for this Eagle Vision Express project.

Create a high-end, professional, conversion-focused digital presence that looks custom-built for this client. Do not use a generic visual template. Reuse proven engineering where appropriate, but customize composition, hierarchy, messaging, imagery, page flow, calls to action, and brand presentation around the client.

For a website build:
- Build the complete first version to Eagle Vision quality standards.
- Use responsive, accessible, performance-conscious production code.
- Include foundational on-page SEO, page titles, descriptions, semantic structure, social metadata, and appropriate structured data.
- Use the selected page plan below.
- Make the primary conversion action obvious throughout the experience.
- Do not invent factual claims, credentials, years, awards, guarantees, pricing, beliefs, ratings, medical claims, or other facts.
- If a factual detail is missing, flag it for review rather than making it up.
- Use short hyphens only. Do not use em dashes or en dashes.
- Run basic QA for mobile, tablet, desktop, links, images, forms, overflow, readability, accessibility, metadata, and obvious content inconsistencies.
- Production workflow target: GitHub + Netlify.
- Push the build to the appropriate Eagle Vision GitHub repository / branch and create a Netlify review deployment.
- Dave / Eagle Vision reviews first. Do not treat the site as client-approved or production-launched until Eagle Vision approval and then client approval are recorded.

For an app component:
- Treat the client need as the requirement and choose only certified / approved implementation paths.
- Do not assume unverified Appy Pie capabilities.
- Keep app-store approval timing separate from app build timing.

## PROJECT
- Product: ${packageLabel(data.package.product)}
- Express website tier: ${titleCaseToken(data.package.websiteTier)}
- Express app tier: ${titleCaseToken(data.package.appTier)}
- Industry: ${industryLabel(data.business.industry)}
- Industry detail: ${briefValue(data.business.industryOther)}
- Public business / organization name: ${briefValue(data.business.legalOrPublicName)}
- One-line business description: ${briefValue(data.business.oneLineDescription)}
- Current website: ${briefValue(data.business.currentWebsiteUrl)}

## PRIMARY CONTACT
- Name: ${briefValue(`${data.business.primaryContact.firstName} ${data.business.primaryContact.lastName}`)}
- Role: ${briefValue(data.business.primaryContact.role)}
- Email: ${briefValue(data.business.primaryContact.email)}
- Phone: ${briefValue(data.business.primaryContact.phone)}

## PUBLIC CONTACT / LOCATION
- Use Step 1 contact publicly: ${data.business.publicContact?.useLeadContact ? 'Yes' : 'No'}
- Public phone: ${briefValue(data.business.publicContact?.phone)}
- Public email: ${briefValue(data.business.publicContact?.email)}
- Street / public location: ${briefValue(location.street)}
- City: ${briefValue(location.city)}
- State / Province: ${briefValue(location.region)}
- Country: ${briefValue(location.country)}
- Business / office hours: ${briefValue(location.hours)}
- Service areas: ${briefValue(data.business.serviceAreas)}
- Social links: ${briefValue(data.business.socialLinks)}

## PRIMARY BUSINESS GOAL
- Primary CTA: ${actionLabel(data.goals.primaryAction)}
- Primary CTA detail: ${briefValue(data.goals.primaryActionOther)}
- Target audience: ${briefValue(data.goals.targetAudience)}
- Customer problem / need: ${briefValue(data.goals.customerProblem)}

## TOP SERVICES / OFFERS / MINISTRIES
${bulletLines(offerings)}

## DIFFERENTIATORS
${bulletLines(data.goals.differentiators)}

## CLIENT-SUPPLIED PROOF / CLAIMS
${bulletLines(proofPoints, '- No proof points were supplied.')}

Important: Client-supplied proof is not the same as independent verification. Publish only claims that Eagle Vision is comfortable treating as verified / confirmed.

## INDUSTRY-SPECIFIC DETAILS
${buildIndustryBrief(data)}

## BRAND DIRECTION
- Visual descriptors: ${briefValue(data.brand.visualDescriptors.map(titleCaseToken))}
- Color strategy: ${titleCaseToken(data.brand.colorStrategy)}
- Appearance preference: ${titleCaseToken(data.brand.appearancePreference)}
- Existing colors supplied: ${briefValue(data.brand.existingColors)}
- Design direction: ${titleCaseToken(data.brand.designDirection)}
- Inspiration URLs: ${briefValue(data.brand.inspirationUrls)}

## CONTENT HANDLING
- Default content mode: ${contentMode}
- About handling: ${titleCaseToken(data.contentPolicy.about)}
- Mission handling: ${titleCaseToken(data.contentPolicy.mission)}
- Bios handling: ${titleCaseToken(data.contentPolicy.bios)}
- Beliefs handling: ${titleCaseToken(data.contentPolicy.beliefs)}
- Testimonials: ${titleCaseToken(data.contentPolicy.testimonials)}
- Legal disclaimers: EXACT - do not rewrite

### About / Story Notes
${briefValue(data.contentPolicy.aboutNotes)}

### Mission / Purpose Notes
${briefValue(data.contentPolicy.missionNotes)}

### History / Milestone Notes
${briefValue(data.contentPolicy.historyNotes)}

## PEOPLE / LEADERSHIP TO FEATURE
${bulletLines(people, '- No people / leadership entries were supplied.')}

## WEBSITE PAGE PLAN
${hasWebsite() ? bulletLines(pageLabels) : '- Website not included in this package.'}
${extras.length ? `\nAdditional selected pages beyond the standard five:\n${bulletLines(extras.map(labelForPage))}` : ''}

## APP PLAN
- App included: ${hasApp() ? 'Yes' : 'No'}
- App experience preference: ${app ? titleCaseToken(app.experiencePreference) : 'Not applicable'}
- Login required: ${app ? (app.requiresLogin ? 'Yes' : 'No') : 'Not applicable'}
- Access groups: ${app ? briefValue(app.accessGroups) : 'Not applicable'}
- Developer account path: ${app ? titleCaseToken(app.developerAccountPreference) : 'Not applicable'}
- Requested app capabilities: ${hasApp() ? briefValue(capabilities) : 'Not applicable'}

## EXISTING INTEGRATIONS / PROVIDERS
${bulletLines(integrations, '- No existing integrations were entered.')}

## ASSETS AND UPLOADS
${buildAssetBrief(data)}

## RIGHTS / APPROVAL
- Content and media rights confirmed by client: ${data.permissions.contentRightsConfirmed ? 'Yes' : 'No'}
- Testimonial rights confirmed by client: ${data.permissions.testimonialRightsConfirmed ? 'Yes' : 'No'}
- Submitter states they have authority to approve: ${data.permissions.legalAuthorityToApprove ? 'Yes' : 'No'}
- Client summary confirmed: ${data.review.clientSummaryConfirmed ? 'Yes' : 'No'}

## MISSING / REVIEW ITEMS
${buildReviewFlags(data)}

## EAGLE VISION BUILD STANDARD
The finished work should feel like a premium custom agency build, not an AI-generated template. Prioritize clarity, credibility, conversion, visual hierarchy, responsive polish, professional spacing, strong typography, thoughtful imagery, and an obvious customer journey.

Before final launch:
1. Generate the first build.
2. Run automated / technical QA where available.
3. Deploy a review preview.
4. Eagle Vision / Dave reviews first.
5. Make required refinements.
6. Client reviews the Eagle Vision-approved version.
7. Launch only after final approval of the same version.
`;
  }

  function labelForPage(id) {
    const all = Object.values(pageBlueprints).flatMap(b => b.options);
    return all.find(x => x[0] === id)?.[1] || id.replaceAll('_',' ');
  }

  function packageLabel(p) {
    return ({ website:'Express Website', website_app:'Website + App', app:'Express App' })[p] || 'Not selected';
  }

  function industryLabel(i) {
    const bp = pageBlueprints[i];
    if (bp) return bp.label;
    const opt = $('industry')?.selectedOptions?.[0]?.textContent;
    return opt || i;
  }

  function actionLabel(a) {
    const map = { call:'Call', request_quote:'Request a Quote', book:'Book', visit:'Visit', order:'Order', register:'Register', donate:'Donate / Give', join:'Join', watch:'Watch', contact:'Contact', shop:'Shop', other:val('primary_action_other') || 'Other' };
    return map[a] || a;
  }

  function buildReview() {
    syncConditionals();
    updatePageCount();
    const data = buildIntakeData();
    const capabilities = data.capabilities.map(c => c.capabilityId.replaceAll('_',' '));
    const pageLabels = data.pages.selected.map(labelForPage);
    const descriptors = data.brand.visualDescriptors;
    reviewGrid.innerHTML = [
      ['Project', packageLabel(data.package.product), `${industryLabel(data.business.industry)} • ${data.business.legalOrPublicName || 'Business name missing'}`, false],
      ['Primary Goal', actionLabel(data.goals.primaryAction), data.goals.customerProblem || data.goals.targetAudience || 'We will refine the audience and problem during review.', false],
      ['Top Offerings', `${data.offerings.length} item${data.offerings.length === 1 ? '' : 's'}`, data.offerings.map(o => o.name).join('\n') || 'No offerings entered', false],
      ['Brand Direction', descriptors.join(', ') || 'Eagle Vision chooses', `${data.brand.colorStrategy.replaceAll('_',' ')} • ${data.brand.appearancePreference.replaceAll('_',' ')}`, false],
      ...(hasWebsite() ? [['Website Pages', `${pageLabels.length} selected`, pageLabels.join('\n'), true]] : []),
      ...(hasApp() ? [['App Capabilities', capabilities.length ? `${capabilities.length} selected` : 'Standard app shell', capabilities.join('\n') || 'No additional capabilities selected yet.', true]] : []),
      ['Content Handling', data.contentPolicy.defaultHandling.replaceAll('_',' '), data.contentPolicy.aboutNotes ? 'About/story notes supplied.' : 'Eagle Vision will use the supplied business facts and source material.', false],
      ['Uploads', `${data.media.length} labeled image${data.media.length === 1 ? '' : 's'}`, data.media.map(m => `${m.label.replaceAll('_',' ')}: ${m.subject || m.uploadToken || 'image'}`).join('\n') || 'You can still provide additional assets during Eagle Vision review.', true]
    ].map(([small,strong,p,full]) => `<article class="ex-review-card${full ? ' full':''}"><small>${small}</small><strong>${strong}</strong><p>${p}</p></article>`).join('');

    intakeJsonField.value = JSON.stringify(data);
    if (buildBriefField) buildBriefField.value = buildChatReadyBrief(data);
    reviewSummaryField.value = `${data.business.legalOrPublicName} | ${packageLabel(data.package.product)} | ${industryLabel(data.business.industry)} | Goal: ${actionLabel(data.goals.primaryAction)} | Pages: ${pageLabels.join(', ')} | App: ${capabilities.join(', ')}`;
  }

  function totalUploadBytes() {
    let total = 0;
    form.querySelectorAll('input[type="file"]').forEach(input => {
      [...(input.files || [])].forEach(file => { total += file.size || 0; });
    });
    return total;
  }

  function validateUploadBudget() {
    const maxBytes = 7 * 1024 * 1024;
    const total = totalUploadBytes();
    if (total <= maxBytes) return true;
    submitStatus.textContent = `Your selected uploads total ${(total / 1024 / 1024).toFixed(1)} MB. Please keep this intake at 7 MB or less. For larger files, email design@eaglevision.digital with the subject "Express Assets - Business Name - City, State" or send a Google Drive, Dropbox, OneDrive, or similar download link with access enabled. Do not send passwords, PINs, full cardholder data, or unnecessary sensitive information.`;
    submitStatus.classList.add('show');
    submitStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return false;
  }

  function prepareSubmission() {
    $('submission_timestamp').value = new Date().toISOString();
    if ($('notification_email')) $('notification_email').value = val('contact_email');
    updatePageCount();
    updateCapabilities();
    const data = buildIntakeData();
    intakeJsonField.value = JSON.stringify(data);
    if (buildBriefField) buildBriefField.value = buildChatReadyBrief(data);
    reviewSummaryField.value = `${data.business.legalOrPublicName} | ${packageLabel(data.package.product)} | ${industryLabel(data.business.industry)} | Goal: ${actionLabel(data.goals.primaryAction)} | Pages: ${data.pages.selected.map(labelForPage).join(', ')} | Capabilities: ${data.capabilities.map(c => c.capabilityId).join(', ')}`;
  }

  nextBtn.addEventListener('click', async () => {
    if (!validateStep(currentStep)) return;
    if (currentStep === 1) {
      nextBtn.disabled = true;
      const originalText = nextBtn.textContent;
      nextBtn.textContent = 'Saving basics...';
      await captureLead(false);
      nextBtn.textContent = originalText;
      nextBtn.disabled = false;
    }
    showStep(currentStep + 1);
  });

  backBtn.addEventListener('click', () => showStep(currentStep - 1));

  saveExitBtn.addEventListener('click', () => {
    saveDraft();
    saveStatus.textContent = 'Draft saved. Returning to Express...';
    setTimeout(() => { location.href = '/express/'; }, 350);
  });

  form.addEventListener('input', (event) => {
    if (event.target.closest('#visualDescriptors')) enforceDescriptorLimit(event.target);
    if (event.target.id === 'industry') {
      renderPages(false);
      defaultPrimaryActionForIndustry();
    }
    syncConditionals();
    queueSave();
    queueLeadCapture();
  });

  form.addEventListener('change', (event) => {
    if (event.target.closest('#visualDescriptors')) enforceDescriptorLimit(event.target);
    if (event.target.id === 'industry') renderPages(false);
    syncConditionals();
    queueSave();
    queueLeadCapture();
  });

  addMediaBtn.addEventListener('click', revealMediaRows);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    syncConditionals();

    if (!validateAllSteps()) return;
    if (!validateUploadBudget()) return;

    prepareSubmission();
    submitStatus.textContent = 'Submitting your Express intake to Eagle Vision...';
    submitStatus.classList.add('show');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    window.setTimeout(() => {
      form.submit();
    }, 80);
  });

  getLeadCaptureId();
  restoreDraft();
  const savedPages = val('pages_selected');
  applyQueryParams();
  renderPages(false);
  applySavedPageSelection(savedPages);
  syncConditionals();
  enforceDescriptorLimit();
  ensureMediaRowsFromSaved();
  showStep(currentStep);
  saveDraft();
  queueLeadCapture();
})();