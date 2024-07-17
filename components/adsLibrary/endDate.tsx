// @/components/adsLibrary/endDate.tsx
"use client";

import React from "react";

interface EndDateProps {
  onSelectEndDate: (date: string | null) => void;
  start_date_max?: string | null;
}

export const EndDate: React.FC<EndDateProps> = ({
  onSelectEndDate,
  start_date_max,
}) => {
  const [selectedDate, setSelectedDate] = React.useState<string | null>(
    start_date_max || null,
  );

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value || null;
    setSelectedDate(newDate);
    onSelectEndDate(newDate);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="relative">
      <input
        type="date"
        value={selectedDate || ""}
        onChange={handleDateChange}
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
            onSelectEndDate(null);
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

export default EndDate;
