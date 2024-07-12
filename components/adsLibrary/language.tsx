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
  onSelectLanguages: (value: string[]) => void;
};

export const Language: React.FC<LanguageProps> = ({ onSelectLanguages }) => {
  const [open, setOpen] = React.useState(false);
  const [selectedLanguages, setSelectedLanguages] = React.useState<string[]>(
    [],
  );

  const handleSelect = (languageCode: string) => {
    setSelectedLanguages((prev) => {
      const newSelection = prev.includes(languageCode)
        ? prev.filter((code) => code !== languageCode)
        : [...prev, languageCode];
      onSelectLanguages(newSelection.length ? newSelection : []);
      return newSelection;
    });
  };

  const handleRemove = (languageCode: string) => {
    setSelectedLanguages((prev) => {
      const newSelection = prev.filter((code) => code !== languageCode);
      onSelectLanguages(newSelection.length ? newSelection : []);
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
          {selectedLanguages.length ? (
            <div className="flex flex-wrap gap-1">
              {selectedLanguages.map((code) => (
                <Badge key={code} variant="secondary" className="mr-1">
                  {languages.find((lang) => lang.code === code)?.name}
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
                      selectedLanguages.includes(language.code)
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
