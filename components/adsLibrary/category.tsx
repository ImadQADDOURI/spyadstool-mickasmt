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
  onSelectCategory: (value: string | null) => void;
  clear?: boolean;
};

const categories = [
  { value: "all", label: "All" },
  { value: "political_and_issue_ads", label: "Political and Issue Ads" },
];

export const Category: React.FC<CategoryProps> = React.memo(
  ({ onSelectCategory, clear = false }) => {
    const [value, setValue] = React.useState<string | null>(null);

    React.useEffect(() => {
      if (clear) {
        setValue(null);
        onSelectCategory(null);
      }
    }, [clear, onSelectCategory]);

    const handleSelect = React.useCallback(
      (currentValue: string) => {
        const newValue = currentValue === value ? null : currentValue;
        setValue(newValue);
        onSelectCategory(newValue);
      },
      [value, onSelectCategory],
    );

    return (
      <Select value={value || undefined} onValueChange={handleSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Ad Types</SelectLabel>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  },
);

Category.displayName = "Category";

export default Category;
