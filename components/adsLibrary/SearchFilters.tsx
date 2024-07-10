// components/adsLibrary/SearchFilters.tsx

import React from "react";

import { Button } from "../ui/button";
import Category from "./category";
import Country from "./country";
import SearchByKeyword from "./searchByKeyword";

interface SearchFiltersProps {
  selectedCountry: string;
  selectedCategory: string;
  searchQuery: string;
  isLoading: boolean;
  onSelectCountry: (value: string) => void;
  onSelectCategory: (value: string) => void;
  onSearch: (keyword: string) => void;
  onSearchClick: () => void;
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
}) => {
  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="mb-2 text-xl font-semibold">
          Selected Country: {selectedCountry}
        </h2>
        <Country onSelectCountry={onSelectCountry} />
      </div>
      <div>
        <h2 className="mb-2 text-xl font-semibold">
          Selected Category: {selectedCategory}
        </h2>
        <Category onSelectCategory={onSelectCategory} />
      </div>
      <div>
        <h2 className="mb-2 text-xl font-semibold">
          Search Query: {searchQuery}
        </h2>
        <SearchByKeyword onSearch={onSearch} />
      </div>
      <div>
        <Button
          onClick={onSearchClick}
          className="w-full md:w-auto"
          disabled={isLoading}
        >
          {isLoading ? "Searching..." : "Search Ads"}
        </Button>
      </div>
    </div>
  );
};

export default SearchFilters;
