"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getAdLibraryMobileVariables,
  getAdSearchVariables,
} from "@/utils/adSearchVariables";
import parse from "html-react-parser";
import {
  Calendar,
  Check,
  Globe,
  GlobeIcon,
  Info,
  Instagram,
  Loader2,
  ThumbsUp,
  Users,
} from "lucide-react";

import { AdData } from "@/types/ad";
import { countryCodesAlpha2Flag } from "@/lib/countryCodesAlpha2Flag";
import {
  AdLibraryMobileFocusedStateProviderRefetchQuery,
  AdLibrarySearchPaginationQuery,
} from "@/app/actions/Meta-GraphQL-Queries";

import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { AdCardGrid } from "./microComponents/AdCardGrid";
import LoadingTrigger from "./microComponents/LoadingTrigger";
import PageInfoSection from "./microComponents/PageInfoSection";
import { ScrollButtons } from "./microComponents/ScrollButtons";
import StickyWrapper from "./microComponents/StickyWrapper";
import { SearchBar } from "./searchFilters/SearchBar";

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center space-x-2">
    {icon}
    <span>{label}:</span>
    <span className="font-semibold">{value}</span>
  </div>
);
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
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);

  const handleSearchAds = useCallback(
    async (useExistingParams = false) => {
      setIsLoading(true);
      setError(null);
      try {
        let results;
        if (!searchResults || searchResults.length === 0) {
          // First search
          const variables = getAdLibraryMobileVariables(pageId);
          results =
            await AdLibraryMobileFocusedStateProviderRefetchQuery(variables);
          setPageInfo(results.page_info);
          setPage(results.page);
          setTotalCount(results.count);
        } else {
          // Pagination
          const variables = getAdSearchVariables(
            searchParams,
            useExistingParams ? endCursor : null,
            pageId,
          );
          results = await AdLibrarySearchPaginationQuery(variables);
        }

        if (useExistingParams && searchResults) {
          setSearchResults((prevResults) => [...prevResults!, ...results.ads]);
        } else {
          setSearchResults(results.ads);
        }

        setEndCursor(results.end_cursor);
        setHasNextPage(results.has_next_page);

        // Calculate remaining count
        // only starting the subtraction of RemainingCount when results.count is less than 50001.
        const newRemainingCount =
          results.count >= 50001
            ? results.count
            : results.count - (searchResults?.length || 0) - results.ads.length; //performs the normal subtraction

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
    [searchParams, searchResults, endCursor, pageId],
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
      handleSearchAds();
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
          profilePictureUrl={
            searchResults && searchResults[0].snapshot.page_profile_picture_url
          }
          totalAds={totalCount || 0}
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
      <div className="container mx-auto p-4">
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
                {!isLoading && (
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

export default PageAdBrowser;
