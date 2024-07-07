// components/adsLibrary/AdsLibrary.tsx

import React, { useState } from "react";
import { Plus } from "lucide-react";

import { Ad, AdsData } from "@/types/ad";
import { AdsList } from "@/components/adsLibrary/AdsList";
import Category from "@/components/adsLibrary/category";
import Country from "@/components/adsLibrary/country";
import SearchByKeyword from "@/components/adsLibrary/searchByKeyword";
import { searchAds } from "@/app/actions/search_ads";

import { Button } from "../ui/button";
import { Card } from "../ui/card";

export const AdsLibrary = () => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<AdsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectCountry = (value: string) => {
    setSelectedCountry(value);
  };
  const handleSelectCategory = (value: string) => {
    setSelectedCategory(value);
  };
  const handleSearch = (keyword: string) => {
    setSearchQuery(keyword);
  };

  const extractAdsFromResults = (results: any[]): Ad[] => {
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
  };

  const handleSearchAds = async (useExistingParams = false) => {
    setIsLoading(true);
    try {
      const searchParams = {
        countries: [selectedCountry],
        ad_type: selectedCategory,
        q: searchQuery,
        forward_cursor:
          useExistingParams && searchResults ? searchResults.forwardCursor : "",
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
      }
    } catch (error) {
      console.error("Error searching ads:", error);
      setSearchResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (searchResults && !searchResults.isResultComplete) {
      handleSearchAds(true);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="mb-2 text-2xl font-bold">
          Selected Country: {selectedCountry}
        </h1>
        <Country onSelectCountry={handleSelectCountry} />
      </div>
      <div className="mb-4">
        <h1 className="mb-2 text-2xl font-bold">
          Selected Category: {selectedCategory}
        </h1>
        <Category onSelectCategory={handleSelectCategory} />
      </div>
      <div className="mb-4">
        <h1 className="mb-2 text-2xl font-bold">Search Query: {searchQuery}</h1>
        <SearchByKeyword onSearch={handleSearch} />
      </div>

      <div className="mb-4">
        <Button
          onClick={() => handleSearchAds()}
          className="mr-2"
          disabled={isLoading}
        >
          {isLoading ? "Searching..." : "Search Ads"}
        </Button>
      </div>
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
        <p>No ads found. Try adjusting your search criteria.</p>
      )}
    </div>
  );
};

export default AdsLibrary;
