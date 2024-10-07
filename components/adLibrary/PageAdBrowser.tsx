"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getAdLibraryMobileVariables,
  getAdSearchVariables,
} from "@/utils/adSearchVariables";
import { Loader2 } from "lucide-react";

import { AdData } from "@/types/ad";
import {
  AdLibraryMobileFocusedStateProviderRefetchQuery,
  AdLibrarySearchPaginationQuery,
} from "@/app/actions/Meta-GraphQL-Queries";

import { Button } from "../ui/button";
import { AdCardGrid } from "./microComponents/AdCardGrid";
import LoadingTrigger from "./microComponents/LoadingTrigger";
import PageInfoSection from "./microComponents/PageInfoSection";
import { ScrollButtons } from "./microComponents/ScrollButtons";
import SearchResults from "./microComponents/SearchResults";
import StickyWrapper from "./microComponents/StickyWrapper";
import { SearchBar } from "./searchFilters/SearchBar";

interface PageAdBrowserProps {
  pageId: string;
}

export const PageAdBrowser = ({ pageId }: PageAdBrowserProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [searchResults, setSearchResults] = useState<AdData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [remainingCount, setRemainingCount] = useState<number | null>(null);
  const [pageInfo, setPageInfo] = useState<any | null>(null);
  const [page, setPage] = useState<any | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(
    null,
  );
  const [pageTotalAds, setPageTotalAds] = useState<number | null>(null);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const handleSearchAds = useCallback(
    async (useExistingParams = false) => {
      setIsLoading(true);
      setError(null);
      try {
        let results;
        if (isInitialLoad) {
          // First search on page load
          const variables = getAdLibraryMobileVariables(pageId);
          results =
            await AdLibraryMobileFocusedStateProviderRefetchQuery(variables);
          setPageInfo(results.page_info);
          setPage(results.page);
          setProfilePictureUrl(
            results.ads[0].snapshot.page_profile_picture_url,
          );
          setPageTotalAds(results.count);
          setIsInitialLoad(false);
        } else {
          // Subsequent searches or pagination
          const variables = getAdSearchVariables(
            searchParams,
            useExistingParams ? endCursor : null,
            pageId,
          );
          results = await AdLibrarySearchPaginationQuery(variables);
        }

        // Update total count on first search or when search params change
        if (!useExistingParams) {
          setTotalCount(results.count);
        }

        if (useExistingParams && searchResults) {
          setSearchResults((prevResults) => [...prevResults!, ...results.ads]);
        } else {
          setSearchResults(results.ads);
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
    [searchParams, searchResults, endCursor, pageId, isInitialLoad],
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isLoading) {
      handleSearchAds(true);
    }
  }, [hasNextPage, handleSearchAds, isLoading]);

  const handleSearch = useCallback(
    (query: string = searchQuery) => {
      setSearchQuery(query);
      const params = new URLSearchParams(searchParams.toString());
      params.set("q", query);
      router.push(`?${params.toString()}`);
      handleSearchAds(false); // Force a new search with updated params
    },
    [searchParams, router, handleSearchAds, searchQuery],
  );

  // Initial load effect
  useEffect(() => {
    handleSearchAds();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800">
      {/* Page Info Section */}
      {pageInfo && (
        <PageInfoSection
          page={page}
          pageInfo={pageInfo}
          profilePictureUrl={profilePictureUrl}
          totalAds={pageTotalAds || 0}
        />
      )}

      {/* Sticky SearchBar Section */}
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

export default PageAdBrowser;
