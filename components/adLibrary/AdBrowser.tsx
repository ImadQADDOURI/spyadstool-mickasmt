"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { AdData } from "@/types/ad";
import { AdLibrarySearchPaginationQuery } from "@/app/actions/Meta-GraphQL-Queries";

import { Button } from "../ui/button";
import { AdCardGrid } from "./AdCardGrid";
import LoadingTrigger from "./microComponents/LoadingTrigger";
import { ScrollButtons } from "./microComponents/ScrollButtons";
import StickyWrapper from "./microComponents/StickyWrapper";
import { SearchBar } from "./searchFilters/SearchBar";

export const AdBrowser = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [searchResults, setSearchResults] = useState<AdData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [remainingCount, setRemainingCount] = useState<number | null>(null);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);

  const handleSearchAds = useCallback(
    async (useExistingParams = false) => {
      setIsLoading(true);
      setError(null);
      try {
        const currentParams = new URLSearchParams(searchParams.toString());
        const variables: Record<string, any> = {
          activeStatus: currentParams.get("active_status") || "ALL",
          adType: "ALL",
          bylines: [],
          collationToken: null,
          contentLanguages:
            currentParams.get("content_languages")?.split(",") || [],
          countries: currentParams.get("countries")?.split(",") || ["ALL"],
          cursor: useExistingParams ? endCursor : null,
          excludedIDs: [],
          first: 30,
          location: null,
          mediaType: currentParams.get("media_type") || "ALL",
          pageIDs: [],
          potentialReachInput: [],
          publisherPlatforms:
            currentParams.get("publisher_platforms")?.split(",") || [],
          queryString: currentParams.get("q") || "",
          regions: [],
          searchType: "KEYWORD_UNORDERED",
          sessionID: Math.random().toString(36).substring(7),
          sortData: null,
          source: "NAV_HEADER",
          startDate:
            currentParams.get("start_date") && currentParams.get("end_date")
              ? {
                  min: currentParams.get("start_date"),
                  max: currentParams.get("end_date"),
                }
              : null,
          v: "7218b1",
          viewAllPageID: "0",
        };

        const results = await AdLibrarySearchPaginationQuery(variables);

        if (useExistingParams && searchResults) {
          setSearchResults((prevResults) => [...prevResults!, ...results.ads]);
          setRemainingCount(results.count);
        } else {
          setSearchResults(results.ads);
          setTotalCount(results.count);
        }

        setEndCursor(results.end_cursor);
        setHasNextPage(results.has_next_page);
      } catch (error) {
        console.error("Error searching ads:", error);
        setError(
          "An error occurred while searching for ads. Please try again.",
        );
        setSearchResults(null);
      } finally {
        setIsLoading(false);
      }
    },
    [searchParams, searchResults, endCursor],
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isLoading) {
      handleSearchAds(true);
    }
  }, [hasNextPage, handleSearchAds, isLoading]);

  //////////////////
  //In essence, handleSearch acts as the bridge between user input (search query) and the underlying data fetching mechanism. It ensures that the UI and the data stay synchronized, providing a seamless search experience for the user.
  //Here's a breakdown of its usage in different contexts:
  //In FilterPanel: When the user applies filters in the filter panel and clicks the "Apply Filters" button, the handleSearch function is called without any arguments. This triggers a search using the current searchQuery state value, along with any applied filters.
  //In SearchBar: When the user enters a search term in the search bar and either presses Enter or clicks the "Search" button, the handleSearch function is called with the entered search query as the argument. This initiates a search with the specific search term entered by the user.
  const handleSearch = useCallback(
    (query: string = searchQuery) => {
      // Use default value from searchQuery
      setSearchQuery(query);
      const params = new URLSearchParams(searchParams.toString());
      params.set("q", query); // Use the passed query directly
      router.push(`?${params.toString()}`);
      handleSearchAds();
    },
    [searchParams, router, handleSearchAds, searchQuery],
  );
  /////////////////////////
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800">
      {/* Title & Search Section */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500">
        <h1 className="p-4 text-center text-3xl font-bold text-white">
          Ad Browser
        </h1>
      </div>

      {/* Sticky SearchBar & Filter Section */}
      <StickyWrapper>
        <div className="bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 p-1 shadow-2xl">
          <div className="container mx-auto">
            <div className="flex flex-col space-y-4">
              <SearchBar onSearch={handleSearch} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </StickyWrapper>

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

      {/* Search Results */}
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
                {isLoading ? (
                  <div className="flex justify-center py-12" aria-live="polite">
                    <div className="relative h-20 w-20">
                      <div className="absolute inset-0 animate-ping rounded-full bg-purple-400 opacity-75"></div>
                      <div className="relative flex h-full w-full items-center justify-center rounded-full bg-purple-500">
                        <Loader2 className="h-10 w-10 animate-spin text-white" />
                      </div>
                    </div>
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
                    className="text-lg text-gray-600 dark:text-gray-400"
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

      {/* Scroll buttons */}
      <ScrollButtons />
    </div>
  );
};

export default AdBrowser;
