/**
 * FreightMath Map Visualization
 * Leaflet-based interactive map showing freight network routes
 * Dependencies: config.js (cities data), Leaflet library
 */

// Map instance and state
let fmMap = null;
let fmCurrentStep = 'core';
let fmAnimationTimers = [];
let fmLayers = { core: [], inbound: [], outbound: [], freightmath: [] };
let fmMarkers = { core: [], inbound: [], outbound: [], freightmath: [] };


function initFMMap() {
  if (fmMap) return;
  
  const mapEl = document.getElementById('fm-map');
  if (!mapEl || mapEl.offsetWidth === 0) return;
  
  fmMap = L.map('fm-map', {
    center: [36.5, -93],
    zoom: 5,
    zoomControl: false,
    attributionControl: false,
    scrollWheelZoom: false,
    dragging: true,
    minZoom: 4,
    maxZoom: 8
  });
  
  // Use CartoDB Voyager (dark, shows states clearly)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    subdomains: 'abcd'
  }).addTo(fmMap);
  
  // Fetch and render US state boundaries
  fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json')
    .then(r => r.json())
    .then(data => {
      L.geoJSON(data, {
        style: {
          fillColor: '#0d2d6e',
          fillOpacity: 0.4,
          color: '#96BCE4',
          weight: 1,
          opacity: 0.5
        }
      }).addTo(fmMap);
      // Re-show current step on top of states
      showFMStep(fmCurrentStep);
    })
    .catch(() => {
      // Fallback: draw simplified US outline if fetch fails
      drawUSOutline();
    });
  
  // Add zoom control to bottom-left
  L.control.zoom({ position: 'bottomleft' }).addTo(fmMap);
  
  // Build all layers
  buildCoreLayers();
  buildInboundLayers();
  buildOutboundLayers();
  buildFreightMathLayers();
  
  // Show initial step
  showFMStep('core');
}

function createPulseIcon(color, size) {
  return L.divIcon({
    className: 'fm-pulse-marker',
    html: `<div style="
      width:${size}px;height:${size}px;
      background:${color};
      border-radius:50%;
      border:2px solid white;
      box-shadow:0 0 12px ${color}88, 0 0 24px ${color}44;
      animation: fmPulse 2s ease infinite;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2]
  });
}

function createLabelIcon(text, color) {
  return L.divIcon({
    className: 'fm-label-marker',
    html: `<div style="
      background:${color};
      color:white;
      font-family:var(--font-body);
      font-size:11px;
      font-weight:700;
      padding:4px 10px;
      border-radius:6px;
      white-space:nowrap;
      box-shadow:0 2px 8px rgba(0,0,0,0.4);
      transform:translateY(-24px);
    ">${text}</div>`,
    iconSize: [0, 0]
  });
}

function createCityIcon(color, size) {
  size = size || 10;
  return L.divIcon({
    className: 'fm-city-marker',
    html: `<div style="
      width:${size}px;height:${size}px;
      background:${color};
      border-radius:50%;
      border:2px solid white;
      box-shadow:0 0 8px ${color}66;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2]
  });
}

function animatedPolyline(from, to, color, dashed, delay, duration) {
  const latlngs = [
    [from.lat, from.lng],
    [to.lat, to.lng]
  ];
  const line = L.polyline(latlngs, {
    color: color,
    weight: dashed ? 2.5 : 3,
    opacity: 0,
    dashArray: dashed ? '8 6' : null,
    lineCap: 'round'
  });
  
  // Animate in
  const timer = setTimeout(() => {
    line.setStyle({ opacity: 0.85 });
    // Animate a truck dot along the path
    animateDot(from, to, color, duration || 1200);
  }, delay || 0);
  fmAnimationTimers.push(timer);
  
  return line;
}

function animateDot(from, to, color, duration) {
  if (!fmMap) return;
  const dot = L.circleMarker([from.lat, from.lng], {
    radius: 4,
    color: color,
    fillColor: 'white',
    fillOpacity: 1,
    weight: 2
  }).addTo(fmMap);
  
  const startTime = Date.now();
  function moveDot() {
    const elapsed = Date.now() - startTime;
    const t = Math.min(elapsed / duration, 1);
    const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    const lat = from.lat + (to.lat - from.lat) * ease;
    const lng = from.lng + (to.lng - from.lng) * ease;
    dot.setLatLng([lat, lng]);
    if (t < 1) {
      requestAnimationFrame(moveDot);
    } else {
      setTimeout(() => fmMap.removeLayer(dot), 300);
    }
  }
  requestAnimationFrame(moveDot);
}

function createRouteInfoIcon(text, borderColor) {
  return L.divIcon({
    className: 'fm-route-info',
    html: `<div style="
      background:rgba(15,23,42,0.92);
      color:#e2e8f0;
      font-family:var(--font-body);
      font-size:10px;
      font-weight:600;
      padding:3px 8px;
      border-radius:4px;
      white-space:nowrap;
      border-left:3px solid ${borderColor};
      box-shadow:0 2px 8px rgba(0,0,0,0.5);
      transform:translateY(-20px);
    ">${text}</div>`,
    iconSize: [0, 0]
  });
}

