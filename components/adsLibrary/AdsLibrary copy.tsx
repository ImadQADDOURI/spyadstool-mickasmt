// components/adsLibrary/AdsLibrary.tsx

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  Filter,
  Loader2,
  Plus,
  Search,
  X,
} from "lucide-react";

import { Ad, AdsData } from "@/types/ad";
import { FilterParams } from "@/types/filterParams";
import { AdsList } from "@/components/adsLibrary/AdsList";
import { searchAds } from "@/app/actions/search_ads";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Category from "./category";
import CategoryAsKeyword from "./categoryAsKeyword";
import Country from "./country";
import EndDate from "./endDate";
import Language from "./language";
import LoadingTrigger from "./LoadingTrigger";
import Media from "./media";
import Platform from "./platform";
import { ScrollButtons } from "./ScrollButtons";
import StartDate from "./startDate";
import Status from "./status";

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

  // Enter search
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      performSearch();
    }
  };

  const performSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("q", searchQuery);
    router.push(`?${params.toString()}`);
    handleSearchAds();
  };

  // X Reset filters
  const resetSearch = () => {
    setSearchQuery("");
    router.push("/dashboard/ad-library");
    setSearchResults(null);
    setTotalCount(null);
    setRemainingCount(null);
  };

  // Count applied filters
  const countAppliedFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    return Array.from(params.keys()).filter((key) => key !== "q").length;
  }, [searchParams]);

  // Apply filters
  const applyFilters = () => {
    performSearch();
    setIsPanelOpen(false);
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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Title */}
      <h1 className="bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 p-4 text-center text-3xl font-bold text-white">
        Ads Library
      </h1>

      {/* Sliding Panel */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 transform overflow-y-auto bg-white p-6 shadow-lg transition-transform duration-300 ease-in-out dark:bg-gray-800 ${
          isPanelOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-2xl font-bold text-transparent">
            Filters
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPanelOpen(false)}
            className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Filter components */}
        <div className="space-y-6">
          <Category />
          <Country />
          <CategoryAsKeyword />
          <Language />
          <Media />
          <Platform />
          <Status />
          <StartDate />
          <EndDate />
        </div>

        <div className="mt-8 space-y-4">
          <Button
            onClick={clearAllFilters}
            variant="outline"
            className="w-full rounded-full border-2 border-gray-300 bg-transparent px-6 py-2 text-gray-700 transition-all hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Clear All
          </Button>
          <Button
            onClick={applyFilters}
            className="w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-2 text-white transition-all hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 p-6 shadow-lg">
        <div className="container mx-auto">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Search ads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                aria-label="Search ads"
                className="w-full rounded-full border-none bg-white bg-opacity-20 px-6 py-3 text-white placeholder-white placeholder-opacity-75 focus:outline-none focus:ring-2 focus:ring-white"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full text-white hover:bg-white hover:bg-opacity-20"
                  onClick={resetSearch}
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Button
              onClick={() => handleSearchAds()}
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
            <Button
              onClick={() => setIsPanelOpen(true)}
              aria-label="Open filters panel"
              className="relative overflow-hidden rounded-full bg-white bg-opacity-20 p-0.5 text-white transition-all hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            >
              <span className="relative flex items-center px-6 py-2">
                <Filter className="mr-2 h-4 w-4" />
                Filters{" "}
                {countAppliedFilters() > 0 && `(${countAppliedFilters()})`}
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

        {/* Scroll buttons */}
        <ScrollButtons />
      </div>
    </div>
  );
};

export default AdsLibrary;
