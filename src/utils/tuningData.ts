
export interface TuningOption {
  id: string;
  name: string;
  strings: StringNote[];
  instrument: 'guitar' | 'ukulele';
}

export interface StringNote {
  note: string;
  frequency: number;
  octave: number;
  position: number;
}

// Standard guitar tuning frequencies in Hz
export const STANDARD_TUNING: StringNote[] = [
  { note: "E", frequency: 82.41, octave: 2, position: 6 },
  { note: "A", frequency: 110.00, octave: 2, position: 5 },
  { note: "D", frequency: 146.83, octave: 3, position: 4 },
  { note: "G", frequency: 196.00, octave: 3, position: 3 },
  { note: "B", frequency: 246.94, octave: 3, position: 2 },
  { note: "E", frequency: 329.63, octave: 4, position: 1 }
];

// Standard ukulele tuning (GCEA)
export const STANDARD_UKULELE_TUNING: StringNote[] = [
  { note: "G", frequency: 392.00, octave: 4, position: 4 },
  { note: "C", frequency: 261.63, octave: 4, position: 3 },
  { note: "E", frequency: 329.63, octave: 4, position: 2 },
  { note: "A", frequency: 440.00, octave: 4, position: 1 }
];

// Common guitar tunings
export const GUITAR_TUNING_OPTIONS: TuningOption[] = [
  {
    id: "standard",
    name: "Standard (E A D G B E)",
    strings: STANDARD_TUNING,
    instrument: 'guitar'
  },
  {
    id: "drop-d",
    name: "Drop D (D A D G B E)",
    strings: [
      { note: "D", frequency: 73.42, octave: 2, position: 6 },
      { note: "A", frequency: 110.00, octave: 2, position: 5 },
      { note: "D", frequency: 146.83, octave: 3, position: 4 },
      { note: "G", frequency: 196.00, octave: 3, position: 3 },
      { note: "B", frequency: 246.94, octave: 3, position: 2 },
      { note: "E", frequency: 329.63, octave: 4, position: 1 }
    ],
    instrument: 'guitar'
  },
  {
    id: "open-g",
    name: "Open G (D G D G B D)",
    strings: [
      { note: "D", frequency: 73.42, octave: 2, position: 6 },
      { note: "G", frequency: 98.00, octave: 2, position: 5 },
      { note: "D", frequency: 146.83, octave: 3, position: 4 },
      { note: "G", frequency: 196.00, octave: 3, position: 3 },
      { note: "B", frequency: 246.94, octave: 3, position: 2 },
      { note: "D", frequency: 293.66, octave: 4, position: 1 }
    ],
    instrument: 'guitar'
  },
  {
    id: "half-step-down",
    name: "Half Step Down (Eb Ab Db Gb Bb Eb)",
    strings: [
      { note: "Eb", frequency: 77.78, octave: 2, position: 6 },
      { note: "Ab", frequency: 103.83, octave: 2, position: 5 },
      { note: "Db", frequency: 138.59, octave: 3, position: 4 },
      { note: "Gb", frequency: 185.00, octave: 3, position: 3 },
      { note: "Bb", frequency: 233.08, octave: 3, position: 2 },
      { note: "Eb", frequency: 311.13, octave: 4, position: 1 }
    ],
    instrument: 'guitar'
  },
  {
    id: "open-d",
    name: "Open D (D A D F# A D)",
    strings: [
      { note: "D", frequency: 73.42, octave: 2, position: 6 },
      { note: "A", frequency: 110.00, octave: 2, position: 5 },
      { note: "D", frequency: 146.83, octave: 3, position: 4 },
      { note: "F#", frequency: 185.00, octave: 3, position: 3 },
      { note: "A", frequency: 220.00, octave: 3, position: 2 },
      { note: "D", frequency: 293.66, octave: 4, position: 1 }
    ],
    instrument: 'guitar'
  }
];

// Common ukulele tunings
export const UKULELE_TUNING_OPTIONS: TuningOption[] = [
  {
    id: "standard-ukulele",
    name: "Standard (G C E A)",
    strings: STANDARD_UKULELE_TUNING,
    instrument: 'ukulele'
  },
  {
    id: "d-tuning",
    name: "D Tuning (A D F# B)",
    strings: [
      { note: "A", frequency: 440.00, octave: 4, position: 4 },
      { note: "D", frequency: 293.66, octave: 4, position: 3 },
      { note: "F#", frequency: 369.99, octave: 4, position: 2 },
      { note: "B", frequency: 493.88, octave: 4, position: 1 }
    ],
    instrument: 'ukulele'
  },
  {
    id: "baritone",
    name: "Baritone (D G B E)",
    strings: [
      { note: "D", frequency: 146.83, octave: 3, position: 4 },
      { note: "G", frequency: 196.00, octave: 3, position: 3 },
      { note: "B", frequency: 246.94, octave: 3, position: 2 },
      { note: "E", frequency: 329.63, octave: 4, position: 1 }
    ],
    instrument: 'ukulele'
  },
  {
    id: "low-g",
    name: "Low G (G C E A)",
    strings: [
      { note: "G", frequency: 196.00, octave: 3, position: 4 },
      { note: "C", frequency: 261.63, octave: 4, position: 3 },
      { note: "E", frequency: 329.63, octave: 4, position: 2 },
      { note: "A", frequency: 440.00, octave: 4, position: 1 }
    ],
    instrument: 'ukulele'
  }
];

// Combined tuning options
export const TUNING_OPTIONS: TuningOption[] = [
  ...GUITAR_TUNING_OPTIONS,
  ...UKULELE_TUNING_OPTIONS
];

// Find closest note to a given frequency
export const findClosestNote = (
  frequency: number,
  tuning: StringNote[] = STANDARD_TUNING
): { note: StringNote; cents: number } | null => {
  if (!frequency || frequency < 20 || frequency > 1000) {
    return null;
  }

  let closestNote: StringNote | null = null;
  let minDistance = Infinity;

  tuning.forEach((note) => {
    const distance = Math.abs(Math.log2(frequency / note.frequency));
    if (distance < minDistance) {
      minDistance = distance;
      closestNote = note;
    }
  });

  if (!closestNote) return null;

  // Calculate cents deviation (100 cents = 1 semitone)
  const cents = Math.round(
    1200 * Math.log2(frequency / closestNote.frequency)
  );

  return { note: closestNote, cents };
};

// Standard concert pitch reference
export const CONCERT_A_FREQUENCY = 440;

// Calculate adjusted frequencies for all notes based on the reference A
export const adjustTuningToReference = (
  tuning: StringNote[],
  referenceFrequency: number
): StringNote[] => {
  // The ratio to apply to all frequencies
  const ratio = referenceFrequency / CONCERT_A_FREQUENCY;
  
  return tuning.map(string => ({
    ...string,
    frequency: string.frequency * ratio
  }));
};