function midpoint(a, b) {
  return [(a.lat + b.lat) / 2, (a.lng + b.lng) / 2];
}

function buildCoreLayers() {
  const c = cities;
  // Deadhead (dashed) from Joplin to KC
  fmLayers.core.push(animatedPolyline(c.deadhead, c.coreOrigin, '#EC433D', true, 0, 0));
  fmLayers.core[0].setStyle({opacity: 0});

  // Loaded (solid) from KC to Atlanta
  fmLayers.core.push(animatedPolyline(c.coreOrigin, c.coreDest, '#E26E17', false, 0, 0));
  fmLayers.core[1].setStyle({opacity: 0});

  // City markers
  fmMarkers.core.push(L.marker([c.deadhead.lat, c.deadhead.lng], { icon: createCityIcon('#EC433D', 8) }));
  fmMarkers.core.push(L.marker([c.coreOrigin.lat, c.coreOrigin.lng], { icon: createPulseIcon('#4EA700', 16) }));
  fmMarkers.core.push(L.marker([c.coreDest.lat, c.coreDest.lng], { icon: createPulseIcon('#2C78C9', 16) }));
  // City name labels
  fmMarkers.core.push(L.marker([c.deadhead.lat, c.deadhead.lng], { icon: createLabelIcon(c.deadhead.name + ' (Prior)', '#EC433D') }));
  fmMarkers.core.push(L.marker([c.coreOrigin.lat, c.coreOrigin.lng], { icon: createLabelIcon(c.coreOrigin.name + ' (Origin)', '#4EA700') }));
  fmMarkers.core.push(L.marker([c.coreDest.lat, c.coreDest.lng], { icon: createLabelIcon(c.coreDest.name + ' (Dest)', '#2C78C9') }));
  // Route info labels at midpoints
  fmMarkers.core.push(L.marker(midpoint(c.deadhead, c.coreOrigin), { icon: createRouteInfoIcon('160 mi &middot; Empty', '#EC433D') }));
  fmMarkers.core.push(L.marker(midpoint(c.coreOrigin, c.coreDest), { icon: createRouteInfoIcon('802 mi &middot; $26 Tolls', '#E26E17') }));
}

// Inbound: mix of loaded (solid) and empty (dashed) movements into Origin
// Solid = loaded freight flowing in, Dashed = empty repositioning in
function buildInboundLayers() {
  const c = cities;
  const ibRoutes = [
    { city: c.ib1, dashed: false },  // Omaha — loaded
    { city: c.ib2, dashed: true },   // Wichita — empty
    { city: c.ib3, dashed: false },  // St. Louis — loaded
    { city: c.ib4, dashed: false }   // Des Moines — loaded
  ];
  ibRoutes.forEach(r => {
    fmLayers.inbound.push(animatedPolyline(r.city, c.coreOrigin, '#4EA700', r.dashed, 0, 0));
    fmLayers.inbound[fmLayers.inbound.length-1].setStyle({opacity:0});
    fmMarkers.inbound.push(L.marker([r.city.lat, r.city.lng], { icon: createCityIcon(r.dashed ? '#64748b' : '#4EA700', 10) }));
  });
  fmMarkers.inbound.push(L.marker([c.coreOrigin.lat, c.coreOrigin.lng], { icon: createPulseIcon('#4EA700', 18) }));
  fmMarkers.inbound.push(L.marker([c.coreOrigin.lat, c.coreOrigin.lng], { icon: createLabelIcon(c.coreOrigin.name + ' (Origin)', '#4EA700') }));
}

