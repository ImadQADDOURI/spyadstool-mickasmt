// components/adsLibrary/PageAds.tsx
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, Search, X } from "lucide-react";

import { Ad, AdsData } from "@/types/ad";
import { FilterParams } from "@/types/filterParams";
import { AdsList } from "@/components/adsLibrary/AdsList";
import { searchAds } from "@/app/actions/search_ads";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import LoadingTrigger from "./LoadingTrigger";

interface PageAdsProps {
  pageId: string;
}

export const PageAds: React.FC<PageAdsProps> = ({ pageId }) => {
  // check if pageId is provided
  if (!pageId) {
    return <div>No page ID provided</div>;
  }

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
      if (isLoading) return;
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
    [pageId, searchResults, extractAdsFromResults, pageInfo],
  );

  useEffect(() => {
    if (!initialSearchDone.current) {
      handleSearchAds();
      initialSearchDone.current = true;
    }
  }, [handleSearchAds]);

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

  const scrollTo = useCallback((position: "top" | "bottom") => {
    window.scrollTo({
      top: position === "top" ? 0 : document.body.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  const handleReset = () => {
    setSearchQuery("");
    setSearchResults(null);
    handleSearchAds(false, "");
  };

  return (
    <div className="relative min-h-screen p-4">
      <Card className="mb-6 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          {pageInfo && (
            <div className="mb-6 flex flex-col items-center space-y-4 md:flex-row md:space-x-6 md:space-y-0">
              <Image
                src={pageInfo.page_profile_picture_url}
                alt={pageInfo.page_name}
                width={100}
                height={100}
                className="rounded-full border-4 border-white"
              />
              <div className="flex-1 text-center md:text-left">
                <h2 className="mb-2 text-3xl font-bold">
                  {pageInfo.page_name}
                </h2>
                <p className="mb-1 text-sm opacity-80">
                  {pageInfo.page_categories &&
                    Object.values(pageInfo.page_categories).join(", ")}
                </p>
                <p className="mb-2 text-lg font-semibold">
                  {pageInfo.page_like_count.toLocaleString()} Likes
                </p>
                <a
                  href={pageInfo.page_profile_uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-full bg-white px-4 py-2 font-semibold text-blue-600 transition-colors hover:bg-opacity-90"
                >
                  Visit Page
                </a>
              </div>
            </div>
          )}
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Search ads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-none bg-white bg-opacity-20 pr-20  text-white placeholder-white placeholder-opacity-75"
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-12 top-1/2 -translate-y-1/2 transform text-white hover:text-blue-200"
                onClick={handleReset}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <Button
              type="submit"
              className="absolute right-0 top-0 h-full bg-white bg-opacity-20 text-white hover:bg-opacity-30"
              disabled={isLoading}
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
        {totalCount !== null && (
          <div className="bg-gray-100 p-4 text-center dark:bg-gray-800">
            <p className="text-lg font-bold">
              {totalCount > 50000 ? ">50,000" : "~" + totalCount} Ads Found
            </p>
          </div>
        )}
      </Card>

      {error && (
        <Card className="mb-4 p-4 text-center text-red-500">
          <p className="font-semibold">{error}</p>
        </Card>
      )}

      {searchResults && searchResults.ads.length > 0 ? (
        <>
          <AdsList ads={searchResults.ads} />
          {!searchResults.isResultComplete && (
            <>
              <LoadingTrigger
                onIntersect={handleLoadMore}
                isLoading={isLoading}
              />
              {isLoading && (
                <div className="mt-4 text-center">
                  <p>Loading more ads...</p>
                </div>
              )}
              {remainingCount !== null && remainingCount > 0 && (
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                  {remainingCount} more ads available
                </p>
              )}
            </>
          )}
        </>
      ) : (
        searchResults && (
          <Card className="p-4 text-center">
            <p>No ads found for this page.</p>
          </Card>
        )
      )}

      <div className="fixed bottom-16 right-2 flex flex-col space-y-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => scrollTo("top")}
          className="rounded-full bg-background/80 backdrop-blur-sm transition-opacity hover:opacity-100 dark:bg-background/20 dark:hover:bg-gray-700"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => scrollTo("bottom")}
          className="rounded-full bg-background/80 backdrop-blur-sm transition-opacity hover:opacity-100 dark:bg-background/20 dark:hover:bg-gray-700"
          aria-label="Scroll to bottom"
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PageAds;
