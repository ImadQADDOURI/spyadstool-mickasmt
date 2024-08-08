// components/SearchBar.tsx

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, Loader2, Search, Settings, X } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import FilterPanel from "./FilterPanel"; // Import FilterPanel
import {DisplayFilters} from './DisplayFilters';

interface SearchBarProps {
  onSearch: (query?: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  isLoading,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [isPanelOpen, setIsPanelOpen] = useState(false); // State for filter panel
  const [isParamsOpen, setIsParamsOpen] = useState(false);// State for display filters
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("q", searchQuery);
    router.push(`?${params.toString()}`, { scroll: false });
  }, [searchQuery, router, searchParams]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSearch(searchQuery);
    }
  };

  const resetSearch = () => {
    setSearchQuery("");
    // onSearch("");
  };

  return (
    <div className="flex flex-grow items-center space-x-4">
      {/* Search Input */}
      <div className="relative flex-grow">
        <Input
          type="text"
          placeholder="Search ads..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          aria-label="Search ads"
          className="w-full rounded-full border-none bg-white bg-opacity-20 px-6 py-3 text-white placeholder-white placeholder-opacity-75 focus:outline-none focus:ring-2 focus:ring-white"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full text-white hover:bg-gray-800 hover:bg-opacity-20"
            onClick={resetSearch}
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {/* Search Button */}
      <Button
        onClick={() => onSearch(searchQuery)}
        disabled={isLoading}
        aria-label="Search ads"
        className="relative overflow-hidden rounded-full bg-white bg-opacity-20 p-0.5 text-white transition-all hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 "
      >
        <span className="relative flex items-center px-6 py-2">
          {isLoading ? (
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          ) : (
            <Search className="mr-2 h-6 w-6" />
          )}
          Search
        </span>
      </Button>

      {/* Filter Button */}
      <Button
        onClick={() => setIsPanelOpen(!isPanelOpen)} // Toggle panel visibility
        aria-label="Open filters panel"
        className="relative overflow-hidden rounded-full bg-white bg-opacity-20 p-0.5 text-white transition-all hover:bg-gray-800  focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
      >
        <span className="relative flex items-center px-6 py-2">
          <Filter className="mr-2 h-6 w-6" />
          Filters
        </span>
      </Button>

      {/*Display Filters*/}
      <Button
        onClick={() => setIsParamsOpen(true)}
        aria-label="Open Settings panel"
        className="relative overflow-hidden rounded-full bg-white bg-opacity-20 p-0.5 text-white transition-all hover:bg-gray-800  focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
       >
         <span className="relative flex items-center px-6 py-2">
        <Settings className=" h-6 w-6" />
        </span>
      </Button>
      <DisplayFilters isParamsOpen={isParamsOpen} setIsParamsOpen={setIsParamsOpen} />

      {/* Filter Panel */}
      <FilterPanel
        onSearch={onSearch}
        isPanelOpen={isPanelOpen}
        setIsPanelOpen={setIsPanelOpen}
      />
    </div>
  );
};
