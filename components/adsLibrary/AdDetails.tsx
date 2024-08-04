// components/adsLibrary/AdDetails.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { Ad } from "@/types/ad";
import { FilterParams } from "@/types/filterParams";
import { searchAds } from "@/app/actions/search_ads";

import { Button } from "../ui/button";
import { AdCard } from "./AdCard";
import Analytics from "./Analytics";
import { Carousel } from "./filters/Carousel";
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
      <div className="relative h-[90vh] w-full max-w-7xl overflow-hidden rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <button
          className="absolute right-2 top-2 rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </button>
        <h2 className="mb-4 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-2xl font-bold text-transparent">
          Ad Details
        </h2>
        <div className="flex h-[calc(100%-3rem)] flex-col gap-6 lg:flex-row">
          <div className="h-1/2 w-full overflow-hidden rounded-lg bg-gray-50 shadow-inner dark:bg-gray-900 lg:h-full lg:w-1/2">
            <Carousel
              ads={detailedAds}
              isLoading={isLoading}
              error={error}
              totalCount={totalCount}
              isComplete={isComplete}
              onLoadMore={handleLoadMore}
            />
          </div>
          <div className="h-1/2 w-full overflow-y-auto rounded-lg bg-gray-50 p-4 shadow-inner dark:bg-gray-900 lg:h-full lg:w-1/2">
            <Analytics ads={detailedAds} />
          </div>
        </div>
      </div>
    </div>
  );
};
