
export interface ChordPosition {
  fret: number;
  string: number;
  finger: number;
}

export interface ChordDefinition {
  id: string;
  name: string;
  positions: ChordPosition[];
  openStrings: number[];
  mutedStrings: number[];
  baseFret: number;
  instrument: 'guitar' | 'ukulele';
}

// Guitar chord definitions
const GUITAR_CHORDS: ChordDefinition[] = [
  {
    id: "g-major",
    name: "G Major",
    positions: [
      { fret: 3, string: 6, finger: 3 },
      { fret: 2, string: 5, finger: 2 },
      { fret: 0, string: 4, finger: 0 },
      { fret: 0, string: 3, finger: 0 },
      { fret: 0, string: 2, finger: 0 },
      { fret: 3, string: 1, finger: 4 },
    ],
    openStrings: [1, 2, 3, 4],
    mutedStrings: [],
    baseFret: 1,
    instrument: 'guitar'
  },
  {
    id: "c-major",
    name: "C Major",
    positions: [
      { fret: 0, string: 5, finger: 0 },
      { fret: 3, string: 5, finger: 3 },
      { fret: 2, string: 4, finger: 2 },
      { fret: 0, string: 3, finger: 0 },
      { fret: 1, string: 2, finger: 1 },
      { fret: 0, string: 1, finger: 0 },
    ],
    openStrings: [1, 3, 5],
    mutedStrings: [6],
    baseFret: 1,
    instrument: 'guitar'
  },
  {
    id: "d-major",
    name: "D Major",
    positions: [
      { fret: 2, string: 4, finger: 1 },
      { fret: 3, string: 3, finger: 3 },
      { fret: 2, string: 2, finger: 2 },
      { fret: 0, string: 1, finger: 0 },
    ],
    openStrings: [1],
    mutedStrings: [5, 6],
    baseFret: 1,
    instrument: 'guitar'
  },
  {
    id: "a-major",
    name: "A Major",
    positions: [
      { fret: 0, string: 5, finger: 0 },
      { fret: 2, string: 4, finger: 2 },
      { fret: 2, string: 3, finger: 3 },
      { fret: 2, string: 2, finger: 4 },
      { fret: 0, string: 1, finger: 0 },
    ],
    openStrings: [1, 5],
    mutedStrings: [6],
    baseFret: 1,
    instrument: 'guitar'
  },
  {
    id: "e-major",
    name: "E Major",
    positions: [
      { fret: 0, string: 6, finger: 0 },
      { fret: 2, string: 5, finger: 2 },
      { fret: 2, string: 4, finger: 3 },
      { fret: 1, string: 3, finger: 1 },
      { fret: 0, string: 2, finger: 0 },
      { fret: 0, string: 1, finger: 0 },
    ],
    openStrings: [1, 2, 6],
    mutedStrings: [],
    baseFret: 1,
    instrument: 'guitar'
  }
];

// Ukulele chord definitions
const UKULELE_CHORDS: ChordDefinition[] = [
  {
    id: "c-major-ukulele",
    name: "C Major",
    positions: [
      { fret: 0, string: 4, finger: 0 },
      { fret: 0, string: 3, finger: 0 },
      { fret: 0, string: 2, finger: 0 },
      { fret: 3, string: 1, finger: 3 },
    ],
    openStrings: [2, 3, 4],
    mutedStrings: [],
    baseFret: 1,
    instrument: 'ukulele'
  },
  {
    id: "g-major-ukulele",
    name: "G Major",
    positions: [
      { fret: 0, string: 4, finger: 0 },
      { fret: 2, string: 3, finger: 1 },
      { fret: 3, string: 2, finger: 3 },
      { fret: 2, string: 1, finger: 2 },
    ],
    openStrings: [4],
    mutedStrings: [],
    baseFret: 1,
    instrument: 'ukulele'
  },
  {
    id: "f-major-ukulele",
    name: "F Major",
    positions: [
      { fret: 2, string: 4, finger: 2 },
      { fret: 0, string: 3, finger: 0 },
      { fret: 1, string: 2, finger: 1 },
      { fret: 0, string: 1, finger: 0 },
    ],
    openStrings: [1, 3],
    mutedStrings: [],
    baseFret: 1,
    instrument: 'ukulele'
  },
  {
    id: "am-ukulele",
    name: "A Minor",
    positions: [
      { fret: 2, string: 4, finger: 2 },
      { fret: 0, string: 3, finger: 0 },
      { fret: 0, string: 2, finger: 0 },
      { fret: 0, string: 1, finger: 0 },
    ],
    openStrings: [1, 2, 3],
    mutedStrings: [],
    baseFret: 1,
    instrument: 'ukulele'
  }
];

// Combined chord collections
export const ALL_CHORDS: ChordDefinition[] = [
  ...GUITAR_CHORDS,
  ...UKULELE_CHORDS
];

// Get chords for a specific instrument
export const getChordsByInstrument = (instrument: 'guitar' | 'ukulele'): ChordDefinition[] => {
  return ALL_CHORDS.filter(chord => chord.instrument === instrument);
};
