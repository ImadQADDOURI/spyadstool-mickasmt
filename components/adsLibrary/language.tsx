// @/components/adsLibrary/language.tsx
"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { languages } from "@/lib/languages";
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

type LanguageProps = {
  onSelectLanguages: (value: string[] | null) => void;
  clear?: boolean;
};

export const Language: React.FC<LanguageProps> = ({
  onSelectLanguages,
  clear = false,
}) => {
  const [open, setOpen] = React.useState(false);
  const [selectedLanguages, setSelectedLanguages] = React.useState<
    string[] | null
  >(null);

  // Clear selected languages if clear is true
  React.useEffect(() => {
    if (clear) {
      setSelectedLanguages(null);
      onSelectLanguages(null);
    }
  }, [clear, onSelectLanguages]);

  const handleSelect = (languageCode: string) => {
    setSelectedLanguages((prev) => {
      const newSelection = prev
        ? prev.includes(languageCode)
          ? prev.filter((code) => code !== languageCode)
          : [...prev, languageCode]
        : [languageCode];
      onSelectLanguages(newSelection.length ? newSelection : null);
      return newSelection.length ? newSelection : null;
    });
  };

  const handleRemove = (languageCode: string) => {
    setSelectedLanguages((prev) => {
      if (!prev) return null;
      const newSelection = prev.filter((code) => code !== languageCode);
      onSelectLanguages(newSelection.length ? newSelection : null);
      return newSelection.length ? newSelection : null;
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
          {selectedLanguages && selectedLanguages.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selectedLanguages.map((code) => (
                <Badge key={code} variant="secondary" className="mr-1">
                  {languages.find((lang) => lang.code === code)?.code}
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
                    onClick={() => handleRemove(code)}
                  >
                    <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            "All Languages"
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search languages..." />
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              {languages.map((language) => (
                <CommandItem
                  key={language.code}
                  value={language.name}
                  onSelect={() => handleSelect(language.code)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedLanguages?.includes(language.code)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {language.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Language;
