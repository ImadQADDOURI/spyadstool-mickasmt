// components/adsLibrary/AdsLibrary.tsx

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";

import { Ad, AdsData } from "@/types/ad";
import { FilterParams } from "@/types/filterParams";
import { searchAds } from "@/app/actions/search_ads";

import { Button } from "../ui/button";
import { FilterPanel } from "./FilterPanel";
import { ScrollButtons } from "./ScrollButtons";
import { SearchBar } from "./SearchBar";
import { SearchResults } from "./SearchResults";

export const AdsLibrary = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [searchResults, setSearchResults] = useState<AdsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [remainingCount, setRemainingCount] = useState<number | null>(null);

  const [isPanelOpen, setIsPanelOpen] = useState(false);

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
    async (useExistingParams = false) => {
      setIsLoading(true);
      setError(null);
      try {
        const currentParams = new URLSearchParams(searchParams.toString());
        const filterParams: FilterParams = {
          q: currentParams.get("q") || "",
          countries: currentParams.get("countries")?.split(",") || null,
          ad_type: currentParams.get("ad_type") || null,
          content_languages:
            currentParams.get("content_languages")?.split(",") || null,
          publisher_platforms:
            currentParams.get("publisher_platforms")?.split(",") || null,
          active_status: currentParams.get("active_status") || null,
          media_type: currentParams.get("media_type") || null,
          start_date_min: currentParams.get("start_date") || null,
          start_date_max: currentParams.get("end_date") || null,
          category_as_keyword: currentParams.get("category_as_keyword") || null,
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

        const Results = await searchAds(filterParams);

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
            ads: [...prevResults!.ads, ...adsData.ads],
          }));
          setRemainingCount(Results.payload.totalCount - adsData.ads.length);
        } else {
          setSearchResults(adsData);
          setTotalCount(adsData.totalCount);
          setRemainingCount(adsData.totalCount - adsData.ads.length);
        }
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
    [searchParams, searchResults, extractAdsFromResults],
  );

  const handleLoadMore = useCallback(() => {
    if (searchResults && !searchResults.isResultComplete && !isLoading) {
      handleSearchAds(true);
    }
  }, [searchResults, handleSearchAds, isLoading]);

  const performSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("q", searchQuery);
    router.push(`?${params.toString()}`);
    handleSearchAds();
  };

  // Clear all filters
  const clearAllFilters = () => {
    router.push("/dashboard/ad-library");
    setSearchQuery("");
    setSearchResults(null);
    setTotalCount(null);
    setRemainingCount(null);
  };

  // Clear all filters on page refresh
  useEffect(() => {
    if (typeof window !== "undefined" && window.performance) {
      if (performance.navigation.type === 1) {
        // Check if it's a page refresh
        router.push("/dashboard/ad-library");
      }
    }
  }, [router]);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      handleSearchAds();
    },
    [handleSearchAds],
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Title */}
      <h1 className="bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 p-4 text-center text-3xl font-bold text-white">
        Ads Library
      </h1>

      {/* Filter Panel Component */}
      <FilterPanel
        isPanelOpen={isPanelOpen}
        setIsPanelOpen={setIsPanelOpen}
        performSearch={performSearch}
        clearAllFilters={clearAllFilters}
      />

      {/* Search Section */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 p-6 shadow-lg">
        <div className="container mx-auto">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
            <Button
              onClick={() => setIsPanelOpen(true)}
              aria-label="Open filters panel"
              className="relative overflow-hidden rounded-full bg-white bg-opacity-20 p-0.5 text-white transition-all hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            >
              <span className="relative flex items-center px-6 py-2">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Search Results Component */}
      <SearchResults
        isLoading={isLoading}
        error={error}
        totalCount={totalCount}
        searchResults={searchResults}
        handleLoadMore={handleLoadMore}
        remainingCount={remainingCount}
      />

      {/* Scroll buttons */}
      <ScrollButtons />
    </div>
  );
};

export default AdsLibrary;
