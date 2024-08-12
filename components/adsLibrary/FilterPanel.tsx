// components/adsLibrary/FilterPanel.tsx

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";

import { useFilterReset } from "@/hooks/useFilterReset";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import Category from "./filters/category";
import CategoryAsKeyword from "./filters/categoryAsKeyword";
import Country from "./filters/country";
import EndDate from "./filters/endDate";
import Language from "./filters/language";
import Media from "./filters/media";
import Platform from "./filters/platform";
import SearchType from "./filters/SearchType";
import Sort from "./filters/sort";
import StartDate from "./filters/startDate";
import Status from "./filters/status";

interface FilterPanelProps {
  onSearch: () => void;
}

const filterParams = [
  "ad_type",
  "category_as_keyword",
  "countries",
  "end_date",
  "content_languages",
  "media_type",
  "publisher_platforms",
  "sort_data",
  "start_date",
  "active_status",
  "search_type",
];

export const FilterPanel: React.FC<FilterPanelProps> = ({ onSearch }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const countAppliedFilters = () => {
    // count only the search Filters , q & display filters not included
    const params = new URLSearchParams(searchParams.toString());
    return filterParams.filter((key) => params.has(key)).length;
  };

  const applyFilters = () => {
    onSearch();
  };

  // Clear all filters
  const { clearFilters } = useFilterReset(filterParams);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          aria-label="Open Search Filters"
          className="relative overflow-hidden rounded-full bg-white bg-opacity-20 p-0.5 text-white transition-all hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
        >
          <span className="relative flex items-center px-4 py-2">
            <Filter className="h-6 w-6" />
            {countAppliedFilters() > 0 && (
              <Badge
                variant="secondary"
                className="ml-1 bg-purple-500 text-white"
              >
                {countAppliedFilters()}
              </Badge>
            )}
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"}>
        <SheetHeader>
          <SheetTitle className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-2xl font-bold text-transparent">
            Search Filters
          </SheetTitle>
          <SheetDescription>Adjust your search filters</SheetDescription>
        </SheetHeader>
        <div className="space-y-5 py-4">
          <SearchType />
          <Category />
          <Sort />
          <Country />
          <CategoryAsKeyword />
          <Language />
          <Media />
          <Platform />
          <Status />
          <StartDate />
          <EndDate />
        </div>
        <SheetFooter>
          <div className="flex w-full flex-row space-x-1">
            <Button
              onClick={clearFilters}
              variant="outline"
              className="w-1/3 rounded-full border-2 border-gray-300 bg-transparent px-6 py-2 text-gray-700 transition-all hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Clear
            </Button>
            <SheetClose asChild>
              <Button
                onClick={applyFilters}
                className="w-2/3 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-2 text-white transition-all hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Apply Filters
                {countAppliedFilters() > 0 && (
                  <Badge className="ml-2 bg-white text-purple-500">
                    {countAppliedFilters()}
                  </Badge>
                )}
              </Button>
            </SheetClose>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default FilterPanel;
