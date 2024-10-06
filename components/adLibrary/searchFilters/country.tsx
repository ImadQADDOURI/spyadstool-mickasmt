"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { countryCodesAlpha2Flag } from "@/lib/countryCodesAlpha2Flag";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const Country: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCountries = searchParams.get("countries")?.split(",") || [];

  const updateURL = React.useCallback(
    (newCountries: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newCountries.length === 0) {
        params.delete("countries");
      } else {
        params.set("countries", newCountries.join(","));
      }
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const handleSelect = (countryCode: string) => {
    const newSelection = selectedCountries.includes(countryCode)
      ? selectedCountries.filter((code) => code !== countryCode)
      : [...selectedCountries, countryCode];
    updateURL(newSelection);
  };

  const handleRemove = (countryCode: string) => {
    const newSelection = selectedCountries.filter(
      (code) => code !== countryCode,
    );
    updateURL(newSelection);
  };

  const handleDeselectAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateURL([]);
  };

  const visibleSelections = selectedCountries.slice(0, 2);
  const remainingCount = selectedCountries.length - visibleSelections.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-auto min-h-[2.5rem] w-full justify-between py-2"
        >
          <div className="mr-2 flex flex-wrap items-center gap-1">
            {selectedCountries.length > 0 ? (
              <>
                {visibleSelections.map((code) => {
                  const country = countryCodesAlpha2Flag.find(
                    (c) => c.value === code,
                  );
                  return (
                    <Badge key={code} variant="secondary" className="mr-1">
                      <img
                        src={country?.icon}
                        alt={`${country?.label} flag`}
                        className="mr-1 inline-block h-5 w-5 rounded-sm"
                      />
                      {country?.value}
                      <button
                        className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleRemove(code);
                          }
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(code);
                        }}
                      >
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </button>
                    </Badge>
                  );
                })}
                {remainingCount > 0 && (
                  <Badge variant="secondary">+{remainingCount}</Badge>
                )}
              </>
            ) : (
              <span className="text-muted-foreground">All Countries</span>
            )}
          </div>
          <div className="ml-auto flex items-center gap-1">
            {selectedCountries.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 rounded-full p-0"
                onClick={handleDeselectAll}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search countries..." />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {countryCodesAlpha2Flag.map((country) => (
                <CommandItem
                  key={country.value}
                  value={country.label}
                  onSelect={() => handleSelect(country.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCountries.includes(country.value)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  <img
                    src={country.icon}
                    alt={`${country.label} flag`}
                    className="mr-2 inline-block h-5 w-5 rounded-sm"
                  />
                  {country.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Country;
