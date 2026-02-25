/**
 * FreightMath BidRight — Presentation Engine
 * Handles slide navigation, animations, and interactive elements
 */

// ─── SLIDE ENGINE ───

const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
let current = 0;
let slideTimers = [];  // Global timer pool for auto-play animations

function clearSlideTimers() {
  slideTimers.forEach(t => clearTimeout(t));
  slideTimers = [];
}

function goToSlide(n) {
  if (n < 0 || n >= totalSlides || n === current) return;
  clearSlideTimers();
  slides[current].classList.remove('active');
  current = n;
  slides[current].classList.add('active');
  updateUI();
  animateORBars();
}

function navigate(dir) { goToSlide(current + dir); }

function updateUI() {
  document.getElementById('prev-btn').disabled = current === 0;
  document.getElementById('next-btn').disabled = current === totalSlides - 1;
  document.querySelector('#slide-counter span').textContent = current + 1;
  document.getElementById('progress-bar').style.width = ((current / (totalSlides - 1)) * 100) + '%';

  // Update section dots
  const dots = document.querySelectorAll('.section-dot');
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
}

// ─── SECTION NAV ───
const sectionNav = document.getElementById('section-nav');
slides.forEach((s, i) => {
  const dot = document.createElement('button');
  dot.className = 'section-dot' + (i === 0 ? ' active' : '');
  dot.onclick = () => goToSlide(i);
  const tip = document.createElement('span');
  tip.className = 'tooltip';
  tip.textContent = s.dataset.section || 'Slide ' + (i+1);
  dot.appendChild(tip);
  sectionNav.appendChild(dot);
});

// ─── KEYBOARD ───
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') navigate(1);
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') navigate(-1);
});

// ─── TOUCH / SWIPE ───
let touchStartX = 0;
document.addEventListener('touchstart', e => touchStartX = e.touches[0].clientX);
document.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) navigate(diff > 0 ? 1 : -1);
});

// ─── TAB SWITCHING ───
function switchTab(e, prefix) {
  const group = e.target.closest('.tab-group') || e.target.parentElement;
  const btns = group.querySelectorAll('.tab-btn');
  const idx = Array.from(btns).indexOf(e.target);
  btns.forEach(b => b.classList.remove('active'));
  e.target.classList.add('active');
  // Find panels
  const slide = e.target.closest('.slide');
  const panels = slide.querySelectorAll(`[id^="${prefix}-tab-"]`);
  panels.forEach((p, i) => p.classList.toggle('active', i === idx));
}

// ─── CHECKLIST ───
function toggleCheck(el) {
  el.classList.toggle('checked');
}

// ─── ANIMATE OR BARS ───
function animateORBars() {
  const activeSlide = slides[current];
  const bars = activeSlide.querySelectorAll('.or-bar-fill[data-width]');
  bars.forEach(bar => {
    setTimeout(() => { bar.style.width = bar.dataset.width; }, 300);
  });
}

// ─── SLIDE 2: DATA CLEANER — Click each row to clean ───
function cleanDataRow(row) {
  if (row.classList.contains('dc-cleaned')) return;
  row.classList.add('dc-cleaned');
  // Add the green check badge
  const statusCol = row.querySelector('.dc-col-status');
  if (statusCol && !statusCol.querySelector('.dc-badge-clean')) {
    const badge = document.createElement('span');
    badge.className = 'dc-badge dc-badge-clean';
    badge.innerHTML = '&#10003;';
    statusCol.appendChild(badge);
  }
  // Update counter
  const container = document.getElementById('data-cleaner');
  const cleaned = container.querySelectorAll('.dc-cleaned').length;
  const total = container.querySelectorAll('.dc-row').length;
  const counter = document.getElementById('dc-counter');
  if (counter) counter.textContent = cleaned;
  // All clean?
  if (cleaned === total) {
    container.classList.add('dc-all-clean');
    const prompt = document.getElementById('data-cleaner-prompt');
    if (prompt) {
      prompt.style.color = 'var(--green)';
      prompt.innerHTML = '&#10003; All data cleaned &mdash; now you can measure true profitability';
    }
  }
}

