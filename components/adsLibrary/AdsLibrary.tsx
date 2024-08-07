// components/adsLibrary/AdsLibrary.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Ad, AdsData } from "@/types/ad";
import { FilterParams } from "@/types/filterParams";
import { searchAds } from "@/app/actions/search_ads";

import { ScrollButtons } from "./ScrollButtons";
import { SearchBar } from "./SearchBar";
import { SearchResults } from "./SearchResults";
import StickyWrapper from "./StickyWrapper";

export const AdsLibrary = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [searchResults, setSearchResults] = useState<AdsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [remainingCount, setRemainingCount] = useState<number | null>(null);

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
          sort_data: currentParams.get("sort_data") || null,

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
        <h1 className=" p-4 text-center text-3xl font-bold text-white">
          Ads Library
        </h1>
      </div>

      {/* Sticky SearchBar & Filter Section */}
      <StickyWrapper>
        <div className="bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 p-1 shadow-2xl">
          <div className="container mx-auto">
            <div className="flex flex-col space-y-4 ">
              <SearchBar onSearch={handleSearch} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </StickyWrapper>

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
