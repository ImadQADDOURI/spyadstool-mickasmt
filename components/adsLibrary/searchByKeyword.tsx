// @/components/adsLibrary/searchByKeyword.tsx
"use client";

import * as React from "react";

type SearchByKeywordProps = {
  onSearch: (keyword: string) => void;
};

const SearchByKeyword: React.FC<SearchByKeywordProps> = ({ onSearch }) => {
  const [keyword, setKeyword] = React.useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setKeyword(newValue);
    onSearch(newValue);
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <input
        type="text"
        value={keyword}
        onChange={handleInputChange}
        placeholder="Search by keyword..."
        className="w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default SearchByKeyword;