function resetDataCleaner() {
  const container = document.getElementById('data-cleaner');
  if (!container) return;
  container.classList.remove('dc-all-clean');
  const rows = container.querySelectorAll('.dc-row');
  rows.forEach(row => {
    row.classList.remove('dc-cleaned');
    const cleanBadge = row.querySelector('.dc-badge-clean');
    if (cleanBadge) cleanBadge.remove();
  });
  const counter = document.getElementById('dc-counter');
  if (counter) counter.textContent = '0';
  const prompt = document.getElementById('data-cleaner-prompt');
  if (prompt) {
    prompt.style.color = 'var(--accent)';
    prompt.innerHTML = 'Cleaning data &mdash; <span id="dc-counter">0</span> of 4 resolved';
  }
}

function autoCleanData() {
  const container = document.getElementById('data-cleaner');
  if (!container) return;
  const rows = container.querySelectorAll('.dc-row');
  rows.forEach((row, i) => {
    slideTimers.push(setTimeout(() => cleanDataRow(row), 1200 + i * 2500));
  });
}

// ─── SLIDE 3: COST ALLOCATION FUNNEL — Auto-play animation ───
let allocTimers = [];

function resetAlloc() {
  // Clear any pending timers
  allocTimers.forEach(t => clearTimeout(t));
  allocTimers = [];

  const pipeline = document.querySelector('.alloc-pipeline');
  if (!pipeline) return;

  // Reset GL pills
  const pills = pipeline.querySelectorAll('.gl-acct');
  pills.forEach(p => { p.classList.remove('visible', 'absorbed'); });

  // Reset funnel
  const funnel = pipeline.querySelector('.alloc-funnel');
  if (funnel) { funnel.classList.remove('visible', 'processing'); }

  // Reset all alloc-reveal elements (coa cells, method cards, load boxes, connectors)
  const reveals = pipeline.querySelectorAll('.alloc-reveal:not(.gl-acct):not(.alloc-funnel)');
  reveals.forEach(el => { el.classList.remove('visible'); });
}

function animateAlloc() {
  const pipeline = document.querySelector('.alloc-pipeline');
  if (!pipeline) return;

  const pills = pipeline.querySelectorAll('.gl-acct');
  const funnel = pipeline.querySelector('.alloc-funnel');
  const coaBox = pipeline.querySelector('.coa-box');
  const coaCells = coaBox ? coaBox.querySelectorAll('.coa-cell.alloc-reveal') : [];
  const connector1 = pipeline.querySelector('.alloc-connector.alloc-reveal');
  const branch = pipeline.querySelector('.alloc-branch.alloc-reveal');
  const methodCards = pipeline.querySelectorAll('.method-card.alloc-reveal');
  const connector2 = pipeline.querySelectorAll('.alloc-connector.alloc-reveal')[1];
  const loadBoxes = pipeline.querySelectorAll('.load-box.alloc-reveal');

  // Phase 1: Scatter pills in (400-1100ms, 100ms stagger)
  pills.forEach((pill, i) => {
    allocTimers.push(setTimeout(() => {
      pill.classList.add('visible');
    }, 400 + i * 100));
  });

  // Phase 2: Funnel fades in at 1900ms; pills shrink/absorb (80ms stagger)
  allocTimers.push(setTimeout(() => {
    if (funnel) funnel.classList.add('visible');
    pills.forEach((pill, i) => {
      allocTimers.push(setTimeout(() => {
        pill.classList.add('absorbed');
      }, 200 + i * 80));
    });
  }, 1900));

  // Phase 3: Processing — shimmer + particles + glow (2500ms)
  allocTimers.push(setTimeout(() => {
    if (funnel) funnel.classList.add('processing');
  }, 2500));

  // Phase 4: Emerge — CoA box and cells stagger in (4800ms)
  allocTimers.push(setTimeout(() => {
    if (coaBox) coaBox.classList.add('visible');
    coaCells.forEach((cell, i) => {
      allocTimers.push(setTimeout(() => {
        cell.classList.add('visible');
      }, i * 120));
    });
  }, 4800));

  // Phase 5: Distribute — connector, branch, method cards, load connector, load boxes (6200ms)
  allocTimers.push(setTimeout(() => {
    if (connector1) connector1.classList.add('visible');
    allocTimers.push(setTimeout(() => {
      if (branch) branch.classList.add('visible');
    }, 200));
    methodCards.forEach((card, i) => {
      allocTimers.push(setTimeout(() => {
        card.classList.add('visible');
      }, 400 + i * 200));
    });
    allocTimers.push(setTimeout(() => {
      if (connector2) connector2.classList.add('visible');
    }, 1400));
    loadBoxes.forEach((box, i) => {
      allocTimers.push(setTimeout(() => {
        box.classList.add('visible');
      }, 1600 + i * 150));
    });
    // Reveal any remaining alloc-reveal elements (e.g. CTA button)
    const remaining = pipeline.querySelectorAll('.alloc-reveal:not(.visible):not(.gl-acct):not(.alloc-funnel):not(.coa-box):not(.coa-cell):not(.alloc-connector):not(.alloc-branch):not(.method-card):not(.load-box)');
    allocTimers.push(setTimeout(() => {
      remaining.forEach(el => el.classList.add('visible'));
    }, 2800));
  }, 6200));
}

