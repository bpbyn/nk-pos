'use client';

import { cn } from '@/lib/utils';
import { CalendarIcon } from '@radix-ui/react-icons';
import { addDays, format, isAfter, sub } from 'date-fns';
import * as React from 'react';
import { DateRange } from 'react-day-picker';

import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

export function CalendarDateRangePicker({
  className,
  date,
  onDateChange,
}: {
  className?: React.HTMLAttributes<HTMLDivElement>;
  date?: DateRange;
  onDateChange: (value?: DateRange) => void;
}) {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: date?.from,
    to: date?.to,
  });
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = React.useCallback((selectedDateRange: DateRange | undefined) => {
    if (selectedDateRange?.from && selectedDateRange?.to) {
      setIsOpen(false);
    }
    setDateRange(selectedDateRange);
    onDateChange(selectedDateRange);
  }, []);

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[260px] justify-start text-left font-normal',
              !dateRange && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                </>
              ) : (
                format(dateRange.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={handleSelect}
            numberOfMonths={2}
            disabled={(date) => isAfter(date, new Date())}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
