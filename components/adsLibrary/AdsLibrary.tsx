// components/adsLibrary/AdsLibrary.tsx

import React, { useCallback, useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";

import { Ad, AdsData } from "@/types/ad";
import { FilterParams } from "@/types/filterParams";
import { AdsList } from "@/components/adsLibrary/AdsList";
import { searchAds } from "@/app/actions/search_ads";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import Category from "./category";
import Country from "./country";
import EndDate from "./endDate";
import Language from "./language";
import LoadingTrigger from "./LoadingTrigger";
import Media from "./media";
import Platform from "./platform";
import SearchByKeyword from "./searchByKeyword";
import StartDate from "./startDate";
import Status from "./status";

export const AdsLibrary = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<string[] | null>(
    null,
  );
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[] | null>(
    null,
  );
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<AdsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [remainingCount, setRemainingCount] = useState<number | null>(null);

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [appliedFiltersCount, setAppliedFiltersCount] = useState(0);

  // Count applied filters
  const countAppliedFilters = useCallback(() => {
    let count = 0;
    if (selectedCountry) count++;
    if (selectedCategory) count++;
    if (selectedLanguages) count++;
    if (selectedPlatforms) count++;
    if (selectedStatus) count++;
    if (selectedMedia) count++;
    if (startDate) count++;
    if (endDate) count++;
    setAppliedFiltersCount(count);
  }, [
    selectedCountry,
    selectedCategory,
    selectedLanguages,
    selectedPlatforms,
    selectedStatus,
    selectedMedia,
    startDate,
    endDate,
  ]);
  //
  useEffect(() => {
    countAppliedFilters();
  }, [countAppliedFilters]);

  // Clear all filters
  const [clearFilters, setClearFilters] = useState(false);
  const clearAllFilters = () => {
    setClearFilters(true);
    setSelectedCountry("");
    setSelectedCategory("");
    setSelectedLanguages([]);
    setSelectedPlatforms([]);
    setSelectedStatus("");
    setSelectedMedia(null);
    setStartDate(null);
    setEndDate(null);
  };
  // Reset clearFilters after it's been applied
  useEffect(() => {
    if (clearFilters) {
      setClearFilters(false);
    }
  }, [clearFilters]);

  // Apply filters
  const applyFilters = () => {
    handleSearchAds();
    setIsPanelOpen(false);
  };

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

  // start date & end date validation
  const handleStartDateChange = (date: string | null) => {
    setStartDate(date);
    if (date && endDate && new Date(date) > new Date(endDate)) {
      setEndDate(date);
    }
  };
  const handleEndDateChange = (date: string | null) => {
    setEndDate(date);
    if (date && startDate && new Date(date) < new Date(startDate)) {
      setStartDate(date);
    }
  };

  const handleSearchAds = useCallback(
    async (useExistingParams = false) => {
      setIsLoading(true);
      setError(null);
      try {
        const searchParams: FilterParams = {
          q: searchQuery,

          countries: selectedCountry ? [selectedCountry] : null,
          ad_type: selectedCategory,
          content_languages: selectedLanguages,
          publisher_platforms: selectedPlatforms,
          active_status: selectedStatus,
          media_type: selectedMedia,
          start_date_min: startDate,
          start_date_max: endDate,

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
          // Update remaining count
          setRemainingCount(Results.payload.totalCount - adsData.ads.length);
        } else {
          setSearchResults(adsData);

          // Update total count only for new searches
          setTotalCount(adsData.totalCount);
          // Set initial remaining count
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
    [
      endDate,
      startDate,
      selectedMedia,
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
      <Button onClick={() => setIsPanelOpen(true)} className="mb-4">
        Filters {appliedFiltersCount > 0 && `(${appliedFiltersCount})`}
      </Button>
      <>
        {/* Sliding Panel */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-background shadow-lg transition-transform duration-300 ease-in-out ${isPanelOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="h-full overflow-y-auto p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Filters</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPanelOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Filter components */}
            <div className="space-y-4">
              <Country
                onSelectCountry={setSelectedCountry}
                clear={clearFilters}
              />
              <Category
                onSelectCategory={setSelectedCategory}
                clear={clearFilters}
              />
              <Language
                onSelectLanguages={setSelectedLanguages}
                clear={clearFilters}
              />
              <Platform
                onSelectPlatforms={setSelectedPlatforms}
                clear={clearFilters}
              />
              <Status onSelectStatus={setSelectedStatus} clear={clearFilters} />
              <Media onSelectMedia={setSelectedMedia} clear={clearFilters} />
              <StartDate
                onSelectStartDate={handleStartDateChange}
                start_date_min={startDate}
                maxDate={endDate || undefined}
                clear={clearFilters}
              />
              <EndDate
                onSelectEndDate={handleEndDateChange}
                start_date_max={endDate}
                minDate={startDate || undefined}
                clear={clearFilters}
              />
            </div>

            <div className="mt-4 space-y-2">
              <Button
                onClick={clearAllFilters}
                variant="outline"
                className="w-full"
              >
                Clear All
              </Button>
              <Button onClick={applyFilters} className="w-full">
                Apply
              </Button>
            </div>
          </div>
        </div>
      </>
      {/* Main content */}
      <div className="space-y-4">
        <div className="flex space-x-2">
          <SearchByKeyword onSearch={setSearchQuery} />
          <Button onClick={() => handleSearchAds()} disabled={isLoading}>
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </div>

        {error && <div className="font-semibold text-red-500">{error}</div>}

        {totalCount !== null && (
          <div className="text-lg font-bold">
            {totalCount > 50000 ? ">50,000" : "~" + totalCount} Ads Found
          </div>
        )}

        {/* Rest of component (AdsList, Load More button, etc.) */}
        {searchResults && searchResults.ads.length > 0 ? (
          // <>
          //   <AdsList ads={searchResults.ads} />
          //   {!searchResults.isResultComplete && (
          //     <Card className="mt-4 flex flex-col items-center justify-center p-4">
          //       <Button onClick={handleLoadMore} disabled={isLoading}>
          //         <Plus className="mr-2 h-4 w-4" />
          //         {isLoading ? "Loading..." : "Load More Ads"}
          //       </Button>
          //       {remainingCount !== null && (
          //         <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          //           {remainingCount} more ads available
          //         </p>
          //       )}
          //     </Card>
          //   )}
          // </>
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
                {remainingCount !== null && (
                  <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    {remainingCount} more ads available
                  </p>
                )}
              </>
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
    </div>
  );
};

export default AdsLibrary;
