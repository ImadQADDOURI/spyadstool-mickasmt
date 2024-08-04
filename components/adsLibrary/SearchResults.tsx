// components/adsLibrary/SearchResults.tsx

import React from "react";
import { Loader2 } from "lucide-react";
import { AdsData } from "@/types/ad";
import { AdsList } from "./AdsList";
import LoadingTrigger from "./LoadingTrigger";
import { Button } from "../ui/button";

interface SearchResultsProps {
  isLoading: boolean;
  error: string | null;
  totalCount: number | null;
  searchResults: AdsData | null;
  handleLoadMore: () => void;
  remainingCount: number | null;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  isLoading,
  error,
  totalCount,
  searchResults,
  handleLoadMore,
  remainingCount,
}) => {
  return (
    <div className="container mx-auto p-4">
      {error && (
        <div
          className="mb-6 rounded-lg bg-red-100 p-4 text-red-700 dark:bg-red-900 dark:text-red-100"
          role="alert"
        >
          {error}
        </div>
      )}

      {totalCount !== null && (
        <div className="mb-6 text-center">
          <span
            className="inline-block rounded-full bg-purple-100 px-6 py-3 text-lg font-bold text-purple-800 shadow-md dark:bg-purple-900 dark:text-purple-200"
            aria-live="polite"
          >
            {totalCount > 50000 ? ">50,000" : "~" + totalCount} Ads Found
          </span>
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center py-12" aria-live="polite">
          <div className="relative h-20 w-20">
            <div className="absolute inset-0 animate-ping rounded-full bg-purple-400 opacity-75"></div>
            <div className="relative flex h-full w-full items-center justify-center rounded-full bg-purple-500">
              <Loader2 className="h-10 w-10 animate-spin text-white" />
            </div>
          </div>
        </div>
      )}

      {/* Ads List */}
      {searchResults && searchResults.ads.length > 0 ? (
        <div className="space-y-8">
          <AdsList ads={searchResults.ads} />
          {!searchResults.isResultComplete && (
            <div className="flex flex-col items-center space-y-4">
              <LoadingTrigger
                onIntersect={handleLoadMore}
                isLoading={isLoading}
              />
              {isLoading ? (
                <div
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-400"
                  aria-live="polite"
                >
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <p>Loading more ads...</p>
                </div>
              ) : (
                <Button
                  onClick={handleLoadMore}
                  className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 text-white shadow-md transition-all hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                  Load More
                </Button>
              )}
              {remainingCount !== null && (
                <p
                  className="text-sm text-gray-600 dark:text-gray-400"
                  aria-live="polite"
                >
                  {remainingCount} more ads available
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        searchResults && (
          <p
            className="text-center text-lg text-gray-600 dark:text-gray-400"
            role="status"
          >
            No ads found. Try adjusting your search criteria.
          </p>
        )
      )}
    </div>
  );
};

export default SearchResults;