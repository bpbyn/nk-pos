'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import useControllableState from '@/hooks/use-controllable-state';
import { cn } from '@/lib/utils';
import { Minus, Plus, Trash2 } from 'lucide-react';
import React from 'react';

type ProducStepperProps = {
  value: number;
  onValueChange: (value: number) => void;
  onDelete?: () => void;
  showDelete?: boolean;
  className?: string;
};

export default function ProductStepper({
  value,
  onValueChange,
  onDelete,
  showDelete,
  className,
}: ProducStepperProps) {
  const [counter, setCounter] = useControllableState({
    value: value,
    defaultValue: value,
    onChange: (val) => onValueChange(val),
  });
  return (
    <div
      className={cn(`flex items-center justify-between`, className, showDelete ? 'gap-2' : 'gap-4')}
    >
      <Button
        variant="outline"
        disabled={counter < 1}
        size="icon"
        onClick={(e) => {
          e.preventDefault();
          setCounter(counter - 1);
        }}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <Badge variant="secondary" className="py-2 shadow">
        <div className="text-center w-full">{counter}</div>
      </Badge>
      <Button
        variant="outline"
        size="icon"
        onClick={(e) => {
          e.preventDefault();
          setCounter(counter + 1);
        }}
      >
        <Plus className="h-3 w-3" />
      </Button>
      {showDelete && (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            onDelete?.();
          }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
