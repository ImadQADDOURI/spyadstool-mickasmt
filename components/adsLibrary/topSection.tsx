import React, { useState } from "react";

import Category from "@/components/adsLibrary/category";
import Country from "@/components/adsLibrary/country";
import DisplayAds from "@/components/adsLibrary/DisplayAds";
import SearchByKeyword from "@/components/adsLibrary/searchByKeyword";
import { cleanAdData, interfaceCleanedData } from "@/app/actions/cleanAdData";
import { searchAds } from "@/app/actions/search_ads";

export const TopSection = () => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);
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

  const handleSearchAds = async (useExistingParams = false) => {
    setIsLoading(true);
    try {
      const searchParams = {
        countries: [selectedCountry],
        ad_type: selectedCategory,
        q: searchQuery,
        forward_cursor: "",
        backward_cursor: "",
        collation_token: "",
      };

      if (useExistingParams && searchResults) {
        searchParams.forward_cursor = searchResults.forwardCursor;
        searchParams.backward_cursor = searchResults.backwardCursor;
        searchParams.collation_token = searchResults.collationToken;
      }

      const results = await searchAds(searchParams);
      console.log(
        "🚀 ~ file: topSection.tsx:handleSearchAds ~ raw results:",
        results,
      );

      const cleanedResults = cleanAdData(results);

      if (useExistingParams && searchResults) {
        // Combine new results with existing results
        setSearchResults((prevResults) => ({
          ...cleanedResults,
          ads: [...prevResults!.ads, ...cleanedResults.ads],
          totalCount: cleanedResults.totalCount, // Update total count
        }));
      } else {
        setSearchResults(cleanedResults);
      }

      console.log(
        "🚀 ~ file: topSection.tsx:handleSearchAds ~ cleaned results:",
        cleanedResults,
      );
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
        <button
          onClick={() => handleSearchAds()}
          className="mr-2 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? "Searching..." : "Search Ads"}
        </button>
        {searchResults && !searchResults.isResultComplete && (
          <button
            onClick={handleLoadMore}
            className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Load More"}
          </button>
        )}
      </div>
      <DisplayAds data={searchResults} />
    </div>
  );
};

export default TopSection;
