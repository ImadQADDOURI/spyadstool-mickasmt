// @/components/adsLibrary/searchType.tsx
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const searchTypes = [
  { value: "KEYWORD_UNORDERED", label: "Keyword Unordered" },
  { value: "KEYWORD_EXACT_PHRASE", label: "Keyword Exact Phrase" },
];

export const SearchType: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedSearchType = searchParams.get("search_type") || null;

  const handleSelect = (searchTypeValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedSearchType === searchTypeValue) {
      params.delete("search_type");
    } else {
      params.set("search_type", searchTypeValue);
    }
    router.push(`?${params.toString()}`, { scroll: false });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedSearchType
            ? searchTypes.find((type) => type.value === selectedSearchType)
                ?.label
            : "Search Type"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No search type found.</CommandEmpty>
            <CommandGroup>
              {searchTypes.map((type) => (
                <CommandItem
                  key={type.value}
                  value={type.value}
                  onSelect={() => handleSelect(type.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedSearchType === type.value
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {type.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SearchType;
