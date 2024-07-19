// @/components/adsLibrary/endDate.tsx
"use client";

import React from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface EndDateProps {
  onSelectEndDate: (date: string | null) => void;
  start_date_max?: string | null;
  minDate?: string;
  clear?: boolean;
}

const MIN_DATE = "2018-05-07";

export const EndDate: React.FC<EndDateProps> = ({
  onSelectEndDate,
  start_date_max,
  minDate,
  clear = false,
}) => {
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);

  // Clear selected End Date if clear is true
  React.useEffect(() => {
    if (clear) {
      setSelectedDate(null);
      onSelectEndDate(null);
    }
  }, [clear, onSelectEndDate]);

  // Update selectedDate when start_date_max changes
  React.useEffect(() => {
    setSelectedDate(start_date_max || null);
  }, [start_date_max]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value || null;
    setSelectedDate(newDate);
    onSelectEndDate(newDate);
  };

  const clearDate = () => {
    setSelectedDate(null);
    onSelectEndDate(null);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="relative flex items-center justify-between space-x-2">
      <label
        htmlFor="end-date"
        className="whitespace-nowrap text-sm font-medium"
      >
        End :
      </label>
      <div className="relative flex-grow">
        <input
          id="end-date"
          type="date"
          value={selectedDate || ""}
          onChange={handleDateChange}
          min={minDate || MIN_DATE}
          max={today}
          className="w-auto rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm 
                   focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 
                   dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 
                   dark:focus:ring-blue-400"
        />
        {selectedDate && (
          <Button
            onClick={clearDate}
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 p-1"
            aria-label="Clear end date"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default EndDate;
