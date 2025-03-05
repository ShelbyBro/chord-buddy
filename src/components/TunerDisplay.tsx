
import React, { useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";

interface TunerDisplayProps {
  currentNote: string | null;
  currentFrequency: number | null;
  targetFrequency: number | null;
  cents: number | null;
  isListening: boolean;
}

const TunerDisplay: React.FC<TunerDisplayProps> = ({ 
  currentNote, 
  currentFrequency, 
  targetFrequency,
  cents,
  isListening 
}) => {
  const needleRef = useRef<HTMLDivElement>(null);
  
  // Update needle position based on cents deviation
  useEffect(() => {
    if (needleRef.current && cents !== null) {
      // Limit the range to -50 to +50 cents for display
      const limitedCents = Math.max(-50, Math.min(50, cents));
      // Convert cents to degrees (50 cents = 45 degrees)
      const degrees = (limitedCents / 50) * 45;
      needleRef.current.style.transform = `rotate(${degrees}deg)`;
    } else if (needleRef.current) {
      // Reset to center when no data
      needleRef.current.style.transform = 'rotate(0deg)';
    }
  }, [cents]);

  // Determine colors and status
  const inTuneThreshold = 5; // cents
  const isInTune = cents !== null && Math.abs(cents) <= inTuneThreshold;
  const isTooLow = cents !== null && cents < -inTuneThreshold;
  const isTooHigh = cents !== null && cents > inTuneThreshold;
  
  // Display status message
  const getStatusMessage = () => {
    if (!isListening) return "Tap to start";
    if (!currentNote) return "Play a string";
    if (isInTune) return "In tune";
    if (isTooLow) return "Too low";
    if (isTooHigh) return "Too high";
    return "Tuning...";
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="tuner-display relative h-60 bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 rounded-b-lg shadow-lg dark:shadow-black/30 overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Tuner scale */}
        <div className="absolute top-0 left-0 right-0 h-full flex items-center justify-center pointer-events-none">
          <div className="w-full h-1/2 relative">
            {/* Scale marks */}
            <div className="absolute top-0 left-0 right-0 h-full flex items-center justify-center">
              <div className="w-full relative h-4">
                {/* -50 cents mark */}
                <div className="absolute left-0 top-0 h-4 w-1 bg-red-400 dark:bg-red-500"></div>
                
                {/* -40 cents mark */}
                <div className="absolute left-1/10 top-0 h-3 w-0.5 bg-red-300 dark:bg-red-400"></div>
                
                {/* -30 cents mark */}
                <div className="absolute left-1/5 top-0 h-4 w-1 bg-red-300 dark:bg-red-400"></div>
                
                {/* -20 cents mark */}
                <div className="absolute left-3/10 top-0 h-3 w-0.5 bg-blue-300 dark:bg-blue-400"></div>
                
                {/* -10 cents mark */}
                <div className="absolute left-2/5 top-0 h-4 w-1 bg-blue-300 dark:bg-blue-400"></div>
                
                {/* Center (0 cents) mark */}
                <div className="absolute left-1/2 top-0 h-5 w-1 bg-green-500 dark:bg-green-400 -translate-x-0.5"></div>
                
                {/* +10 cents mark */}
                <div className="absolute left-3/5 top-0 h-4 w-1 bg-blue-300 dark:bg-blue-400"></div>
                
                {/* +20 cents mark */}
                <div className="absolute left-7/10 top-0 h-3 w-0.5 bg-blue-300 dark:bg-blue-400"></div>
                
                {/* +30 cents mark */}
                <div className="absolute left-4/5 top-0 h-4 w-1 bg-red-300 dark:bg-red-400"></div>
                
                {/* +40 cents mark */}
                <div className="absolute left-9/10 top-0 h-3 w-0.5 bg-red-300 dark:bg-red-400"></div>
                
                {/* +50 cents mark */}
                <div className="absolute right-0 top-0 h-4 w-1 bg-red-400 dark:bg-red-500"></div>
              </div>
            </div>
            
            {/* Needle */}
            <div 
              ref={needleRef} 
              className="tuner-needle absolute bottom-0 left-1/2 w-1 h-1/2 bg-black dark:bg-white -translate-x-0.5 shadow-md rounded-t-full"
            ></div>
          </div>
        </div>
        
        {/* Note display */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-center bg-white/90 dark:bg-black/40 backdrop-blur-sm">
          <div className={cn(
            "py-1 transition-opacity duration-300",
            isListening ? "opacity-100" : "opacity-50"
          )}>
            <div className="flex justify-center items-center">
              {currentNote ? (
                <span className="text-6xl font-light tracking-tighter dark:text-white">
                  {currentNote}
                </span>
              ) : (
                <span className="text-6xl font-light tracking-tighter text-gray-300 dark:text-gray-500">
                  –
                </span>
              )}
            </div>
            
            <div className="text-xs text-muted-foreground mt-1">
              {currentFrequency ? (
                <>
                  <span>{currentFrequency.toFixed(2)} Hz</span>
                  {targetFrequency && (
                    <span className="mx-1">
                      {' → '}
                      <span className="font-medium dark:text-white/90">
                        {targetFrequency.toFixed(2)} Hz
                      </span>
                    </span>
                  )}
                </>
              ) : (
                <span>– Hz</span>
              )}
            </div>
          </div>
          
          <div className={cn(
            "text-sm font-medium mt-2 transition-colors duration-300",
            isInTune ? "text-green-500 dark:text-green-400" : 
            isTooLow ? "text-blue-500 dark:text-blue-400" : 
            isTooHigh ? "text-red-500 dark:text-red-400" : "text-gray-400 dark:text-gray-500"
          )}>
            {getStatusMessage()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TunerDisplay;
