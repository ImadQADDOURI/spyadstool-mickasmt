import React from "react";
import { Loader2 } from "lucide-react";

import { AdData } from "@/types/ad";
import { Button } from "@/components/ui/button";

import { AdCardGrid } from "./AdCardGrid";
import LoadingTrigger from "./LoadingTrigger";

interface SearchResultsProps {
  isLoading: boolean;
  error: string | null;
  totalCount: number | null;
  searchResults: AdData[] | null;
  hasNextPage: boolean;
  remainingCount: number | null;
  handleLoadMore: () => void;
}

const LoadingIndicator = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-8">
    <div className="mb-4 h-16 w-16 animate-spin rounded-full border-b-4 border-purple-500"></div>
    <p className="animate-pulse text-lg font-semibold text-purple-600">
      {message}
    </p>
  </div>
);

export const SearchResults: React.FC<SearchResultsProps> = ({
  isLoading,
  error,
  totalCount,
  searchResults,
  hasNextPage,
  remainingCount,
  handleLoadMore,
}) => {
  return (
    <div className="container mx-auto p-4">
      {/* Initial Loading indicator */}
      {isLoading && <LoadingIndicator message="" />}

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
            {totalCount > 50000 ? ">50,000" : "~" + totalCount} ADs
          </span>
        </div>
      )}

      {/* Ads Grid */}
      {searchResults && searchResults.length > 0 ? (
        <div className="space-y-8">
          <AdCardGrid ads={searchResults} />
          {hasNextPage && (
            <div className="flex flex-col items-center space-y-4">
              <LoadingTrigger
                onIntersect={handleLoadMore}
                isLoading={isLoading}
              />

              {remainingCount !== null && !isLoading && (
                <p
                  className="rounded-full bg-purple-100 px-4 py-2 text-lg font-semibold text-purple-600 shadow-md"
                  aria-live="polite"
                >
                  {remainingCount} more
                </p>
              )}
              {!isLoading && (
                <Button
                  onClick={handleLoadMore}
                  className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 text-white shadow-md transition-all hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                  Load More
                </Button>
              )}
              {/* Loading More indicator */}
              {isLoading && <LoadingIndicator message="" />}
            </div>
          )}
        </div>
      ) : (
        searchResults && (
          <p
            className="rounded-lg bg-gray-100 p-4 text-center text-xl font-semibold text-gray-600 shadow-md dark:bg-gray-700 dark:text-gray-400"
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
