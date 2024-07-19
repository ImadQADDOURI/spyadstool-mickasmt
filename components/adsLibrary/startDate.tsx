// @/components/adsLibrary/startDate.tsx
"use client";

import React from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface StartDateProps {
  onSelectStartDate: (date: string | null) => void;
  start_date_min?: string | null;
  maxDate?: string;
  clear?: boolean;
}

const MIN_DATE = "2018-05-07";

export const StartDate: React.FC<StartDateProps> = ({
  onSelectStartDate,
  start_date_min,
  maxDate,
  clear = false,
}) => {
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);

  // Clear selected Start Date if clear is true
  React.useEffect(() => {
    if (clear) {
      setSelectedDate(null);
      onSelectStartDate(null);
    }
  }, [clear, onSelectStartDate]);

  // Update selectedDate when start_date_min changes
  React.useEffect(() => {
    setSelectedDate(start_date_min || null);
  }, [start_date_min]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value || null;
    setSelectedDate(newDate);
    onSelectStartDate(newDate);
  };

  const clearDate = () => {
    setSelectedDate(null);
    onSelectStartDate(null);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="relative flex items-center space-x-2">
      <label
        htmlFor="start-date"
        className="whitespace-nowrap text-sm font-medium"
      >
        Start :
      </label>
      <div className="relative flex-grow">
        <input
          id="start-date"
          type="date"
          value={selectedDate || ""}
          onChange={handleDateChange}
          min={MIN_DATE}
          max={maxDate || today}
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
            aria-label="Clear start date"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default StartDate;
