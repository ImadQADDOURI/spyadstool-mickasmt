// @/components/adsLibrary/startDate.tsx
"use client";

import React from "react";

interface StartDateProps {
  onSelectStartDate: (date: string | null) => void;
  start_date_min?: string | null;
}

const MIN_DATE = "2018-05-07";

export const StartDate: React.FC<StartDateProps> = ({
  onSelectStartDate,
  start_date_min,
}) => {
  const [selectedDate, setSelectedDate] = React.useState<string | null>(
    start_date_min || null,
  );

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value || null;
    setSelectedDate(newDate);
    onSelectStartDate(newDate);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="relative">
      <input
        type="date"
        value={selectedDate || ""}
        onChange={handleDateChange}
        min={MIN_DATE}
        max={today}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm 
                   focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 
                   dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 
                   dark:focus:ring-blue-400 sm:w-auto"
      />
      {selectedDate && (
        <button
          onClick={() => {
            setSelectedDate(null);
            onSelectStartDate(null);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 
                     focus:outline-none dark:text-gray-300 dark:hover:text-gray-100"
          aria-label="Clear date"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default StartDate;
