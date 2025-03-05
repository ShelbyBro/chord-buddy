
import React from 'react';
import { ChordDefinition, getChordsByInstrument } from '@/utils/chordData';
import ChordDiagram from './ChordDiagram';
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChordSelectorProps {
  instrument: 'guitar' | 'ukulele';
}

const ChordSelector: React.FC<ChordSelectorProps> = ({ instrument }) => {
  const chords = getChordsByInstrument(instrument);
  
  return (
    <div className="rounded-lg bg-black/30 backdrop-blur-md border border-gray-700 p-4 mb-6 overflow-hidden">
      <h2 className="text-sm font-semibold text-white mb-3">
        Basic {instrument === 'guitar' ? 'Guitar' : 'Ukulele'} Chords
      </h2>
      
      <ScrollArea className="h-[200px] pr-4">
        <div className="flex flex-wrap justify-center gap-2">
          {chords.map((chord) => (
            <ChordDiagram key={chord.id} chord={chord} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChordSelector;
