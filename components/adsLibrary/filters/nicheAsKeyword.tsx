// @/components/adsLibrary/nicheAsKeyword.tsx
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronsUpDown } from "lucide-react";

import { niches } from "@/lib/Niches";
import { cn } from "@/lib/utils";
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

export const NicheAsKeyword: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const value = searchParams.get("niche_as_keyword") || null;

  const handleSelect = (currentValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (currentValue === value) {
      params.delete("niche_as_keyword");
    } else {
      params.set("niche_as_keyword", currentValue);
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
          {value
            ? niches.find((niche) => niche.value === value)?.label
            : "All Niches"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search niche..." />
          <CommandList>
            <CommandEmpty>No niche found.</CommandEmpty>
            <CommandGroup>
              {niches.map((niche) => (
                <CommandItem
                  key={niche.value}
                  value={niche.value}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === niche.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {niche.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default NicheAsKeyword;
