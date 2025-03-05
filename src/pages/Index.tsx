
import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import GuitarString from '@/components/GuitarString';
import TunerDisplay from '@/components/TunerDisplay';
import TuningSelector from '@/components/TuningSelector';
import CalibrationModal from '@/components/CalibrationModal';
import { 
  setupAudioContext, 
  teardownAudioContext,
  startContinuousPitchDetection,
  stopContinuousPitchDetection
} from '@/utils/audioUtils';
import { 
  TUNING_OPTIONS,
  CONCERT_A_FREQUENCY,
  StringNote,
  findClosestNote,
  adjustTuningToReference
} from '@/utils/tuningData';

const Index = () => {
  const { toast } = useToast();
  
  // State for tuner
  const [isListening, setIsListening] = useState(false);
  const [selectedTuning, setSelectedTuning] = useState(TUNING_OPTIONS[0]);
  const [activeString, setActiveString] = useState<StringNote | null>(null);
  const [adjustedTuning, setAdjustedTuning] = useState<StringNote[]>(selectedTuning.strings);
  const [referenceFrequency, setReferenceFrequency] = useState<number>(CONCERT_A_FREQUENCY);
  
  // State for detected pitch
  const [currentFrequency, setCurrentFrequency] = useState<number | null>(null);
  const [currentNote, setCurrentNote] = useState<string | null>(null);
  const [centsDifference, setCentsDifference] = useState<number | null>(null);

  // Effect to update adjusted tuning when reference frequency changes
  useEffect(() => {
    const newAdjustedTuning = adjustTuningToReference(
      selectedTuning.strings,
      referenceFrequency
    );
    setAdjustedTuning(newAdjustedTuning);
    
    // If we have an active string, update it with the new adjusted tuning
    if (activeString) {
      const newActiveString = newAdjustedTuning.find(
        s => s.note === activeString.note && s.octave === activeString.octave
      );
      if (newActiveString) {
        setActiveString(newActiveString);
      }
    }
  }, [referenceFrequency, selectedTuning]);

  // Handle tuning selection change
  const handleTuningChange = (tuning: typeof TUNING_OPTIONS[0]) => {
    setSelectedTuning(tuning);
    setActiveString(null);
    setCentsDifference(null);
    setCurrentNote(null);
    setCurrentFrequency(null);
    
    toast({
      title: "Tuning changed",
      description: `Switched to ${tuning.name}`,
    });
  };

  // Handle reference frequency change
  const handleReferenceChange = (frequency: number) => {
    setReferenceFrequency(frequency);
    
    toast({
      title: "Calibration updated",
      description: `Reference A4 set to ${frequency.toFixed(1)} Hz`,
    });
  };

  // Toggle listening state
  const toggleListening = async () => {
    if (isListening) {
      stopContinuousPitchDetection();
      teardownAudioContext();
      setIsListening(false);
      
      toast({
        title: "Tuner stopped",
        description: "Microphone access released",
      });
    } else {
      const success = await setupAudioContext();
      
      if (success) {
        setIsListening(true);
        startContinuousPitchDetection(handlePitchDetected);
        
        toast({
          title: "Tuner started",
          description: "Listen for a string to begin tuning",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Microphone access denied",
          description: "Please allow microphone access to use the tuner",
        });
      }
    }
  };

  // Handle pitch detection results
  const handlePitchDetected = (frequency: number) => {
    if (frequency <= 0) {
      setCurrentFrequency(null);
      return;
    }
    
    setCurrentFrequency(frequency);
    
    // Find the closest note in the current tuning
    const result = findClosestNote(frequency, adjustedTuning);
    
    if (result) {
      const { note, cents } = result;
      setCurrentNote(note.note + note.octave);
      setCentsDifference(cents);
      
      // If we have an active string selected, only show data for that string
      if (activeString && (note.note !== activeString.note || note.octave !== activeString.octave)) {
        // Still detect frequencies but don't update the UI if we're focusing on a specific string
        return;
      }
    } else {
      setCurrentNote(null);
      setCentsDifference(null);
    }
  };

  // Handle string selection
  const handleStringSelect = (string: StringNote) => {
    if (activeString && activeString.note === string.note && activeString.octave === string.octave) {
      // Deselect the current string
      setActiveString(null);
    } else {
      setActiveString(string);
      // Reset current detected note when selecting a new string
      setCurrentNote(null);
      setCentsDifference(null);
      setCurrentFrequency(null);
      
      if (!isListening) {
        toggleListening();
      }
    }
  };

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (isListening) {
        stopContinuousPitchDetection();
        teardownAudioContext();
      }
    };
  }, [isListening]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white relative">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 opacity-15" 
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1470813740244-df37b8c1edcb)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} 
      />
      
      {/* Content with relative positioning to appear above the background */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="pt-8 pb-6 px-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium text-gray-900">Guitar Tuner</h1>
            <p className="text-sm text-muted-foreground">Tune with precision</p>
          </div>
          <div className="flex items-center space-x-2">
            <CalibrationModal 
              referenceFrequency={referenceFrequency}
              onReferenceChange={handleReferenceChange}
            />
            <Button
              variant={isListening ? "default" : "outline"}
              size="icon"
              className={`rounded-full h-10 w-10 ${
                isListening ? "bg-primary" : "bg-white"
              }`}
              onClick={toggleListening}
            >
              {isListening ? (
                <MicOff className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </Button>
          </div>
        </header>

        <main className="flex-1 flex flex-col max-w-3xl w-full mx-auto px-6 pb-16">
          <div className="mb-8">
            <TunerDisplay 
              currentNote={activeString ? `${activeString.note}${activeString.octave}` : currentNote}
              currentFrequency={currentFrequency}
              targetFrequency={activeString ? activeString.frequency : null}
              cents={centsDifference}
              isListening={isListening}
            />
          </div>

          <div className="mb-8">
            <TuningSelector
              tuningOptions={TUNING_OPTIONS}
              selectedTuning={selectedTuning}
              onSelectTuning={handleTuningChange}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-gray-700">Guitar Strings</h2>
              <div className="text-xs text-muted-foreground flex items-center">
                <Info className="h-3 w-3 mr-1" />
                Tap a string to focus on it
              </div>
            </div>

            <div className="space-y-3">
              {adjustedTuning.map((string) => (
                <GuitarString
                  key={`${string.note}${string.octave}`}
                  stringData={string}
                  isActive={
                    activeString
                      ? activeString.note === string.note && 
                        activeString.octave === string.octave
                      : false
                  }
                  deviation={
                    activeString && 
                    activeString.note === string.note && 
                    activeString.octave === string.octave
                      ? centsDifference
                      : null
                  }
                  onClick={() => handleStringSelect(string)}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
