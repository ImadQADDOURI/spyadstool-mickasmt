// components/adsLibrary/AdDetails.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { Ad } from "@/types/ad";
import { FilterParams } from "@/types/filterParams";
import { searchAds } from "@/app/actions/search_ads";

import { Button } from "../ui/button";
import { AdCard } from "./AdCard";
import Analytics from "./Analytics";
import Carousel from "./Carousel";
import LoadingTrigger from "./LoadingTrigger";

interface AdDetailsProps {
  ad: Ad;
  onClose: () => void;
}

export const AdDetails: React.FC<AdDetailsProps> = ({ ad, onClose }) => {
  const [detailedAds, setDetailedAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forwardCursor, setForwardCursor] = useState<string | null>(null);
  const [isComplete, setIsResultComplete] = useState(false);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [remainingCount, setRemainingCount] = useState<number | null>(null);
  const initialFetchDone = useRef(false);

  const fetchAdDetails = useCallback(
    async (useExistingParams = false) => {
      if (isComplete || isLoading) return;

      setIsLoading(true);
      setError(null);

      try {
        if (
          ad.collationCount === undefined ||
          ad.collationCount <= 1 ||
          ad.collationID === undefined
        ) {
          setDetailedAds([ad]);
          setIsResultComplete(true);
          setTotalCount(1);
          setRemainingCount(0);
        } else {
          const searchParams: FilterParams = {
            baseUrl: "https://www.facebook.com/ads/library/async/collation?",
            collation_group_id: ad.collationID,
            forward_cursor: useExistingParams ? forwardCursor || "" : "",
          };

          const results = await searchAds(searchParams);

          const extractedAds = results.payload.adCards;

          setDetailedAds((prevAds) => {
            const newAds = extractedAds.filter(
              (newAd) =>
                !prevAds.some(
                  (prevAd) => prevAd.adArchiveID === newAd.adArchiveID,
                ),
            );
            return [...prevAds, ...newAds];
          });
          setForwardCursor(results.payload.forwardCursor);
          setIsResultComplete(results.payload.isComplete);
          setTotalCount(results.payload.totalCount);
          setRemainingCount((prevCount) => {
            const newCount =
              (prevCount ?? results.payload.totalCount) - extractedAds.length;
            return newCount > 0 ? newCount : 0;
          });
        }
      } catch (error) {
        console.error("Error fetching ad details:", error);
        setError(
          "An error occurred while fetching ad details. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [ad, forwardCursor, isComplete, isLoading],
  );

  useEffect(() => {
    if (!initialFetchDone.current) {
      setDetailedAds([]);
      setForwardCursor(null);
      setIsResultComplete(false);
      setTotalCount(null);
      setRemainingCount(null);
      fetchAdDetails(false);
      initialFetchDone.current = true;
    }
  }, [ad.collationID, fetchAdDetails]);

  const handleLoadMore = () => {
    if (!isComplete && !isLoading) {
      fetchAdDetails(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative h-[90vh] w-full max-w-6xl overflow-hidden rounded-lg bg-white p-6 dark:bg-gray-800">
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <h2 className="mb-4 text-2xl font-bold">Ad Details</h2>
        <div className="flex h-full">
          <div className="w-1/3 pr-4">
            <Carousel ads={detailedAds} isLoading={isLoading} error={error} />
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {detailedAds.length} of {totalCount || "?"} ads loaded
              </p>
              {!isComplete && (
                <Button onClick={handleLoadMore} disabled={isLoading}>
                  {isLoading ? "Loading..." : "Load More"}
                </Button>
              )}
            </div>
          </div>
          <div className="w-2/3 pl-4">
            <Analytics ads={detailedAds} />
          </div>
        </div>
      </div>
    </div>
  );
};
