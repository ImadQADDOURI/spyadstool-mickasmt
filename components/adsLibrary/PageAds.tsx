// components/adsLibrary/PageAds.tsx
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

import { Ad, AdsData } from "@/types/ad";
import { FilterParams } from "@/types/filterParams";
import { AdsList } from "@/components/adsLibrary/AdsList";
import { searchAds } from "@/app/actions/search_ads";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import LoadingTrigger from "./LoadingTrigger";

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
      if (isLoading) return;
      setIsLoading(true);
      setError(null);
      try {
        const searchParams: FilterParams = {
          baseUrl: "https://www.facebook.com/ads/library/async/search_ads?",
          view_all_page_id: pageId,
          search_type: "page",
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
    [pageId, searchResults, extractAdsFromResults],
  );

  useEffect(() => {
    if (!initialSearchDone.current) {
      handleSearchAds();
      initialSearchDone.current = true;
    }
  }, [handleSearchAds]);

  const handleLoadMore = useCallback(() => {
    if (searchResults && !searchResults.isResultComplete && !isLoading) {
      handleSearchAds(true);
    }
  }, [searchResults, handleSearchAds, isLoading]);

  const scrollTo = useCallback((position: "top" | "bottom") => {
    window.scrollTo({
      top: position === "top" ? 0 : document.body.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="relative min-h-screen p-4">
      {error && (
        <Card className="mb-4 p-4 text-center text-red-500">
          <p className="font-semibold">{error}</p>
        </Card>
      )}

      {totalCount !== null && (
        <Card className="mb-4 p-4 text-center">
          <p className="text-lg font-bold">
            {totalCount > 50000 ? ">50,000" : "~" + totalCount} Ads Found
          </p>
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
