// @/components/adsLibrary/status.tsx
"use client";

import * as React from "react";
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

const statuses = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

type StatusProps = {
  onSelectStatus: (value: string | null) => void;
  clear?: boolean;
};

export const Status: React.FC<StatusProps> = ({
  onSelectStatus,
  clear = false,
}) => {
  const [open, setOpen] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState<string | null>(
    null,
  );

  // Clear selected Status if clear is true
  React.useEffect(() => {
    if (clear) {
      setSelectedStatus(null);
      onSelectStatus(null);
    }
  }, [clear, onSelectStatus]);

  const handleSelect = (statusValue: string) => {
    if (selectedStatus === statusValue) {
      // Deselect: set to null
      setSelectedStatus(null);
      onSelectStatus(null);
    } else {
      setSelectedStatus(statusValue);
      onSelectStatus(statusValue);
    }
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
          {selectedStatus
            ? statuses.find((status) => status.value === selectedStatus)?.label
            : "Active and Inactive"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No status found.</CommandEmpty>
            <CommandGroup>
              {statuses.map((status) => (
                <CommandItem
                  key={status.value}
                  value={status.value}
                  onSelect={() => handleSelect(status.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedStatus === status.value
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {status.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Status;
