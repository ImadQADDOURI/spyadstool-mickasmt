// components/adsLibrary/PageAdsLibrary.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ThumbsUp } from "lucide-react";

import { Ad, AdsData } from "@/types/ad";
import { FilterParams } from "@/types/filterParams";
import { extractAdsFromResults } from "@/lib/adDataExtractor";
import { searchAds } from "@/app/actions/search_ads";

import { ScrollButtons } from "./ScrollButtons";
import { SearchBar } from "./SearchBar";
import { SearchResults } from "./SearchResults";
import StickyWrapper from "./StickyWrapper";

export const PageAdsLibrary = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [searchResults, setSearchResults] = useState<AdsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [remainingCount, setRemainingCount] = useState<number | null>(null);
  const [pageInfo, setPageInfo] = useState<any | null>(null);

  const handleSearchAds = useCallback(
    async (useExistingParams = false, initialLoad = false) => {
      setIsLoading(true);
      setError(null);
      try {
        const currentParams = new URLSearchParams(searchParams.toString());
        const pageId = currentParams.get("pageId");

        const filterParams: FilterParams = {
          q: initialLoad ? "" : currentParams.get("q") || "",
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
          niche_as_keyword: currentParams.get("niche_as_keyword") || null,

          sort_data: currentParams.get("sort_data") || null,
          search_type: currentParams.get("search_type") || "page",

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
          view_all_page_id: pageId || null,
        };

        const Results = await searchAds(filterParams);

        const extractedAds = extractAdsFromResults(Results.payload.results);

        // Set page info on initial load
        if (initialLoad && extractedAds.length > 0) {
          setPageInfo(extractedAds[0].snapshot);
        }

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
    handleSearchAds(false, true);
  }, []);

  // redirects the user to "/dashboard/ad-library" when they click the browser's back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Prevent the default back behavior
      event.preventDefault();

      // Redirect to the dashboard/ad-library
      router.push("/dashboard/ad-library");
    };

    // Add the event listener when the component mounts
    window.addEventListener("popstate", handlePopState);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800">
      {/* Title & Search Section */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500">
        <h1 className="p-4 text-center text-3xl font-bold text-white">
          {searchParams.get("pageId")
            ? `Page ID: ${searchParams.get("pageId")}`
            : "Page ID"}
        </h1>
        {pageInfo && (
          <div className="mb-6 ml-6 flex flex-col items-center space-y-4 md:flex-row md:space-x-6 md:space-y-0">
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
              <p className="mb-2 flex items-center text-lg font-semibold text-white">
                <ThumbsUp className="mr-1 h-5 w-5" />
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

export default PageAdsLibrary;
