"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

export const Language: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedLanguages =
    searchParams.get("content_languages")?.split(",") || [];

  const updateURL = React.useCallback(
    (newLanguages: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newLanguages.length === 0) {
        params.delete("content_languages");
      } else {
        params.set("content_languages", newLanguages.join(","));
      }
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const handleSelect = (languageCode: string) => {
    const newSelection = selectedLanguages.includes(languageCode)
      ? selectedLanguages.filter((code) => code !== languageCode)
      : [...selectedLanguages, languageCode];
    updateURL(newSelection);
  };

  const handleRemove = (languageCode: string) => {
    const newSelection = selectedLanguages.filter(
      (code) => code !== languageCode,
    );
    updateURL(newSelection);
  };

  const handleDeselectAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateURL([]);
  };

  const visibleSelections = selectedLanguages.slice(0, 2);
  const remainingCount = selectedLanguages.length - visibleSelections.length;

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
            {selectedLanguages.length > 0 ? (
              <>
                {visibleSelections.map((code) => {
                  const language = languages.find((lang) => lang.code === code);
                  return (
                    <Badge key={code} variant="secondary" className="mr-1">
                      {language?.code}
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
              <span className="text-muted-foreground">All Languages</span>
            )}
          </div>
          <div className="ml-auto flex items-center gap-1">
            {selectedLanguages.length > 0 && (
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
      <PopoverContent className="w-[200px] p-0">
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
