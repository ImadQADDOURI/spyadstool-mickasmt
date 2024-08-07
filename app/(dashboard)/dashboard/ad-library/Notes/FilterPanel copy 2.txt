// components/adsLibrary/FilterPanel.tsx
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X } from "lucide-react";

import Category from "../../../../../components/adsLibrary/filters/category";
import CategoryAsKeyword from "../../../../../components/adsLibrary/filters/categoryAsKeyword";
import Country from "../../../../../components/adsLibrary/filters/country";
import EndDate from "../../../../../components/adsLibrary/filters/endDate";
import Language from "../../../../../components/adsLibrary/filters/language";
import Media from "../../../../../components/adsLibrary/filters/media";
import Platform from "../../../../../components/adsLibrary/filters/platform";
import StartDate from "../../../../../components/adsLibrary/filters/startDate";
import Status from "../../../../../components/adsLibrary/filters/status";
import { Button } from "../../../../../components/ui/button";

interface FilterPanelProps {
  onSearch: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ onSearch }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const countAppliedFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    return Array.from(params.keys()).filter((key) => key !== "q").length;
  };

  const applyFilters = () => {
    onSearch();
    setIsPanelOpen(false);
  };

  // Clear all filters
  const clearAllFilters = () => {
    const pageId = searchParams.get("view_all_page_id"); // Check for pageId in URL
    const basePath = pageId
      ? `/dashboard/ad-library?view_all_page_id=${pageId}`
      : "/dashboard/ad-library";
    router.push(basePath);
  };

  // Clear all filters on page refresh
  useEffect(() => {
    if (typeof window !== "undefined" && window.performance) {
      if (performance.navigation.type === 1) {
        // Check if it's a page refresh
        const pageId = searchParams.get("view_all_page_id"); // Check for pageId in URL
        const basePath = pageId
          ? `/dashboard/ad-library?view_all_page_id=${pageId}`
          : "/dashboard/ad-library";
        router.push(basePath);
      }
    }
  }, [router, searchParams]);

  return (
    <div className="relative ">
      {/* Filter button*/}
      <Button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        aria-label="Open filters panel"
        className="relative overflow-hidden rounded-full bg-white bg-opacity-20 p-0.5 text-white transition-all hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
      >
        <span className="relative flex items-center px-6 py-2">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </span>
      </Button>
      {/* Filter Panel*/}
      {isPanelOpen && (
        <div className="fixed inset-y-0 left-0 z-50 w-80 overflow-y-auto bg-white p-6 shadow-lg dark:bg-gray-800">
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

          {/* Action Buttons */}
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
      )}
    </div>
  );
};

export default FilterPanel;