// ─── SLIDE 5: BRIDGE FLOW — Auto-reveal animation ───
function animateBridge() {
  const items = document.querySelectorAll('#bridge-flow .bridge-reveal');
  const prompt = document.getElementById('bridge-prompt');
  const dart = document.getElementById('bridge-dart');
  const ring = document.getElementById('bridge-dart-ring');
  // Arrow reveals after 0.8s
  if (items[1]) setTimeout(() => { items[1].style.opacity = '1'; }, 800);
  // BidRight box reveals after 1.4s
  if (items[2]) setTimeout(() => { items[2].style.opacity = '1'; }, 1400);
  // Dart lands in bullseye after 2.2s
  if (dart) setTimeout(() => {
    dart.classList.add('landed');
    if (ring) setTimeout(() => ring.classList.add('pulse'), 350);
  }, 2200);
  // Tagline reveals after 3s
  if (prompt) setTimeout(() => { prompt.style.opacity = '1'; }, 3000);
}

function resetBridge() {
  const items = document.querySelectorAll('#bridge-flow .bridge-reveal');
  const prompt = document.getElementById('bridge-prompt');
  const dart = document.getElementById('bridge-dart');
  const ring = document.getElementById('bridge-dart-ring');
  items.forEach((el, i) => {
    if (i === 0) {
      el.style.opacity = '1';
    } else {
      el.style.opacity = '0';
    }
  });
  if (prompt) prompt.style.opacity = '0';
  if (dart) { dart.classList.remove('landed'); dart.style.opacity = '0'; }
  if (ring) ring.classList.remove('pulse');
}

// ─── SLIDE 8: ORIGIN STORY — Click-to-Reveal Timeline ───
function revealNextOrigin() {
  const items = document.querySelectorAll('#origin-timeline .origin-reveal');
  const prompt = document.getElementById('origin-prompt');
  for (let i = 0; i < items.length; i++) {
    if (items[i].style.opacity === '0') {
      items[i].style.opacity = '1';
      items[i].style.transform = 'translateY(0)';
      if (items[i].classList.contains('flow-arrow') && items[i + 1]) {
        items[i + 1].style.opacity = '1';
        items[i + 1].style.transform = 'translateY(0)';
      }
      const remaining = Array.from(items).filter(el => el.style.opacity === '0');
      if (remaining.length === 0 && prompt) prompt.style.opacity = '0';
      return;
    }
  }
}

function resetOrigin() {
  const items = document.querySelectorAll('#origin-timeline .origin-reveal');
  const prompt = document.getElementById('origin-prompt');
  items.forEach((el, i) => {
    if (i === 0) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    } else {
      el.style.opacity = '0';
      el.style.transform = 'translateY(8px)';
    }
  });
  if (prompt) prompt.style.opacity = '0.6';
}

// ─── SLIDE 10: LIFECYCLE FLOW — Click-to-Reveal ───
function revealNextLifecycle() {
  const items = document.querySelectorAll('#lifecycle-flow .lifecycle-reveal');
  const prompt = document.getElementById('lifecycle-prompt');
  for (let i = 0; i < items.length; i++) {
    if (items[i].style.opacity === '0') {
      items[i].style.opacity = '1';
      items[i].style.transform = 'translateY(0)';
      if (items[i].classList.contains('flow-arrow') && items[i + 1]) {
        items[i + 1].style.opacity = '1';
        items[i + 1].style.transform = 'translateY(0)';
      }
      const remaining = Array.from(items).filter(el => el.style.opacity === '0');
      if (remaining.length === 0 && prompt) prompt.style.opacity = '0';
      return;
    }
  }
}

function resetLifecycle() {
  const items = document.querySelectorAll('#lifecycle-flow .lifecycle-reveal');
  const prompt = document.getElementById('lifecycle-prompt');
  items.forEach((el, i) => {
    if (i === 0) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    } else {
      el.style.opacity = '0';
      el.style.transform = 'translateY(8px)';
    }
  });
  if (prompt) prompt.style.opacity = '0.6';
}

