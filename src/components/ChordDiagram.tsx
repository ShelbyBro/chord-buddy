
import React from 'react';
import { ChordDefinition } from '@/utils/chordData';

interface ChordDiagramProps {
  chord: ChordDefinition;
}

const ChordDiagram: React.FC<ChordDiagramProps> = ({ chord }) => {
  // Define the grid dimensions based on the instrument
  const stringCount = chord.instrument === 'guitar' ? 6 : 4;
  const fretCount = 4;
  
  // Calculate diagram dimensions
  const fretWidth = chord.instrument === 'guitar' ? 40 : 48;
  const stringSpacing = chord.instrument === 'guitar' ? 10 : 16;
  const fretHeight = 22;
  const dotRadius = 8;
  
  // Calculate total dimensions
  const width = (stringCount - 1) * stringSpacing + 24;
  const height = fretCount * fretHeight + 40;
  
  // Finger position labels
  const fingerLabels = ['T', '1', '2', '3', '4'];

  return (
    <div className="flex flex-col items-center mx-2 my-3 rounded-md bg-white/10 backdrop-blur-sm border border-white/10 p-3 hover:border-primary/50 transition-all duration-300">
      <h3 className="text-sm font-medium mb-2 text-white">{chord.name}</h3>
      <div className="relative" style={{ width: `${width}px`, height: `${height}px` }}>
        {/* Render frets (horizontal lines) */}
        {Array.from({ length: fretCount + 1 }).map((_, fretIndex) => (
          <div
            key={`fret-${fretIndex}`}
            className={`absolute left-0 right-0 bg-gray-400 dark:bg-gray-600 ${fretIndex === 0 ? 'h-[2px]' : 'h-[1px]'}`}
            style={{
              top: `${fretIndex * fretHeight + 20}px`,
              width: `${width}px`,
            }}
          />
        ))}
        
        {/* Render strings (vertical lines) */}
        {Array.from({ length: stringCount }).map((_, stringIndex) => (
          <div
            key={`string-${stringIndex}`}
            className="absolute top-20 bottom-0 w-[1px] bg-gray-500 dark:bg-gray-400"
            style={{
              left: `${stringIndex * stringSpacing + 12}px`,
              height: `${fretHeight * fretCount}px`,
            }}
          />
        ))}
        
        {/* Render muted and open strings */}
        {Array.from({ length: stringCount }).map((_, stringIndex) => {
          const actualStringNumber = stringCount - stringIndex;
          const isMuted = chord.mutedStrings.includes(actualStringNumber);
          const isOpen = chord.openStrings.includes(actualStringNumber);
          
          return (
            <React.Fragment key={`string-top-${stringIndex}`}>
              {isMuted && (
                <div className="absolute text-xs text-red-500 font-bold" 
                  style={{ left: `${stringIndex * stringSpacing + 8.5}px`, top: '0px' }}>
                  ×
                </div>
              )}
              {isOpen && (
                <div className="absolute rounded-full border-2 border-gray-500 w-4 h-4" 
                  style={{ left: `${stringIndex * stringSpacing + 4}px`, top: '2px' }}>
                </div>
              )}
            </React.Fragment>
          );
        })}
        
        {/* Render finger positions */}
        {chord.positions
          .filter(pos => pos.fret > 0)
          .map((position, index) => {
            // Convert string number to position (1 is right, 6 is left for guitar)
            const stringIndex = stringCount - position.string;
            const fretIndex = position.fret - chord.baseFret + 1;
            if (fretIndex < 1) return null; // Skip if out of visible range
            
            return (
              <div
                key={`position-${index}`}
                className="absolute flex items-center justify-center rounded-full bg-primary text-white text-xs"
                style={{
                  left: `${stringIndex * stringSpacing + (12 - dotRadius)}px`,
                  top: `${(fretIndex - 0.5) * fretHeight + 20 - dotRadius}px`,
                  width: `${dotRadius * 2}px`,
                  height: `${dotRadius * 2}px`,
                }}
              >
                {position.finger > 0 ? position.finger : ''}
              </div>
            );
        })}
        
        {/* Display base fret if not 1 */}
        {chord.baseFret > 1 && (
          <div className="absolute text-xs text-gray-500 dark:text-gray-400" 
            style={{ left: `${-24}px`, top: `${fretHeight + 16}px` }}>
            {chord.baseFret}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChordDiagram;
