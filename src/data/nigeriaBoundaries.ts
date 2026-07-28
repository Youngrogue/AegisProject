export interface StateBoundary {
  name: string;
  code: string;
  center: [number, number]; // [lat, lng]
  coordinates: [number, number][][]; // Polygon outer ring
}

// Simplified high-level state boundaries for map overlays
export const NIGERIA_STATES: StateBoundary[] = [
  {
    name: 'Borno',
    code: 'BO',
    center: [11.8333, 13.1500],
    coordinates: [[
      [13.8, 11.2], [14.6, 11.8], [14.1, 13.7], [12.8, 13.8], [11.5, 12.5], [11.8, 11.2], [13.8, 11.2]
    ]]
  },
  {
    name: 'Kaduna',
    code: 'KD',
    center: [10.5167, 7.4333],
    coordinates: [[
      [9.5, 6.2], [11.2, 6.3], [11.5, 8.8], [9.8, 8.6], [9.5, 6.2]
    ]]
  },
  {
    name: 'Zamfara',
    code: 'ZA',
    center: [12.1667, 6.6667],
    coordinates: [[
      [11.2, 5.8], [13.1, 5.9], [13.2, 7.2], [11.5, 7.1], [11.2, 5.8]
    ]]
  },
  {
    name: 'Plateau',
    code: 'PL',
    center: [9.9167, 8.9000],
    coordinates: [[
      [8.8, 8.3], [10.2, 8.5], [10.1, 10.1], [8.9, 9.8], [8.8, 8.3]
    ]]
  },
  {
    name: 'Benue',
    code: 'BN',
    center: [7.7333, 8.5333],
    coordinates: [[
      [6.8, 7.5], [8.2, 7.8], [8.3, 9.8], [6.9, 9.5], [6.8, 7.5]
    ]]
  },
  {
    name: 'Niger',
    code: 'NI',
    center: [10.0000, 6.0000],
    coordinates: [[
      [8.5, 4.2], [11.3, 4.5], [11.4, 7.2], [8.8, 7.1], [8.5, 4.2]
    ]]
  },
  {
    name: 'Rivers',
    code: 'RI',
    center: [4.7500, 6.8333],
    coordinates: [[
      [4.3, 6.4], [5.2, 6.5], [5.1, 7.4], [4.2, 7.3], [4.3, 6.4]
    ]]
  },
  {
    name: 'Federal Capital Territory',
    code: 'FC',
    center: [8.8333, 7.1667],
    coordinates: [[
      [8.4, 6.7], [9.2, 6.8], [9.2, 7.6], [8.4, 7.5], [8.4, 6.7]
    ]]
  }
];