// Outbound: mix of loaded (solid) and empty (dashed) movements from Destination
// Solid = truck finds freight leaving dest, Dashed = truck deadheads out
function buildOutboundLayers() {
  const c = cities;
  const obRoutes = [
    { city: c.ob1, dashed: true },   // Charlotte — empty
    { city: c.ob2, dashed: false },  // Jacksonville — loaded
    { city: c.ob3, dashed: true },   // Montgomery — empty
    { city: c.ob4, dashed: true },   // Birmingham — empty
    { city: c.ob5, dashed: false }   // Nashville — loaded
  ];
  obRoutes.forEach(r => {
    fmLayers.outbound.push(animatedPolyline(c.coreDest, r.city, '#2C78C9', r.dashed, 0, 0));
    fmLayers.outbound[fmLayers.outbound.length-1].setStyle({opacity:0});
    fmMarkers.outbound.push(L.marker([r.city.lat, r.city.lng], { icon: createCityIcon(r.dashed ? '#64748b' : '#2C78C9', 10) }));
  });
  fmMarkers.outbound.push(L.marker([c.coreDest.lat, c.coreDest.lng], { icon: createPulseIcon('#2C78C9', 18) }));
  fmMarkers.outbound.push(L.marker([c.coreDest.lat, c.coreDest.lng], { icon: createLabelIcon(c.coreDest.name + ' (Dest)', '#2C78C9') }));
}

function buildFreightMathLayers() {
  const c = cities;
  // Core route
  fmLayers.freightmath.push(animatedPolyline(c.deadhead, c.coreOrigin, '#EC433D', true, 0, 0));
  fmLayers.freightmath[0].setStyle({opacity:0});
  fmLayers.freightmath.push(animatedPolyline(c.coreOrigin, c.coreDest, '#E26E17', false, 0, 0));
  fmLayers.freightmath[1].setStyle({opacity:0});

  // Inbound routes (matching loaded/empty mix)
  [
    { city: c.ib1, dashed: false },
    { city: c.ib2, dashed: true },
    { city: c.ib3, dashed: false },
    { city: c.ib4, dashed: false }
  ].forEach(r => {
    fmLayers.freightmath.push(animatedPolyline(r.city, c.coreOrigin, '#4EA700', r.dashed, 0, 0));
    fmLayers.freightmath[fmLayers.freightmath.length-1].setStyle({opacity:0});
    fmMarkers.freightmath.push(L.marker([r.city.lat, r.city.lng], { icon: createCityIcon(r.dashed ? '#64748b' : '#4EA700', 8) }));
  });

  // Outbound routes (matching loaded/empty mix)
  [
    { city: c.ob1, dashed: true },
    { city: c.ob2, dashed: false },
    { city: c.ob3, dashed: true },
    { city: c.ob4, dashed: true },
    { city: c.ob5, dashed: false }
  ].forEach(r => {
    fmLayers.freightmath.push(animatedPolyline(c.coreDest, r.city, '#2C78C9', r.dashed, 0, 0));
    fmLayers.freightmath[fmLayers.freightmath.length-1].setStyle({opacity:0});
    fmMarkers.freightmath.push(L.marker([r.city.lat, r.city.lng], { icon: createCityIcon(r.dashed ? '#64748b' : '#2C78C9', 8) }));
  });

  // Core markers
  fmMarkers.freightmath.push(L.marker([c.deadhead.lat, c.deadhead.lng], { icon: createCityIcon('#EC433D', 7) }));
  fmMarkers.freightmath.push(L.marker([c.coreOrigin.lat, c.coreOrigin.lng], { icon: createPulseIcon('#4EA700', 16) }));
  fmMarkers.freightmath.push(L.marker([c.coreDest.lat, c.coreDest.lng], { icon: createPulseIcon('#2C78C9', 16) }));
  fmMarkers.freightmath.push(L.marker([c.coreOrigin.lat, c.coreOrigin.lng], { icon: createLabelIcon(c.coreOrigin.name, '#4EA700') }));
  fmMarkers.freightmath.push(L.marker([c.coreDest.lat, c.coreDest.lng], { icon: createLabelIcon(c.coreDest.name, '#2C78C9') }));
}

function clearFMLayers() {
  fmAnimationTimers.forEach(t => clearTimeout(t));
  fmAnimationTimers = [];
  ['core','inbound','outbound','freightmath'].forEach(step => {
    fmLayers[step].forEach(l => { if(fmMap.hasLayer(l)) fmMap.removeLayer(l); });
    fmMarkers[step].forEach(m => { if(fmMap.hasLayer(m)) fmMap.removeLayer(m); });
  });
}

