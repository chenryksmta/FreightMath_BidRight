/**
 * FreightMath Presentation Configuration
 * Contains slide definitions and map city coordinates
 */

// City coordinates for map visualization
const cities = {
  coreOrigin: { lat: 35.05, lng: -97.95, name: 'Oklahoma City, OK', label: 'Core Origin' },
  coreDest:   { lat: 35.15, lng: -90.05, name: 'Memphis, TN', label: 'Core Destination' },
  // Deadhead point (before pickup)
  deadhead:   { lat: 36.15, lng: -95.99, name: 'Tulsa, OK' },
  // Inbound loads (coming INTO core origin market)
  ib1: { lat: 39.10, lng: -94.58, name: 'Kansas City, MO' },
  ib2: { lat: 32.75, lng: -96.80, name: 'Dallas, TX' },
  ib3: { lat: 30.27, lng: -97.74, name: 'Austin, TX' },
  ib4: { lat: 37.69, lng: -97.34, name: 'Wichita, KS' },
  // Outbound loads (going OUT of core dest market)
  ob1: { lat: 36.16, lng: -86.78, name: 'Nashville, TN' },
  ob2: { lat: 33.75, lng: -84.39, name: 'Atlanta, GA' },
  ob3: { lat: 32.30, lng: -90.18, name: 'Jackson, MS' },
  ob4: { lat: 38.63, lng: -90.20, name: 'St. Louis, MO' },
  ob5: { lat: 30.33, lng: -87.69, name: 'Mobile, AL' }
};

// Presentation metadata
const presentationConfig = {
  title: "Driven to Adapt — FreightMath by KSM Transport Advisors",
  totalSlides: 23,
  sections: [
    { name: "Intro", startSlide: 0 },
    { name: "Agenda", startSlide: 1 },
    { name: "Trait 1", startSlide: 2 },
    { name: "Trait 2", startSlide: 3 },
    { name: "Trait 3", startSlide: 4 },
    { name: "Network", startSlide: 5 },
    { name: "Power Lanes", startSlide: 7 },
    { name: "FreightMath", startSlide: 8 },
    // Add more sections as needed
  ]
};