// ─── SLIDE 13: CYCLE DIAGRAM — Click-to-Reveal ───
function revealNextCycle() {
  const items = document.querySelectorAll('#cycle-diagram .cycle-reveal');
  const prompt = document.getElementById('cycle-prompt');
  for (let i = 0; i < items.length; i++) {
    if (items[i].style.opacity === '0') {
      items[i].style.opacity = '1';
      items[i].style.transform = 'translateY(0)';
      // If arrow, also reveal the next step
      if (items[i].classList.contains('cycle-arrow') && items[i + 1]) {
        items[i + 1].style.opacity = '1';
        items[i + 1].style.transform = 'translateY(0)';
      }
      const remaining = Array.from(items).filter(el => el.style.opacity === '0');
      if (remaining.length === 0 && prompt) prompt.style.opacity = '0';
      return;
    }
  }
}

function resetCycle() {
  const items = document.querySelectorAll('#cycle-diagram .cycle-reveal');
  const prompt = document.getElementById('cycle-prompt');
  items.forEach((el, i) => {
    if (i === 0) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    } else {
      el.style.opacity = '0';
      el.style.transform = 'translateY(8px)';
    }
  });
  if (prompt) prompt.style.opacity = '0.6';
}

// ─── TESTIMONIAL CAROUSEL ───
let testimonialCurrent = 0;
let testimonialTimer = null;
const TESTIMONIAL_COUNT = 4;
const TESTIMONIAL_INTERVAL = 6000;

function goToTestimonial(n) {
  testimonialCurrent = n;
  const tSlides = document.querySelectorAll('.testimonial-slide');
  const tDots = document.querySelectorAll('.testimonial-dot');
  tSlides.forEach((s, i) => s.classList.toggle('active', i === n));
  tDots.forEach((d, i) => d.classList.toggle('active', i === n));
}

function nextTestimonial() {
  goToTestimonial((testimonialCurrent + 1) % TESTIMONIAL_COUNT);
}

function startTestimonialCycle() {
  stopTestimonialCycle();
  testimonialTimer = setInterval(nextTestimonial, TESTIMONIAL_INTERVAL);
}

function stopTestimonialCycle() {
  if (testimonialTimer) { clearInterval(testimonialTimer); testimonialTimer = null; }
}

function resetTestimonialCarousel() {
  stopTestimonialCycle();
  goToTestimonial(0);
  startTestimonialCycle();
}

// ─── INTERACTIVE COST MODEL ───
function updateCostModel() {
  const loadedEl = document.getElementById('cm-loaded');
  const deadEl = document.getElementById('cm-dead');
  const hoursEl = document.getElementById('cm-hours');
  const loadTimeEl = document.getElementById('cm-load-time');
  const unloadTimeEl = document.getElementById('cm-unload-time');
  if (!loadedEl) return;

  const loaded = parseInt(loadedEl.value);
  const dead = parseInt(deadEl.value);
  const transitHours = parseInt(hoursEl.value);
  const loadTime = parseFloat(loadTimeEl.value);
  const unloadTime = parseFloat(unloadTimeEl.value);
  const hours = transitHours + loadTime + unloadTime;

  // Update output displays
  document.getElementById('cm-loaded-val').textContent = loaded;
  document.getElementById('cm-dead-val').textContent = dead;
  document.getElementById('cm-hours-val').textContent = transitHours;
  document.getElementById('cm-load-time-val').textContent = loadTime.toFixed(1);
  document.getElementById('cm-unload-time-val').textContent = unloadTime.toFixed(1);

  // Constants (matching FreightMath Primer)
  const varCPM = 1.67;
  const fixPerHr = 28.86;
  const revRate = 2.77;

  // Calculations
  const revenue = loaded * revRate;
  const varCost = (loaded + dead) * varCPM;
  const fixCost = hours * fixPerHr;
  const totalCost = varCost + fixCost;
  const totalMiles = loaded + dead;
  const cpm = totalCost / totalMiles;
  const or = (totalCost / revenue) * 100;

  // Format currency
  const fmt = n => '$' + Math.round(n).toLocaleString();

  document.getElementById('cm-rev').textContent = fmt(revenue);
  document.getElementById('cm-var').textContent = '\u2212' + fmt(varCost);
  document.getElementById('cm-fix').textContent = '\u2212' + fmt(fixCost);
  const fixHint = document.getElementById('cm-fix-hint');
  if (fixHint) fixHint.textContent = '$28.86/hr \u00d7 ' + hours.toFixed(1) + 'h';
  document.getElementById('cm-total').textContent = fmt(totalCost);
  document.getElementById('cm-cpm').textContent = '$' + cpm.toFixed(2);
  document.getElementById('cm-or').textContent = or.toFixed(1);

  // Color the OR value
  const orEl = document.getElementById('cm-or');
  orEl.classList.toggle('profitable', or <= 100);
  orEl.classList.toggle('unprofitable', or > 100);

  // Update Core OR card value
  const coreCard = document.getElementById('or-card-core');
  if (coreCard) {
    coreCard.querySelector('.or-card-value').textContent = or.toFixed(1);
  }

  // Update FreightMath OR — weighted blend of Core, Inbound, Outbound
  // Non-linear blend: uses asymmetric coefficients + dampening curve
  const inboundOR = 98.2;
  const outboundOR = 92.5;
  const baseCore = 95.0;
  const delta = or - baseCore;
  // Dampened core contribution: scales sub-linearly so the relationship isn't obvious
  const adjustedCore = baseCore + delta * (0.72 + 0.03 * Math.sin(delta * 0.4));
  // Asymmetric blend with non-round weights
  const fmOR = adjustedCore * 0.573 + inboundOR * 0.214 + outboundOR * 0.213;
  const fmCard = document.getElementById('or-card-fm');
  if (fmCard) {
    fmCard.querySelector('.or-card-value').textContent = fmOR.toFixed(1);
  }
}

