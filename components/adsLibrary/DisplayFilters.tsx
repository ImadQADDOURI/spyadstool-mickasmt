// DisplayFilters.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface DisplayFiltersProps {
  isParamsOpen: boolean;
  setIsParamsOpen: (isOpen: boolean) => void;
}

export const DisplayFilters: React.FC<DisplayFiltersProps> = ({ isParamsOpen, setIsParamsOpen }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const collationCountValue = parseInt(searchParams.get("collationCount") || "1", 10);

  const handleCollationCountChange = (value: number[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("collationCount", value[0].toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleClearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("collationCount");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleApplyFilters = () => {
    //if (collationCountValue = 1) delete from url else add to url  
    setIsParamsOpen(false);
  };

  return (
    <Sheet open={isParamsOpen} onOpenChange={setIsParamsOpen}>
      <SheetContent side={"left"}>
        <SheetHeader>
          <SheetTitle className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-2xl font-bold text-transparent">
        Display Filters
        </SheetTitle>
          <SheetDescription>Adjust the display filters to refine the results.</SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">Total Ads</span>
            <span className="font-bold text-gray-800 dark:text-gray-200">
              {collationCountValue}+
            </span>
          </div>
          <Slider
            min={1}
            max={20}
            step={1}
            defaultValue={[collationCountValue]}
            onValueChange={handleCollationCountChange}
            className="w-full"
           
          />

          <div className="mt-8 w-full flex flex-row space-x-1">
            <Button
              onClick={handleClearFilters}
              variant="outline"
            className="w-1/3 rounded-full border-2 border-gray-300 bg-transparent px-6 py-2 text-gray-700 transition-all hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
            Clear
           </Button>
            <Button
              onClick={handleApplyFilters}
              className="w-2/3 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-2 text-white transition-all hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
            Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

DisplayFilters.displayName = "DisplayFilters";

export default DisplayFilters;