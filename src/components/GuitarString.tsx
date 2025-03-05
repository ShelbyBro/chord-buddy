
import React, { useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { StringNote } from '@/utils/tuningData';

interface GuitarStringProps {
  stringData: StringNote;
  isActive: boolean;
  deviation: number | null;
  onClick: () => void;
}

const GuitarString: React.FC<GuitarStringProps> = ({
  stringData,
  isActive,
  deviation,
  onClick,
}) => {
  const stringRef = useRef<HTMLDivElement>(null);

  // Calculate the in-tune status
  const inTuneThreshold = 5; // cents
  const isInTune = deviation !== null && Math.abs(deviation) <= inTuneThreshold;
  const isTooLow = deviation !== null && deviation < -inTuneThreshold;
  const isTooHigh = deviation !== null && deviation > inTuneThreshold;

  // Apply vibration effect when string is selected
  useEffect(() => {
    if (isActive && stringRef.current) {
      stringRef.current.classList.add('string-vibrate');
      const timeout = setTimeout(() => {
        if (stringRef.current) {
          stringRef.current.classList.remove('string-vibrate');
        }
      }, 200);
      
      return () => clearTimeout(timeout);
    }
  }, [isActive, stringData.note]);

  return (
    <div
      ref={stringRef}
      onClick={onClick}
      className={cn(
        "string-container relative w-full h-20 rounded-lg mb-3 px-6 py-3 transition-all duration-300 cursor-pointer",
        "border flex items-center justify-between",
        "hover:shadow-md group",
        isActive 
          ? "glass-panel" 
          : "bg-white/50 dark:bg-black/20 border-gray-200 dark:border-gray-700",
        isActive && isInTune ? "ring-2 ring-green-500 dark:ring-green-400" : "",
        isActive && isTooLow ? "ring-2 ring-blue-500 dark:ring-blue-400" : "",
        isActive && isTooHigh ? "ring-2 ring-red-500 dark:ring-red-400" : "",
        isActive && "dark:active-string-glow"
      )}
    >
      <div className="flex items-center space-x-4">
        <div className={cn(
          "flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300",
          isActive 
            ? "bg-primary text-white" 
            : "bg-secondary text-foreground dark:bg-gray-800 dark:text-gray-200"
        )}>
          <span className="text-xl font-medium">{stringData.note}</span>
          <span className="text-xs align-top">{stringData.octave}</span>
        </div>
        
        <div className="text-left">
          <p className="text-sm font-medium dark:text-white">String {stringData.position}</p>
          <p className="text-xs text-muted-foreground">
            {stringData.frequency.toFixed(2)} Hz
          </p>
        </div>
      </div>
      
      {isActive && deviation !== null && (
        <div className="absolute right-0 top-0 bottom-0 flex items-center pr-6">
          <div className={cn(
            "flex flex-col items-center px-4 py-2 rounded-l-lg",
            isInTune ? "text-green-600 dark:text-green-400" : 
            isTooLow ? "text-blue-600 dark:text-blue-400" : 
            "text-red-600 dark:text-red-400"
          )}>
            <span className="text-sm font-medium">
              {deviation > 0 ? '+' : ''}{deviation} cents
            </span>
            <span className="text-xs">
              {isInTune 
                ? "In tune" 
                : isTooLow 
                  ? "Tune higher" 
                  : "Tune lower"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuitarString;
