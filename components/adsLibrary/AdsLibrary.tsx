// components/adsLibrary/AdsLibrary.tsx

import React, { useCallback, useState } from "react";
import { Plus } from "lucide-react";

import { Ad, AdsData } from "@/types/ad";
import { AdsList } from "@/components/adsLibrary/AdsList";
import SearchFilters from "@/components/adsLibrary/SearchFilters";
import { searchAds } from "@/app/actions/search_ads";

import { Button } from "../ui/button";
import { Card } from "../ui/card";

export const AdsLibrary = () => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<AdsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialTotalCount, setInitialTotalCount] = useState<number | null>(
    null,
  );

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
        const searchParams = {
          countries: [selectedCountry],
          ad_type: selectedCategory,
          q: searchQuery,
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
        } else {
          setSearchResults(adsData);

          // Set the initial total count only on the first search
          if (initialTotalCount === null) {
            setInitialTotalCount(adsData.totalCount);
          }
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
    [
      selectedCountry,
      selectedCategory,
      searchQuery,
      searchResults,
      extractAdsFromResults,
    ],
  );

  const handleLoadMore = useCallback(() => {
    if (searchResults && !searchResults.isResultComplete) {
      handleSearchAds(true);
    }
  }, [searchResults, handleSearchAds]);

  return (
    <div className="space-y-6 p-4">
      <SearchFilters
        selectedCountry={selectedCountry}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        isLoading={isLoading}
        onSelectCountry={setSelectedCountry}
        onSelectCategory={setSelectedCategory}
        onSearch={setSearchQuery}
        onSearchClick={() => handleSearchAds()}
      />

      {error && <div className="font-semibold text-red-500">{error}</div>}

      {initialTotalCount !== null && (
        <div className="text-lg font-bold">
          {initialTotalCount > 50000 ? ">50,000" : initialTotalCount} Ads Found
        </div>
      )}

      {searchResults && searchResults.ads.length > 0 ? (
        <>
          <AdsList ads={searchResults.ads} />
          {!searchResults.isResultComplete && (
            <Card className="mt-4 flex items-center justify-center p-4">
              <Button onClick={handleLoadMore} disabled={isLoading}>
                <Plus className="mr-2 h-4 w-4" />
                {isLoading ? "Loading..." : "Load More Ads"}
              </Button>
            </Card>
          )}
        </>
      ) : (
        searchResults && (
          <p>No ads found. Try adjusting your search criteria.</p>
        )
      )}
    </div>
  );
};

export default AdsLibrary;
