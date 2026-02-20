/**
 * FreightMath Presentation Engine
 * Handles slide navigation, animations, and interactive elements
 */

// ─── SLIDE ENGINE ───

const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
let current = 0;

function goToSlide(n) {
  if (n < 0 || n >= totalSlides || n === current) return;
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

// ─── CLICK-TO-REVEAL STEPS ───
function revealNextStep() {
  const steps = document.querySelectorAll('#power-checklist .reveal-step');
  const prompt = document.getElementById('reveal-prompt');
  for (let i = 0; i < steps.length; i++) {
    if (steps[i].style.opacity === '0') {
      steps[i].style.opacity = '1';
      steps[i].style.pointerEvents = 'auto';
      steps[i].style.transform = 'translateY(0)';
      if (i === steps.length - 1 && prompt) {
        prompt.style.opacity = '0';
      }
      return;
    }
  }
}

function resetRevealSteps() {
  const steps = document.querySelectorAll('#power-checklist .reveal-step');
  const prompt = document.getElementById('reveal-prompt');
  steps.forEach((s, i) => {
    if (i === 0) {
      s.style.opacity = '1';
      s.style.pointerEvents = 'auto';
      s.style.transform = 'translateY(0)';
    } else {
      s.style.opacity = '0';
      s.style.pointerEvents = 'none';
      s.style.transform = 'translateY(8px)';
    }
  });
  if (prompt) prompt.style.opacity = '0.6';
}

// ─── BIDRIGHT INLINE TOGGLE RESET ───
function resetBidRight() {
  const trigger = document.getElementById('bidright-card-inline');
  const detail = document.getElementById('bidright-detail');
  if (trigger) trigger.style.display = '';
  if (detail) detail.style.display = 'none';
}
function revealNextDeleg() {
  const items = document.querySelectorAll('#delegation-steps .deleg-reveal');
  const prompt = document.getElementById('deleg-reveal-prompt');
  for (let i = 0; i < items.length; i++) {
    if (items[i].style.opacity === '0') {
      items[i].style.opacity = '1';
      items[i].style.transform = 'translateY(0)';
      // If this is an arrow, also reveal the next flow-step immediately after
      if (items[i].classList.contains('flow-arrow') && items[i + 1]) {
        items[i + 1].style.opacity = '1';
        items[i + 1].style.transform = 'translateY(0)';
      }
      // Hide prompt when all revealed
      const remaining = Array.from(items).filter(el => el.style.opacity === '0');
      if (remaining.length === 0 && prompt) prompt.style.opacity = '0';
      return;
    }
  }
}

function resetDelegSteps() {
  const items = document.querySelectorAll('#delegation-steps .deleg-reveal');
  const prompt = document.getElementById('deleg-reveal-prompt');
  items.forEach((el, i) => {
    if (i === 0) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    } else {
      el.style.opacity = '0';
      el.style.transform = el.classList.contains('flow-arrow') ? '' : 'translateY(8px)';
    }
  });
  if (prompt) prompt.style.opacity = '0.6';
}

// ─── NETWORK DISCIPLINE CLICK-TO-REVEAL ───
function revealNextND() {
  const items = document.querySelectorAll('#nd-flow .nd-reveal');
  const prompt = document.getElementById('nd-click-prompt');
  const profit = document.getElementById('nd-profit');
  for (let i = 0; i < items.length; i++) {
    if (items[i].style.opacity === '0') {
      items[i].style.opacity = '1';
      items[i].style.transform = 'translateY(0)';
      // If this is an arrow, also reveal the next panel immediately
      if (items[i].querySelector('div[style*="font-weight:700"]') && items[i + 1]) {
        items[i + 1].style.opacity = '1';
        items[i + 1].style.transform = 'translateY(0)';
      }
      // Check if all revealed
      const remaining = Array.from(items).filter(el => el.style.opacity === '0');
      if (remaining.length === 0) {
        if (prompt) prompt.style.opacity = '0';
        // Show PROFITABILITY crown after all panels
        if (profit) {
          setTimeout(() => { profit.style.opacity = '1'; profit.style.transform = 'translateY(0)'; }, 300);
        }
      }
      return;
    }
  }
}

