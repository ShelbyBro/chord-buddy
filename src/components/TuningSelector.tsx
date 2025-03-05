
import React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full flex justify-between items-center bg-white/80 backdrop-blur-sm border border-gray-200 text-left h-auto py-3"
        >
          <div>
            <div className="font-medium">{selectedTuning.name}</div>
            <div className="text-xs text-muted-foreground">
              {selectedTuning.id === 'standard' 
                ? 'Standard guitar tuning' 
                : 'Alternative tuning'}
            </div>
          </div>
          <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full min-w-[240px] p-1">
        {tuningOptions.map((tuning) => (
          <DropdownMenuItem
            key={tuning.id}
            className={`flex justify-between items-center cursor-pointer py-3 ${
              selectedTuning.id === tuning.id ? 'bg-secondary' : ''
            }`}
            onClick={() => onSelectTuning(tuning)}
          >
            <div className="flex flex-col">
              <span className="font-medium">{tuning.name}</span>
              <span className="text-xs text-muted-foreground">
                {tuning.id === 'standard' 
                  ? 'Standard guitar tuning' 
                  : 'Alternative tuning'}
              </span>
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
