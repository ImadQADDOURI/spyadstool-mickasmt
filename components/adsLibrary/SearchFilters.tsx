// components/adsLibrary/SearchFilters.tsx

import React from "react";

import { Button } from "../ui/button";
import Category from "./category";
import Country from "./country";
import EndDate from "./endDate";
import Language from "./language";
import Media from "./media";
import Platform from "./platform";
import SearchByKeyword from "./searchByKeyword";
import StartDate from "./startDate";
import Status from "./status";

interface SearchFiltersProps {
  selectedCountry: string;
  onSelectCountry: (value: string) => void;

  selectedCategory: string;
  onSelectCategory: (value: string) => void;

  searchQuery: string;
  onSearch: (keyword: string) => void;

  isLoading: boolean;
  onSearchClick: () => void;

  selectedLanguages: string[];
  onSelectLanguages: (values: string[]) => void;

  selectedPlatforms: string[];
  onSelectPlatforms: (platforms: string[]) => void;

  selectedStatus: string;
  onSelectStatus: (status: string) => void;

  selectedMedia: string | null;
  onSelectMedia: (media: string | null) => void;

  startDate: string | null;
  onSelectStartDate: (date: string | null) => void;

  endDate: string | null;
  onSelectEndDate: (date: string | null) => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  selectedCountry,
  selectedCategory,
  searchQuery,
  isLoading,
  onSelectCountry,
  onSelectCategory,
  onSearch,
  onSearchClick,
  selectedLanguages,
  onSelectLanguages,
  selectedPlatforms,
  onSelectPlatforms,
  selectedStatus,
  onSelectStatus,
  selectedMedia,
  onSelectMedia,

  startDate,
  onSelectStartDate,
  endDate,
  onSelectEndDate,
}) => {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 lg:grid-cols-8">
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <h2 className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
            Country
          </h2>
          <Country onSelectCountry={onSelectCountry} />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <h2 className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
            Category
          </h2>
          <Category onSelectCategory={onSelectCategory} />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <h2 className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
            Languages
          </h2>
          <Language onSelectLanguages={onSelectLanguages} />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <h2 className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
            Platforms
          </h2>
          <Platform onSelectPlatforms={onSelectPlatforms} />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <h2 className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
            Status
          </h2>
          <Status onSelectStatus={onSelectStatus} />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <h2 className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
            Media
          </h2>
          <Media onSelectMedia={onSelectMedia} />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <h2 className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
            Start Date
          </h2>
          <StartDate
            onSelectStartDate={onSelectStartDate}
            start_date_min={startDate}
          />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <h2 className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
            End Date
          </h2>
          <EndDate onSelectEndDate={onSelectEndDate} start_date_max={endDate} />
        </div>
      </div>

      <div className="my-4 border-t border-gray-200 dark:border-gray-700"></div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-grow">
          <h2 className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
            Search Query
          </h2>
          <SearchByKeyword onSearch={onSearch} />
        </div>
        <div className="flex items-end">
          <Button
            onClick={onSearchClick}
            className="w-full sm:w-auto"
            disabled={isLoading}
          >
            {isLoading ? "Searching..." : "Search Ads"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
