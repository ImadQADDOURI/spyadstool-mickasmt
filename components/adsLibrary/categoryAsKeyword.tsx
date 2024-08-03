// @/components/adsLibrary/categoryAsKeyword.tsx
"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { categories } from "@/lib/Categories";
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

type CategoryAsKeywordProps = {
  onSelectCategory: (value: string | null) => void;
  clear?: boolean;
};

export const CategoryAsKeyword: React.FC<CategoryAsKeywordProps> = ({
  onSelectCategory,
  clear = false,
}) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (clear) {
      setValue(null);
      onSelectCategory(null);
    }
  }, [clear, onSelectCategory]);

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === value ? null : currentValue;
    setValue(newValue);
    onSelectCategory(newValue);
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
            ? categories.find((category) => category.value === value)?.label
            : "All Categories"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search category..." />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {categories.map((category) => (
                <CommandItem
                  key={category.value}
                  value={category.value}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === category.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {category.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CategoryAsKeyword;
