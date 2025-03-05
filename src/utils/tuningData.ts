
export interface TuningOption {
  id: string;
  name: string;
  strings: StringNote[];
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

// Common alternative tunings
export const TUNING_OPTIONS: TuningOption[] = [
  {
    id: "standard",
    name: "Standard (E A D G B E)",
    strings: STANDARD_TUNING
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
    ]
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
    ]
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
    ]
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
    ]
  }
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
