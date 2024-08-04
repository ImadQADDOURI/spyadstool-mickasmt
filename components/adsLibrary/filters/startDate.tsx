// @/components/adsLibrary/startDate.tsx
"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

const MIN_DATE = "2018-05-07";

export const StartDate: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedDate = searchParams.get("start_date") || null;
  const endDate = searchParams.get("end_date") || null;

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    const newDate = event.target.value || null;
    if (newDate) {
      params.set("start_date", newDate);
    } else {
      params.delete("start_date");
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const clearDate = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("start_date");
    router.push(`?${params.toString()}`, { scroll: false });
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
          max={endDate || today}
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
