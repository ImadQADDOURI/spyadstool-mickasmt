import React, { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { AdData } from "@/types/ad";
import { aiSupportedLanguages } from "@/lib/AiSupportedLanguages";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { generateAdCreative } from "@/app/actions/geminiAiService";

interface AdCreative {
  primaryText: string;
  headline: string;
  description: string;
  callToAction: string;
}

const AdCreativeGenerator: React.FC<{ ad: AdData }> = ({ ad }) => {
  const [adCreative, setAdCreative] = useState<AdCreative | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState("English");

  const handleGenerateCreative = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const creative = await generateAdCreative(ad, language);
      setAdCreative(creative);
    } catch (err) {
      setError("Failed to generate ad creative copy. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              {language || "Select language..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search language..." />
              <CommandList>
                <CommandEmpty>No language found.</CommandEmpty>
                <CommandGroup>
                  {aiSupportedLanguages.map((lang) => (
                    <CommandItem
                      key={lang}
                      value={lang}
                      onSelect={(currentValue) => {
                        setLanguage(
                          currentValue === language ? "English" : currentValue,
                        );
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          language === lang ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {lang}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Button onClick={handleGenerateCreative} disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate Ad Creative Copy"}
        </Button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {adCreative && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Ad Creative</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <h4 className="font-semibold">Primary Text:</h4>
              <p>{adCreative.primaryText}</p>
            </div>
            <div>
              <h4 className="font-semibold">Headline:</h4>
              <p>{adCreative.headline}</p>
            </div>
            <div>
              <h4 className="font-semibold">Description:</h4>
              <p>{adCreative.description}</p>
            </div>
            <div>
              <h4 className="font-semibold">Call to Action:</h4>
              <p>{adCreative.callToAction}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdCreativeGenerator;
