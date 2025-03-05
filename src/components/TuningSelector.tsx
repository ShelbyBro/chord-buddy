
import React from 'react';
import { Check, ChevronDown, Guitar, Music } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TuningOption } from '@/utils/tuningData';

interface TuningSelectorProps {
  tuningOptions: TuningOption[];
  selectedTuning: TuningOption;
  onSelectTuning: (tuning: TuningOption) => void;
}

const TuningSelector: React.FC<TuningSelectorProps> = ({
  tuningOptions,
  selectedTuning,
  onSelectTuning,
}) => {
  // Group tuning options by instrument
  const guitarTunings = tuningOptions.filter(tuning => tuning.instrument === 'guitar');
  const ukuleleTunings = tuningOptions.filter(tuning => tuning.instrument === 'ukulele');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full flex justify-between items-center bg-white/80 dark:bg-black/30 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-left h-auto py-3"
        >
          <div className="flex items-center gap-2">
            {selectedTuning.instrument === 'guitar' ? (
              <Guitar className="h-4 w-4 text-primary opacity-70" />
            ) : (
              <Music className="h-4 w-4 text-primary opacity-70" />
            )}
            <div>
              <div className="font-medium dark:text-white">{selectedTuning.name}</div>
              <div className="text-xs text-muted-foreground">
                {selectedTuning.instrument === 'guitar' 
                  ? 'Guitar tuning' 
                  : 'Ukulele tuning'}
              </div>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full min-w-[240px] p-1 dark:bg-gray-800 dark:border-gray-700">
        {/* Guitar tunings section */}
        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
          Guitar Tunings
        </div>
        {guitarTunings.map((tuning) => (
          <DropdownMenuItem
            key={tuning.id}
            className={`flex justify-between items-center cursor-pointer py-3 ${
              selectedTuning.id === tuning.id ? 'bg-secondary dark:bg-gray-700' : ''
            }`}
            onClick={() => onSelectTuning(tuning)}
          >
            <div className="flex items-center gap-2">
              <Guitar className="h-4 w-4 text-primary opacity-70" />
              <div className="flex flex-col">
                <span className="font-medium dark:text-white">{tuning.name}</span>
                <span className="text-xs text-muted-foreground">
                  {tuning.strings.length} strings
                </span>
              </div>
            </div>
            {selectedTuning.id === tuning.id && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator className="my-1" />

        {/* Ukulele tunings section */}
        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
          Ukulele Tunings
        </div>
        {ukuleleTunings.map((tuning) => (
          <DropdownMenuItem
            key={tuning.id}
            className={`flex justify-between items-center cursor-pointer py-3 ${
              selectedTuning.id === tuning.id ? 'bg-secondary dark:bg-gray-700' : ''
            }`}
            onClick={() => onSelectTuning(tuning)}
          >
            <div className="flex items-center gap-2">
              <Music className="h-4 w-4 text-primary opacity-70" />
              <div className="flex flex-col">
                <span className="font-medium dark:text-white">{tuning.name}</span>
                <span className="text-xs text-muted-foreground">
                  {tuning.strings.length} strings
                </span>
              </div>
            </div>
            {selectedTuning.id === tuning.id && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TuningSelector;
