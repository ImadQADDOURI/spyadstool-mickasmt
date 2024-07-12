// components/adsLibrary/SearchFilters.tsx

import React from "react";

import { Button } from "../ui/button";
import Category from "./category";
import Country from "./country";
import Language from "./language";
import Media from "./media";
import Platform from "./platform";
import SearchByKeyword from "./searchByKeyword";
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
          Selected Languages: {selectedLanguages.join(", ")}
        </h2>
        <Language onSelectLanguages={onSelectLanguages} />
      </div>
      <div>
        <h2 className="mb-2 text-xl font-semibold">
          Selected Platforms: {selectedPlatforms.join(", ")}
        </h2>
        <Platform onSelectPlatforms={onSelectPlatforms} />
      </div>
      <div>
        <h2 className="mb-2 text-xl font-semibold">
          Ad Status:{" "}
          {selectedStatus === "all" ? "Active and Inactive" : selectedStatus}
        </h2>
        <Status onSelectStatus={onSelectStatus} />
      </div>
      <div>
        <h2 className="mb-2 text-xl font-semibold">
          Media Type: {selectedMedia === "" ? "All media types" : selectedMedia}
        </h2>
        <Media onSelectMedia={onSelectMedia} />
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
