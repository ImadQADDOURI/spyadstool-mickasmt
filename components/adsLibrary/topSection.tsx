import React, { useState } from "react";

import Category from "@/components/adsLibrary/category";
import Country from "@/components/adsLibrary/country";
import SearchByKeyword from "@/components/adsLibrary/searchByKeyword";
import { searchAds } from "@/app/actions/search_ads";

export const TopSection = () => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);

  const handleSelectCountry = (value: string) => {
    setSelectedCountry(value);
  };
  const handleSelectCategory = (value: string) => {
    setSelectedCategory(value);
  };
  const handleSearch = (keyword: string) => {
    setSearchQuery(keyword);
  };

  const handleSearchAds = async () => {
    try {
      const results = await searchAds({
        countries: [selectedCountry],
        ad_type: selectedCategory,
        q: searchQuery,
      });

      console.log(
        "🚀 ~ file: topSection.tsx:handleSearchAds ~ results:",
        results,
      );

      // Set the entire results object
      setSearchResults(results);
    } catch (error) {
      console.error("🚀 ~ Error searching ads:", error);
      setSearchResults(null);
    }
  };

  return (
    <>
      <div>
        <h1>Selected Country: {selectedCountry}</h1>
        <Country onSelectCountry={handleSelectCountry} />
      </div>
      <div>
        <h1>Selected Category: {selectedCategory}</h1>
        <Category onSelectCategory={handleSelectCategory} />
      </div>
      <div>
        <h1>Search Query: {searchQuery}</h1>
        <SearchByKeyword onSearch={handleSearch} />
      </div>
      <div>
        <button
          onClick={handleSearchAds}
          className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white"
        >
          Search Ads
        </button>
      </div>

      <div>
        <h2>Search Results:</h2>
        {searchResults ? (
          <pre>{JSON.stringify(searchResults, null, 2)}</pre>
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </>
  );
};

export default TopSection;