function resetCostModel() {
  const loadedEl = document.getElementById('cm-loaded');
  const deadEl = document.getElementById('cm-dead');
  const hoursEl = document.getElementById('cm-hours');
  const loadTimeEl = document.getElementById('cm-load-time');
  const unloadTimeEl = document.getElementById('cm-unload-time');
  if (!loadedEl) return;
  loadedEl.value = 802;
  deadEl.value = 160;
  hoursEl.value = 20;
  loadTimeEl.value = 1.3;
  unloadTimeEl.value = 1.3;
  updateCostModel();
}

// ─── INIT ───
updateUI();
setTimeout(animateORBars, 500);

// ─── MUTATION OBSERVER — Trigger animations/resets on slide entry ───
const observer = new MutationObserver(() => {
  animateORBars();

  // Slide 2: Auto-clean data rows with stagger
  if (slides[2] && slides[2].classList.contains('active')) {
    resetDataCleaner();
    autoCleanData();
  }

  // Slide 3: Cost Allocation Funnel animation
  if (slides[3] && slides[3].classList.contains('active')) {
    resetAlloc();
    setTimeout(animateAlloc, 400);
  }

  // Slide 4: Initialize/refresh FreightMath OR map + reset cost model
  if (slides[4] && slides[4].classList.contains('active')) {
    if (typeof initFMMap === 'function') {
      setTimeout(() => {
        initFMMap();
        if (fmMap) {
          fmMap.invalidateSize();
          showFMStep('core');
        }
        resetCostModel();
      }, 300);
    }
  }

  // Slide 6: Testimonial carousel
  if (slides[6] && slides[6].classList.contains('active')) {
    resetTestimonialCarousel();
  } else {
    stopTestimonialCycle();
  }

  // Slide 7: Animate bridge reveal
  if (slides[7] && slides[7].classList.contains('active')) {
    resetBridge();
    setTimeout(animateBridge, 400);
  }

  // Slide 9: Origin timeline — auto-play left-to-right
  if (slides[9] && slides[9].classList.contains('active')) {
    const items = document.querySelectorAll('#origin-timeline .origin-reveal');
    items.forEach(el => el.classList.remove('visible'));
    items.forEach((el, i) => {
      slideTimers.push(setTimeout(() => el.classList.add('visible'), 400 + i * 500));
    });
  }

  // Slide 10: Real Results — staggered stat card reveal
  if (slides[10] && slides[10].classList.contains('active')) {
    const cards = slides[10].querySelectorAll('.results-reveal');
    cards.forEach(el => el.classList.remove('visible'));
    cards.forEach((el, i) => {
      slideTimers.push(setTimeout(() => el.classList.add('visible'), 400 + i * 400));
    });
  }

  // Slide 11: Security — staggered diagram reveal
  if (slides[11] && slides[11].classList.contains('active')) {
    const nodes = slides[11].querySelectorAll('.sec-reveal');
    nodes.forEach(el => el.classList.remove('visible'));
    nodes.forEach((el, i) => {
      slideTimers.push(setTimeout(() => el.classList.add('visible'), 300 + i * 350));
    });
  }

  // Slide 12: Before/After — show "After" column after 3.5s delay
  if (slides[12] && slides[12].classList.contains('active')) {
    const afterCol = slides[12].querySelector('.after-col');
    if (afterCol) {
      afterCol.classList.remove('visible');
      slideTimers.push(setTimeout(() => afterCol.classList.add('visible'), 3500));
    }
  }

  // Slide 13: Lifecycle flow — auto-play left-to-right
  if (slides[13] && slides[13].classList.contains('active')) {
    const items = document.querySelectorAll('#lifecycle-flow .lifecycle-reveal');
    items.forEach(el => el.classList.remove('visible'));
    items.forEach((el, i) => {
      slideTimers.push(setTimeout(() => el.classList.add('visible'), 400 + i * 500));
    });
  }

  // Slide 17: Flywheel diagram — staggered reveal from center out
  if (slides[17] && slides[17].classList.contains('active')) {
    const items = document.querySelectorAll('#flywheel-diagram .fw-reveal');
    items.forEach(el => el.classList.remove('visible'));
    items.forEach((el, i) => {
      slideTimers.push(setTimeout(() => el.classList.add('visible'), 400 + i * 400));
    });
  }

  // Slide 18: Roadmap — left-to-right phase reveal
  if (slides[18] && slides[18].classList.contains('active')) {
    const phases = slides[18].querySelectorAll('.roadmap-reveal');
    phases.forEach(p => p.classList.remove('visible'));
    phases.forEach((phase, i) => {
      slideTimers.push(setTimeout(() => phase.classList.add('visible'), 400 + i * 400));
    });
  }

  // Slide 19: Breakthrough Fuel — left-to-right panel reveal
  if (slides[19] && slides[19].classList.contains('active')) {
    const items = slides[19].querySelectorAll('.bt-fuel-reveal');
    items.forEach(el => el.classList.remove('visible'));
    items.forEach((el, i) => {
      slideTimers.push(setTimeout(() => el.classList.add('visible'), 400 + i * 500));
    });
  }
});
slides.forEach(s => observer.observe(s, { attributes: true, attributeFilter: ['class'] }));