function resetND() {
  const items = document.querySelectorAll('#nd-flow .nd-reveal');
  const prompt = document.getElementById('nd-click-prompt');
  const profit = document.getElementById('nd-profit');
  items.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
  });
  if (prompt) prompt.style.opacity = '0.6';
  if (profit) { profit.style.opacity = '0'; profit.style.transform = 'translateY(-10px)'; }
}

// ─── ANIMATE OR BARS ───
function animateORBars() {
  const activeSlide = slides[current];
  const bars = activeSlide.querySelectorAll('.or-bar-fill[data-width]');
  bars.forEach(bar => {
    setTimeout(() => { bar.style.width = bar.dataset.width; }, 300);
  });
}

// ─── ANIMATE DONUT ───
function animateDonut() {
  const segments = document.querySelectorAll('.donut-segment');
  segments.forEach(seg => {
    const offset = 314 - (314 * 105.6 / 120);
    setTimeout(() => { seg.style.transition = 'stroke-dashoffset 1.5s ease'; seg.setAttribute('stroke-dashoffset', offset); }, 500);
  });
}

// ─── INIT ───
updateUI();
setTimeout(animateORBars, 500);

// Watch for slide changes to trigger animations
const observer = new MutationObserver(() => {
  animateORBars();
  animateDonut();
  // Init benchmark charts when slide 2 becomes active
  if (slides[2] && slides[2].classList.contains('active')) {
    if (typeof initBenchmarkGauges === 'function') initBenchmarkGauges();
  }
  // Reset reveal steps when slide 8 becomes active
  if (slides[8] && slides[8].classList.contains('active')) {
    resetRevealSteps();
  }
  // Reset delegation steps when slide 4 becomes active
  if (slides[4] && slides[4].classList.contains('active')) {
    resetDelegSteps();
  }
  // Reset Network Discipline panels when slide 6 becomes active
  if (slides[6] && slides[6].classList.contains('active')) {
    resetND();
  }
  // Reset BidRight when slide 5 becomes active
  if (slides[5] && slides[5].classList.contains('active')) {
    resetBidRight();
  }
  // Init FreightMath map when slide 9 becomes active
  if (slides[9] && slides[9].classList.contains('active')) {
    initFMMap();
  }
  // Auto-play/pause network video on slide 7
  const netVideo = document.getElementById('network-video');
  if (netVideo) {
    if (slides[7] && slides[7].classList.contains('active')) {
      netVideo.play();
    } else {
      netVideo.pause();
    }
  }
});
slides.forEach(s => observer.observe(s, { attributes: true, attributeFilter: ['class'] }));

// ─── HIDE KB HINT AFTER FIRST NAV ───
document.addEventListener('keydown', function hideHint() {
  document.querySelector('.kb-hint').style.opacity = '0';
  document.removeEventListener('keydown', hideHint);
}, { once: false });

// ─── SURVEY ANIMATION ───
let surveyPlayed = false;
let surveyTimers = [];

function resetSurvey() {
  surveyTimers.forEach(t => clearTimeout(t));
  surveyTimers = [];
  const q = document.getElementById('survey-question');
  const r = document.getElementById('survey-responses');
  const p = document.getElementById('survey-punchline');
  const c = document.getElementById('survey-click-prompt');
  if (q) q.style.opacity = '0';
  if (r) r.innerHTML = '';
  if (p) { p.style.opacity = '0'; p.style.pointerEvents = 'none'; }
  if (c) c.style.opacity = '0';
  surveyPlayed = false;
}

function showSurveyPunchline() {
  const p = document.getElementById('survey-punchline');
  const c = document.getElementById('survey-click-prompt');
  if (p) { p.style.opacity = '1'; p.style.pointerEvents = 'auto'; }
  if (c) c.style.opacity = '0';
}

