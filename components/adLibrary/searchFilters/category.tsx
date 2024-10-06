// @/components/adsLibrary/category.tsx
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  { value: "ALL", label: "All" },
  { value: "CREDIT_ADS", label: " Credit Ads" },
  { value: "EMPLOYMENT_ADS", label: "Employment Ads" },
  { value: "HOUSING_ADS", label: "Housing Ads" },
  { value: "POLITICAL_AND_ISSUE_ADS", label: "Political and Issue Ads" },
];

export const Category: React.FC = React.memo(() => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const value = searchParams.get("ad_type") || "";

  const handleSelect = React.useCallback(
    (newValue: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newValue === "all") {
        params.delete("ad_type");
      } else {
        params.set("ad_type", newValue);
      }
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  return (
    <Select value={value} onValueChange={handleSelect}>
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
});

Category.displayName = "Category";

export default Category;
