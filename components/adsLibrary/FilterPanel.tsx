// components/adsLibrary/FilterPanel.tsx

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

import { Button } from "../ui/button";
import Category from "./filters/category";
import CategoryAsKeyword from "./filters/categoryAsKeyword";
import Country from "./filters/country";
import EndDate from "./filters/endDate";
import Language from "./filters/language";
import Media from "./filters/media";
import Platform from "./filters/platform";
import StartDate from "./filters/startDate";
import Status from "./filters/status";

interface FilterPanelProps {
  isPanelOpen: boolean;
  setIsPanelOpen: (isOpen: boolean) => void;
  performSearch: () => void;
  clearAllFilters: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  isPanelOpen,
  setIsPanelOpen,
  performSearch,
  clearAllFilters,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const countAppliedFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    return Array.from(params.keys()).filter((key) => key !== "q").length;
  };

  const applyFilters = () => {
    performSearch();
    setIsPanelOpen(false);
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-80 transform overflow-y-auto bg-white p-6 shadow-lg transition-transform duration-300 ease-in-out dark:bg-gray-800 ${
        isPanelOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-2xl font-bold text-transparent">
          Filters
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsPanelOpen(false)}
          className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Filter components */}
      <div className="space-y-6">
        <Category />
        <Country />
        <CategoryAsKeyword />
        <Language />
        <Media />
        <Platform />
        <Status />
        <StartDate />
        <EndDate />
      </div>

      <div className="mt-8 space-y-4">
        <Button
          onClick={clearAllFilters}
          variant="outline"
          className="w-full rounded-full border-2 border-gray-300 bg-transparent px-6 py-2 text-gray-700 transition-all hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Clear All
        </Button>
        <Button
          onClick={applyFilters}
          className="w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-2 text-white transition-all hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          Apply Filters
          {countAppliedFilters() > 0
            ? " (" + countAppliedFilters() + ")"
            : null}
        </Button>
      </div>
    </div>
  );
};

export default FilterPanel;
