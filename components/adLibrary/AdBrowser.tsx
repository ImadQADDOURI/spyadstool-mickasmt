// components\adLibrary\AdBrowser.tsx
"use client";

import React, { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAdSearchVariables } from "@/utils/adSearchVariables";
import { Loader2 } from "lucide-react";

import { AdData } from "@/types/ad";
import { AdLibrarySearchPaginationQuery } from "@/app/actions/Meta-GraphQL-Queries";

import { Button } from "../ui/button";
import { AdCardGrid } from "./microComponents/AdCardGrid";
import LoadingTrigger from "./microComponents/LoadingTrigger";
import { ScrollButtons } from "./microComponents/ScrollButtons";
import SearchResults from "./microComponents/SearchResults";
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
        const variables = getAdSearchVariables(
          searchParams,
          useExistingParams ? endCursor : null,
          //page_id,
        );
        // console.log("🚀🚀🚀🚀 ~ variables:", variables);

        const results = await AdLibrarySearchPaginationQuery(variables);

        if (useExistingParams && searchResults) {
          setSearchResults((prevResults) => [...prevResults!, ...results.ads]);
        } else {
          setSearchResults(results.ads);
          setTotalCount(results.count); // setTotalCount in the First Search Only
        }

        setEndCursor(results.end_cursor);
        setHasNextPage(results.has_next_page);

        // Calculate remaining count
        const newRemainingCount =
          results.count >= 50001
            ? results.count
            : results.count -
              (useExistingParams ? searchResults!.length : 0) -
              results.ads.length;

        setRemainingCount(newRemainingCount > 0 ? newRemainingCount : 0);
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

      {/* Search Results */}
      <SearchResults
        isLoading={isLoading}
        error={error}
        totalCount={totalCount}
        searchResults={searchResults}
        hasNextPage={hasNextPage}
        remainingCount={remainingCount}
        handleLoadMore={handleLoadMore}
      />

      {/* Scroll buttons */}
      <ScrollButtons />
    </div>
  );
};

export default AdBrowser;
