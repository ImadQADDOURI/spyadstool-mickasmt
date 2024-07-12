// @/components/adsLibrary/platform.tsx
"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
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

const platforms = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "audience_network", label: "Audience Network" },
  { value: "messenger", label: "Messenger" },
];

type PlatformProps = {
  onSelectPlatforms: (value: string[]) => void;
};

export const Platform: React.FC<PlatformProps> = ({ onSelectPlatforms }) => {
  const [open, setOpen] = React.useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = React.useState<string[]>(
    [],
  );

  const handleSelect = (platformValue: string) => {
    setSelectedPlatforms((prev) => {
      const newSelection = prev.includes(platformValue)
        ? prev.filter((value) => value !== platformValue)
        : [...prev, platformValue];
      onSelectPlatforms(newSelection.length ? newSelection : []);
      return newSelection;
    });
  };

  const handleRemove = (platformValue: string) => {
    setSelectedPlatforms((prev) => {
      const newSelection = prev.filter((value) => value !== platformValue);
      onSelectPlatforms(newSelection.length ? newSelection : []);
      return newSelection;
    });
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
          {selectedPlatforms.length ? (
            <div className="flex flex-wrap gap-1">
              {selectedPlatforms.map((value) => (
                <Badge key={value} variant="secondary" className="mr-1">
                  {
                    platforms.find((platform) => platform.value === value)
                      ?.label
                  }
                  <button
                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleRemove(value);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => handleRemove(value)}
                  >
                    <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            "All Platforms"
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No platform found.</CommandEmpty>
            <CommandGroup>
              {platforms.map((platform) => (
                <CommandItem
                  key={platform.value}
                  value={platform.value}
                  onSelect={() => handleSelect(platform.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedPlatforms.includes(platform.value)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {platform.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Platform;