function showFMStep(step) {
  if (!fmMap) return;
  fmCurrentStep = step;
  clearFMLayers();
  
  // Update sidebar active state
  document.querySelectorAll('.fm-step').forEach(el => {
    el.classList.toggle('active', el.dataset.step === step);
  });
  
  // Add layers for this step
  fmLayers[step].forEach(l => l.addTo(fmMap));
  fmMarkers[step].forEach(m => m.addTo(fmMap));
  
  // Animate lines in with stagger
  fmLayers[step].forEach((line, i) => {
    const timer = setTimeout(() => {
      line.setStyle({ opacity: 0.85 });
      // Get the coords for animation
      const coords = line.getLatLngs();
      if (coords.length >= 2) {
        const from = { lat: coords[0].lat, lng: coords[0].lng };
        const to = { lat: coords[coords.length-1].lat, lng: coords[coords.length-1].lng };
        animateDot(from, to, line.options.color, 1000 + i * 200);
      }
    }, 200 + i * 400);
    fmAnimationTimers.push(timer);
  });
  
  // Fit map bounds
  const bounds = [];
  fmMarkers[step].forEach(m => bounds.push(m.getLatLng()));
  if (bounds.length > 1) {
    fmMap.fitBounds(L.latLngBounds(bounds).pad(0.15), { animate: true, duration: 0.8 });
  }


  // Highlight corresponding OR card
  document.querySelectorAll('.or-card').forEach(c => c.classList.remove('active'));
  const cardMap = {core:'or-card-core', inbound:'or-card-inbound', outbound:'or-card-outbound', freightmath:'or-card-fm'};
  if (step === 'freightmath') {
    document.querySelectorAll('.or-card').forEach(c => c.classList.add('active'));
  } else {
    const card = document.getElementById(cardMap[step]);
    if (card) card.classList.add('active');
  }
}

function autoPlayFM() {
  const steps = ['core', 'inbound', 'outbound', 'freightmath'];
  let i = 0;
  showFMStep(steps[0]);
  const interval = setInterval(() => {
    i++;
    if (i >= steps.length) {
      clearInterval(interval);
      return;
    }
    showFMStep(steps[i]);
  }, 3000);
  fmAnimationTimers.push(interval);
}

// Add CSS animation for pulse
const pulseStyle = document.createElement('style');
pulseStyle.textContent = `
  @keyframes fmPulse {
    0%, 100% { box-shadow: 0 0 12px currentColor; transform: scale(1); }
    50% { box-shadow: 0 0 24px currentColor, 0 0 48px currentColor; transform: scale(1.1); }
  }
  .fm-pulse-marker div { animation: fmPulse 2s ease infinite; }
  .leaflet-container { background: #0A2463 !important; }
  .leaflet-tile-pane { opacity: 0.7; }
`;
document.head.appendChild(pulseStyle);

function drawUSOutline() {
  // Simplified continental US outline as fallback
  const usOutline = [
    [49,-124.7],[48.4,-124.6],[46.3,-124.1],[43.4,-124.4],[42,-124.3],[40.4,-124.4],
    [38.9,-123.7],[37.8,-122.5],[36.8,-121.8],[34.5,-120.6],[33.9,-118.4],[32.5,-117.1],
    [32.7,-114.7],[31.3,-111],[31.3,-108.2],[31.8,-106.6],[29.8,-104.4],[29.5,-103],
    [28.9,-103],[28.5,-100.5],[26,-97.2],[27.8,-97],[28.8,-96],[29.7,-94.5],
    [29.3,-89.6],[30,-88.8],[30.2,-86.5],[29.7,-85],[29.9,-83.5],[27.5,-82.5],
    [25,-81],[25,-80.1],[27,-80],[30.5,-81.2],[32,-80.8],[34,-77.9],[35.2,-75.5],
    [37,-75.6],[38.5,-75.1],[39.5,-74.3],[40.5,-74],[41.3,-72],[42,-70],[43.5,-70],
    [44.8,-67],[47,-67.8],[47.4,-69.2],[45,-71.5],[45,-73.4],[45,-75],[43,-79],
    [42.5,-82.5],[41.7,-83],[42,-87.5],[46.5,-84.5],[47.5,-88],[47,-90],[48.8,-95.2],
    [49,-97],[49,-104],[49,-117],[49,-124.7]
  ];
  L.polygon(usOutline.map(c => [c[0], c[1]]), {
    fillColor: '#0d2d6e',
    fillOpacity: 0.5,
    color: '#96BCE4',
    weight: 1.5,
    opacity: 0.6
  }).addTo(fmMap);
}
