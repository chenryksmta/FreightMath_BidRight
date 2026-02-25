/**
 * FreightMath BidRight — Presentation Configuration
 * Contains presentation metadata and section definitions
 */

// Presentation metadata
const presentationConfig = {
  title: "FreightMath BidRight — Interactive Primer & Demo",
  totalSlides: 22,
  sections: [
    { name: "Intro", startSlide: 0 },
    { name: "The Why", startSlide: 1 },
    { name: "The Bridge", startSlide: 7 },
    { name: "BidRight", startSlide: 8 },
    { name: "BidRight Story", startSlide: 9 },
    { name: "How It Works", startSlide: 13 },
    { name: "Next Steps", startSlide: 20 },
    { name: "Connect", startSlide: 21 }
  ]
};

// City coordinates for FreightMath OR map visualization
const cities = {
  deadhead:   { lat: 37.0842, lng: -94.5133, name: 'Joplin, MO' },
  coreOrigin: { lat: 39.0997, lng: -94.5786, name: 'Kansas City, MO' },
  coreDest:   { lat: 33.749,  lng: -84.388,  name: 'Atlanta, GA' },
  ib1: { lat: 41.2565, lng: -95.9345, name: 'Omaha' },
  ib2: { lat: 37.6872, lng: -97.3301, name: 'Wichita' },
  ib3: { lat: 38.627,  lng: -90.199,  name: 'St. Louis' },
  ib4: { lat: 41.5868, lng: -93.625,  name: 'Des Moines' },
  ob1: { lat: 35.2271, lng: -80.8431, name: 'Charlotte' },
  ob2: { lat: 30.3322, lng: -81.6557, name: 'Jacksonville' },
  ob3: { lat: 32.3668, lng: -86.3,    name: 'Montgomery' },
  ob4: { lat: 33.5207, lng: -86.8025, name: 'Birmingham' },
  ob5: { lat: 36.1627, lng: -86.7816, name: 'Nashville' }
};