function playSurvey() {
  if (surveyPlayed) return;
  surveyPlayed = true;

  const q = document.getElementById('survey-question');
  const r = document.getElementById('survey-responses');
  const c = document.getElementById('survey-click-prompt');
  if (!q || !r) return;

  // Phase 1: Show question
  q.style.opacity = '1';

  // Phase 2: After 2s, scatter dollar responses in the responses area
  const responses = ['$0.00','$0.05','$0.10','$0.30','$0.45','$0.62','$0.05','$0.30','$0.10','$0.62','$0.45','$0.00','$0.62','$0.10','$0.30','$0.05','$0.62','$0.45','$0.00','$0.62','$0.30','$0.10','$0.62','$0.05'];
  const colors = {
    '$0.00':'var(--red)','$0.05':'var(--red)','$0.10':'var(--yellow)',
    '$0.30':'var(--yellow)','$0.45':'var(--accent)','$0.62':'var(--red)'
  };

  surveyTimers.push(setTimeout(() => {
    responses.forEach((val, i) => {
      surveyTimers.push(setTimeout(() => {
        const span = document.createElement('div');
        span.textContent = val;
        span.style.cssText = `
          position:absolute;
          font-family:var(--font-mono);
          font-weight:700;
          color:${colors[val] || 'var(--steel)'};
          opacity:0;
          transition:opacity 0.5s ease, transform 0.5s ease;
          transform:scale(0.5);
          pointer-events:none;
          text-shadow:0 0 20px ${colors[val] || 'var(--steel)'};
        `;
        const top = 5 + Math.random() * 80;
        const left = 3 + Math.random() * 88;
        const vwFactor = window.innerWidth / 1920;
        const size = (val === '$0.62' ? (18 + Math.random() * 16) : (14 + Math.random() * 12)) * vwFactor;
        span.style.top = top + '%';
        span.style.left = left + '%';
        span.style.fontSize = size + 'px';
        const rot = -15 + Math.random() * 30;
        r.appendChild(span);
        requestAnimationFrame(() => {
          span.style.opacity = (val === '$0.62') ? '1' : (0.4 + Math.random() * 0.5);
          span.style.transform = 'scale(1) rotate(' + rot + 'deg)';
        });
      }, i * 120));
    });
  }, 2000));

  // Phase 3: After all responses, show click prompt
  surveyTimers.push(setTimeout(() => {
    if (c) c.style.opacity = '1';
  }, 2000 + responses.length * 120 + 800));
}

// Watch for Trait 1 slide becoming active
const surveyObserver = new MutationObserver(() => {
  const trait1Slide = slides[3];
  if (trait1Slide && trait1Slide.classList.contains('active')) {
    resetSurvey();
    setTimeout(playSurvey, 400);
  }
});
if (slides[3]) {
  surveyObserver.observe(slides[3], { attributes: true, attributeFilter: ['class'] });
}

// ─── HIDDEN COST OVERLAY ───
var hcStep = 0;
function showHCOverlay() {
  var overlay = document.getElementById('hc-overlay');
  var img = document.getElementById('hc-overlay-img');
  var caption = document.getElementById('hc-overlay-caption');
  if (!overlay) return;
  hcStep = 0;
  img.src = 'Picture1.png';
  caption.textContent = 'Click to continue \u2192';
  overlay.style.opacity = '1';
  overlay.style.pointerEvents = 'auto';
}

function advanceHCOverlay() {
  var overlay = document.getElementById('hc-overlay');
  var img = document.getElementById('hc-overlay-img');
  var caption = document.getElementById('hc-overlay-caption');
  if (!overlay) return;
  hcStep++;
  if (hcStep === 1) {
    img.src = 'Picture2.png';
    caption.textContent = 'Click to close \u00D7';
  } else {
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    hcStep = 0;
  }
}

// Reset overlay when leaving the slide
var hcObserver = new MutationObserver(function() {
  if (slides[7] && !slides[7].classList.contains('active')) {
    var overlay = document.getElementById('hc-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';
      hcStep = 0;
    }
  }
});
if (slides[7]) {
  hcObserver.observe(slides[7], { attributes: true, attributeFilter: ['class'] });
}

// FreightMath map code is in map.js
