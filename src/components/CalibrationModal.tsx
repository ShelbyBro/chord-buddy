
import React, { useState } from 'react';
import { X, Sliders } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { CONCERT_A_FREQUENCY } from '@/utils/tuningData';

interface CalibrationModalProps {
  referenceFrequency: number;
  onReferenceChange: (frequency: number) => void;
}

const CalibrationModal: React.FC<CalibrationModalProps> = ({
  referenceFrequency,
  onReferenceChange,
}) => {
  const [tempFrequency, setTempFrequency] = useState(referenceFrequency);
  const defaultFrequency = CONCERT_A_FREQUENCY;

  // Define the range for the slider
  const minFrequency = 420;
  const maxFrequency = 460;

  const handleSliderChange = (value: number[]) => {
    setTempFrequency(value[0]);
  };

  const handleApply = () => {
    onReferenceChange(tempFrequency);
  };

  const handleReset = () => {
    setTempFrequency(defaultFrequency);
    onReferenceChange(defaultFrequency);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full h-10 w-10 bg-white/50 dark:bg-black/20 dark:border-white/10">
          <Sliders className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-black/50 animate-fade-in">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium dark:text-white">Calibration Settings</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Adjust the reference pitch for A4 (default: 440 Hz).
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="reference-frequency" className="text-sm font-medium dark:text-gray-200">
                Reference Frequency (A4)
              </Label>
              <span className="text-sm font-medium dark:text-white">
                {tempFrequency.toFixed(1)} Hz
              </span>
            </div>
            
            <Slider
              id="reference-frequency"
              min={minFrequency}
              max={maxFrequency}
              step={0.1}
              value={[tempFrequency]}
              onValueChange={handleSliderChange}
              className="mt-2"
            />
            
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{minFrequency} Hz</span>
              <span>{maxFrequency} Hz</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium dark:text-gray-200">
                Preset Values
              </Label>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-xs h-8 dark:border-gray-700 dark:bg-gray-700/50 dark:hover:bg-gray-700/80"
                onClick={() => setTempFrequency(432)}
              >
                A4 = 432 Hz
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-xs h-8 dark:border-gray-700 dark:bg-gray-700/50 dark:hover:bg-gray-700/80"
                onClick={() => setTempFrequency(440)}
              >
                A4 = 440 Hz
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-xs h-8 dark:border-gray-700 dark:bg-gray-700/50 dark:hover:bg-gray-700/80"
                onClick={() => setTempFrequency(444)}
              >
                A4 = 444 Hz
              </Button>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleReset} className="dark:border-gray-700 dark:bg-gray-700/50 dark:hover:bg-gray-700/80">
            Reset to Default
          </Button>
          <Button variant="default" onClick={handleApply}>
            Apply Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CalibrationModal;
