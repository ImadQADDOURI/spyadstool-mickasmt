// DisplayFilters.tsx
"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Settings } from "lucide-react";

import { useFilterReset } from "@/hooks/useFilterReset";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";

// Array of filter parameters
const filterParams = ["collationCount"];

export const DisplayFilters: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get the current collation count from URL params, default to 1
  const collationCountValue = parseInt(
    searchParams.get("collationCount") || "1",
    10,
  );

  // Handle changes to the collation count slider
  const handleCollationCountChange = (value: number[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("collationCount", value[0].toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Count the number of applied filters
  const countAppliedFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    return filterParams.filter((key) => params.has(key)).length;
  };

  const handleApplyFilters = () => {
    //if (collationCountValue = 1) delete from url else add to url
  };

  // Clear all filters
  const { clearFilters } = useFilterReset(filterParams);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          aria-label="Open Display Filters"
          className="relative overflow-hidden rounded-full bg-white bg-opacity-20 p-0.5 text-white transition-all hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
        >
          <span className="relative flex items-center px-4 py-2">
            <Settings className="h-6 w-6" />
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
            Display Filters
          </SheetTitle>
          <SheetDescription>
            Adjust the display filters to refine the results.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">Total Ads</span>
            <span className="font-bold text-gray-800 dark:text-gray-200">
              {collationCountValue}+
            </span>
          </div>
          <Slider
            min={1}
            max={20}
            step={1}
            defaultValue={[collationCountValue]}
            onValueChange={handleCollationCountChange}
            className="w-full"
          />

          <div className="mt-8 flex w-full flex-row space-x-1">
            <Button
              onClick={clearFilters}
              variant="outline"
              className="w-1/3 rounded-full border-2 border-gray-300 bg-transparent px-6 py-2 text-gray-700 transition-all hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Clear
            </Button>
            <SheetClose asChild>
              <Button className="w-2/3 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-2 text-white transition-all hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
                Apply Filters
                {countAppliedFilters() > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-white text-purple-500"
                  >
                    {countAppliedFilters()}
                  </Badge>
                )}
              </Button>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

DisplayFilters.displayName = "DisplayFilters";

export default DisplayFilters;
