"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronsUpDown, ChevronUp, X } from "lucide-react";

import { countryCodesAlpha2Flag } from "@/lib/countryCodesAlpha2Flag";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const Country: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredCountries, setFilteredCountries] = React.useState(
    countryCodesAlpha2Flag,
  );

  const values = searchParams.get("countries")?.split(",") || ["ALL"];

  const handleSelect = (currentValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    let newValues: string[];

    if (currentValue === "ALL") {
      newValues = ["ALL"];
    } else if (values.includes("ALL")) {
      newValues = [currentValue];
    } else {
      newValues = values.includes(currentValue)
        ? values.filter((v) => v !== currentValue)
        : [...values, currentValue];
    }

    if (newValues.length === 0) {
      newValues = ["ALL"];
    }

    params.set("countries", newValues.join(","));
    router.push(`?${params.toString()}`);
  };

  const handleRemove = (valueToRemove: string) => {
    if (valueToRemove === "ALL" || values.length === 1) {
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    const newValues = values.filter((v) => v !== valueToRemove);
    params.set("countries", newValues.join(","));
    router.push(`?${params.toString()}`);
  };

  const selectedCountries = values.includes("ALL")
    ? [countryCodesAlpha2Flag[0]]
    : values
        .map((value) =>
          countryCodesAlpha2Flag.find((country) => country.value === value),
        )
        .filter(Boolean);

  const handleSearch = React.useCallback((term: string) => {
    setSearchTerm(term);
    const filtered = countryCodesAlpha2Flag.filter((country) => {
      const matchesLabel = country.label
        .toLowerCase()
        .includes(term.toLowerCase());
      const matchesValue = country.value
        .toLowerCase()
        .includes(term.toLowerCase());
      return matchesLabel || matchesValue;
    });
    setFilteredCountries(filtered);
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-auto min-h-[2.5rem] w-full justify-between px-3 py-2"
        >
          <div className="flex flex-wrap items-center gap-2">
            {selectedCountries.map((country) => (
              <div key={country?.value} className="group relative">
                <img
                  src={country?.icon}
                  alt={`${country?.label} flag`}
                  className="h-6 w-6 rounded-full border border-input transition-all duration-200 group-hover:opacity-30"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <div className="rounded-full bg-destructive p-1">
                    <X
                      className="h-4 w-4 cursor-pointer text-destructive-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(country?.value || "");
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <div className="flex items-center border-b border-border px-3 py-2">
          <input
            className="flex h-10 w-full rounded-md bg-background py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Search country..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <ChevronUp
            className="ml-2 h-6 w-6 shrink-0 cursor-pointer opacity-50"
            onClick={() => setOpen(false)}
          />
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {filteredCountries.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </div>
          ) : (
            filteredCountries.map((country) => (
              <div
                key={country.value}
                className={cn(
                  "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                  "hover:bg-accent hover:text-accent-foreground",
                  values.includes(country.value) &&
                    "bg-accent text-accent-foreground",
                )}
                onClick={() => handleSelect(country.value)}
              >
                <img
                  src={country.icon}
                  alt={`${country.label} flag`}
                  className="mr-2 h-5 w-5 flex-shrink-0 rounded-sm"
                />
                <span className="flex-grow">{country.label}</span>
                {values.includes(country.value) && (
                  <Check className="ml-auto h-4 w-4 opacity-100" />
                )}
              </div>
            ))
          )}
        </div>
        {/* <div className="border-t border-border p-2">
          <Button className="w-full" onClick={() => setOpen(false)}>
            Done
          </Button>
        </div> */}
      </PopoverContent>
    </Popover>
  );
};

export default Country;
