// @/components/adsLibrary/category.tsx
"use client";

import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CategoryProps = {
  onSelectCategory: (value: string) => void;
};

export const Category: React.FC<CategoryProps> = ({ onSelectCategory }) => {
  const [value, setValue] = React.useState("");

  const handleSelect = (currentValue: string) => {
    setValue(currentValue);
    onSelectCategory(currentValue);
  };

  return (
    <Select value={value} onValueChange={handleSelect}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Ad Types</SelectLabel>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="political_and_issue_ads">
            Political and Issue Ads
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default Category;
