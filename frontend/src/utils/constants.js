export const EVENT_TYPES = [
  'Hackathon',
  'Workshop',
  'Meetup',
  'AI Workshop',
];

export const RADIUS_OPTIONS = [
  { label: '10 km', value: 10 },
  { label: '25 km', value: 25 },
  { label: '50 km', value: 50 },
  { label: '100 km', value: 100 },
  { label: 'Worldwide', value: null },
];

export const DEFAULT_CENTER = {
  lat: 12.9716, // Bangalore
  lng: 77.5946,
};

export const MAP_TILE_URL = 
  import.meta.env.VITE_MAP_TILE_URL || 
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
