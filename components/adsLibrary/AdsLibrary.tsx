// components/adsLibrary/AdsLibrary.tsx

import React, { useCallback, useState } from "react";
import { ArrowDown, ArrowUp, Plus } from "lucide-react";

import { Ad, AdsData } from "@/types/ad";
import { FilterParams } from "@/types/filterParams";
import { AdsList } from "@/components/adsLibrary/AdsList";
import SearchFilters from "@/components/adsLibrary/SearchFilters";
import { searchAds } from "@/app/actions/search_ads";

import { Button } from "../ui/button";
import { Card } from "../ui/card";

export const AdsLibrary = () => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<AdsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);

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
        const searchParams: FilterParams = {
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
          content_languages: selectedLanguages,
          publisher_platforms: selectedPlatforms,
          active_status: selectedStatus,
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

          // Update total count only for new searches
          setTotalCount(adsData.totalCount);
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
      selectedLanguages,
      selectedPlatforms,
      selectedStatus,
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

  const scrollTo = useCallback((position: "top" | "bottom") => {
    window.scrollTo({
      top: position === "top" ? 0 : document.body.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="relative min-h-screen space-y-6 p-4">
      <SearchFilters
        selectedCountry={selectedCountry}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        isLoading={isLoading}
        onSelectCountry={setSelectedCountry}
        onSelectCategory={setSelectedCategory}
        onSearch={setSearchQuery}
        onSearchClick={() => handleSearchAds()}
        selectedLanguages={selectedLanguages}
        onSelectLanguages={setSelectedLanguages}
        selectedPlatforms={selectedPlatforms}
        onSelectPlatforms={setSelectedPlatforms}
        selectedStatus={selectedStatus}
        onSelectStatus={setSelectedStatus}
      />

      {error && <div className="font-semibold text-red-500">{error}</div>}

      {totalCount !== null && (
        <div className="text-lg font-bold">
          {totalCount > 50000 ? ">50,000" : totalCount} Ads Found
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

export default AdsLibrary;
