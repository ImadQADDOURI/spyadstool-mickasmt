// components/adsLibrary/PageAds.tsx
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, Loader2, Search, X } from "lucide-react";

import { Ad, AdsData } from "@/types/ad";
import { FilterParams } from "@/types/filterParams";
import { AdsList } from "@/components/adsLibrary/AdsList";
import { searchAds } from "@/app/actions/search_ads";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import LoadingTrigger from "./LoadingTrigger";
import { ScrollButtons } from "./ScrollButtons";

interface PageAdsProps {
  pageId: string;
}

export const PageAds: React.FC<PageAdsProps> = ({ pageId }) => {
  const [searchResults, setSearchResults] = useState<AdsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [remainingCount, setRemainingCount] = useState<number | null>(null);
  const initialSearchDone = useRef(false);
  const [pageInfo, setPageInfo] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const extractAdsFromResults = useCallback((results: any[]): Ad[] => {
    return results.flatMap((monthGroup) =>
      monthGroup
        .filter((ad: any) => ad.collationCount !== undefined)
        .map((ad: any) => ({
          adid: ad.adid,
          adArchiveID: ad.adArchiveID,
          collationCount: ad.collationCount,
          collationID: ad.collationID,
          currency: ad.currency,
          startDate: ad.startDate,
          endDate: ad.endDate,
          pageName: ad.pageName,
          pageID: ad.pageID,
          publisherPlatform: ad.publisherPlatform,
          isActive: ad.isActive,
          snapshot: ad.snapshot,
          categories: ad.categories,
          impressionsWithIndex: ad.impressionsWithIndex,
          spend: ad.spend,
          reachEstimate: ad.reachEstimate,
          entityType: ad.entityType,
          gatedType: ad.gatedType,
          hideDataStatus: ad.hideDataStatus,
        })),
    );
  }, []);

  const handleSearchAds = useCallback(
    async (useExistingParams = false, query = "") => {
      if (!pageId || isLoading) return;
      setIsLoading(true);
      setError(null);
      try {
        const searchParams: FilterParams = {
          baseUrl: "https://www.facebook.com/ads/library/async/search_ads?",
          view_all_page_id: pageId,
          search_type: "page",
          q: query,
          forward_cursor:
            useExistingParams && searchResults
              ? searchResults.forwardCursor
              : "",
          backward_cursor:
            useExistingParams && searchResults
              ? searchResults.backwardCursor
              : "",
          collation_token:
            useExistingParams && searchResults
              ? searchResults.collationToken
              : "",
        };

        const Results = await searchAds(searchParams);

        if (!Results || !Results.payload || !Results.payload.results) {
          throw new Error("Invalid response from searchAds");
        }

        const extractedAds = extractAdsFromResults(Results.payload.results);

        const adsData: AdsData = {
          isResultComplete: Results.payload.isResultComplete,
          forwardCursor: Results.payload.forwardCursor,
          backwardCursor: Results.payload.backwardCursor,
          totalCount: Results.payload.totalCount,
          collationToken: Results.payload.collationToken,
          ads: extractedAds,
        };

        if (useExistingParams && searchResults) {
          setSearchResults((prevResults) => ({
            ...adsData,
            ads: [...(prevResults?.ads || []), ...adsData.ads],
          }));
        } else {
          setSearchResults(adsData);
          setTotalCount(adsData.totalCount);
        }

        setRemainingCount(adsData.totalCount - adsData.ads.length);

        // Set page info from the first ad
        if (extractedAds.length > 0 && !pageInfo) {
          const firstAd = extractedAds[0];
          setPageInfo(firstAd.snapshot);
        }
      } catch (error) {
        console.error("Error searching ads:", error);
        setError(
          error instanceof Error
            ? error.message
            : "An error occurred while fetching ads. Please try again.",
        );
        setSearchResults(null);
      } finally {
        setIsLoading(false);
      }
    },
    [pageId, searchResults, isLoading, extractAdsFromResults, pageInfo],
  );

  useEffect(() => {
    if (!initialSearchDone.current && pageId) {
      handleSearchAds();
      initialSearchDone.current = true;
    }
  }, [handleSearchAds, pageId]);

  const handleLoadMore = useCallback(() => {
    if (searchResults && !searchResults.isResultComplete && !isLoading) {
      handleSearchAds(true, searchQuery);
    }
  }, [searchResults, handleSearchAds, isLoading, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchResults(null); // Clear existing results
    handleSearchAds(false, searchQuery);
  };

  const handleReset = () => {
    setSearchQuery("");
    setSearchResults(null);
    handleSearchAds(false, "");
  };

  if (!pageId) {
    return <div>No page ID provided</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Title and Search Section */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 p-6 shadow-lg">
        <div className="container mx-auto">
          <h1 className="mb-4 text-center text-3xl font-bold text-white">
            Page Ads
          </h1>

          {pageInfo && (
            <div className="mb-6 flex flex-col items-center space-y-4 md:flex-row md:space-x-6 md:space-y-0">
              <Image
                src={pageInfo.page_profile_picture_url}
                alt={pageInfo.page_name}
                width={80}
                height={80}
                className="rounded-full border-4 border-white"
              />
              <div className="flex-1 text-center md:text-left">
                <h2 className="mb-2 text-2xl font-bold text-white">
                  {pageInfo.page_name}
                </h2>
                <p className="mb-1 text-sm text-white opacity-80">
                  {pageInfo.page_categories &&
                    Object.values(pageInfo.page_categories).join(", ")}
                </p>
                <p className="mb-2 text-lg font-semibold text-white">
                  {pageInfo.page_like_count.toLocaleString()} Likes
                </p>
                <a
                  href={pageInfo.page_profile_uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-full bg-white bg-opacity-20 px-4 py-1 text-sm font-semibold text-white transition-all hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                >
                  Visit Page
                </a>
              </div>
            </div>
          )}

          {/* Search Section */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Search ads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch(e)}
                aria-label="Search ads"
                className="w-full rounded-full border-none bg-white bg-opacity-20 px-6 py-3 text-white placeholder-white placeholder-opacity-75 focus:outline-none focus:ring-2 focus:ring-white"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full text-white hover:bg-white hover:bg-opacity-20"
                  onClick={handleReset}
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              aria-label="Search ads"
              className="relative overflow-hidden rounded-full bg-white bg-opacity-20 p-0.5 text-white transition-all hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            >
              <span className="relative flex items-center px-6 py-2">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Search className="mr-2 h-4 w-4" />
                )}
                Search
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
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
            <span className="inline-block rounded-full bg-purple-100 px-6 py-3 text-lg font-bold text-purple-800 shadow-md dark:bg-purple-900 dark:text-purple-200">
              {totalCount > 50000 ? ">50,000" : "~" + totalCount} Ads Found
            </span>
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
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
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
                {remainingCount !== null && remainingCount > 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {remainingCount} more ads available
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          searchResults && (
            <p className="text-center text-lg text-gray-600 dark:text-gray-400">
              No ads found for this page. Try adjusting your search criteria.
            </p>
          )
        )}

        {/* Scroll buttons */}
        <ScrollButtons />
      </div>
    </div>
  );
};

export default PageAds;