/* ─── Video Fullscreen Toggle ─── */
function toggleVideoFullscreen(id) {
  const wrap = document.getElementById(id);
  if (!wrap) return;
  wrap.classList.toggle('is-fullscreen');
  const icon = wrap.querySelector('.video-fullscreen-btn i');
  if (icon) {
    icon.setAttribute('data-lucide', wrap.classList.contains('is-fullscreen') ? 'minimize' : 'maximize');
    lucide.createIcons();
  }
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.video-frame.is-fullscreen').forEach(el => {
      el.classList.remove('is-fullscreen');
      const icon = el.querySelector('.video-fullscreen-btn i');
      if (icon) { icon.setAttribute('data-lucide', 'maximize'); lucide.createIcons(); }
    });
  }
});

/* ─── Excel Popup ─── */
function openExcelPopup() {
  const overlay = document.getElementById('excel-popup-overlay');
  const slash = document.getElementById('excel-slash');
  const msg = document.getElementById('excel-msg');
  slash.classList.remove('animate');
  msg.classList.remove('show');
  overlay.classList.add('open');
  // Force reflow then trigger animations
  void slash.offsetWidth;
  slash.classList.add('animate');
  msg.classList.add('show');
}

function closeExcelPopup(e, forceClose) {
  const overlay = document.getElementById('excel-popup-overlay');
  if (forceClose || e.target === overlay) {
    overlay.classList.remove('open');
  }
}

/* ─── Reusable Preview Popup ─── */
function openPreviewPopup(imgSrc, title) {
  const overlay = document.getElementById('preview-popup-overlay');
  const img = document.getElementById('preview-img');
  const titleEl = document.getElementById('preview-title');
  img.src = imgSrc;
  img.alt = title;
  titleEl.textContent = title;
  overlay.classList.add('open');
}

function closePreviewPopup(e, forceClose) {
  const overlay = document.getElementById('preview-popup-overlay');
  if (forceClose || e.target === overlay) {
    overlay.classList.remove('open');
  }
}
