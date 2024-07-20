// components/adsLibrary/AdDetails.tsx
import React, { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";

import { Ad } from "@/types/ad";
import { FilterParams } from "@/types/filterParams";
import { searchAds } from "@/app/actions/search_ads";

import { Button } from "../ui/button";
import { AdCard } from "./AdCard";
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

  const handleSeeAdDetails = useCallback(
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
    setDetailedAds([]);
    setForwardCursor(null);
    setIsResultComplete(false);
    setTotalCount(null);
    setRemainingCount(null);
    handleSeeAdDetails(false);
  }, [ad.collationID]);

  const handleLoadMore = useCallback(() => {
    if (!isComplete && !isLoading) {
      handleSeeAdDetails(true);
    }
  }, [handleSeeAdDetails, isComplete, isLoading]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-800">
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="mb-4 text-2xl font-bold">Ad Details</h2>
          {isLoading && detailedAds.length === 0 && (
            <p>Loading ad details...</p>
          )}
          {error && <p className="text-red-500">{error}</p>}
          {detailedAds.map((detailedAd) => (
            <AdCard key={detailedAd.adArchiveID} ad={detailedAd} />
          ))}
          {!isComplete && (
            <LoadingTrigger
              onIntersect={handleLoadMore}
              isLoading={isLoading}
            />
          )}
          {isLoading && detailedAds.length > 0 && (
            <p className="mt-4 text-center">Loading more ads...</p>
          )}
          {remainingCount !== null && remainingCount > 0 && (
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              {remainingCount} more ads available
            </p>
          )}
          {isComplete && <p className="mt-4 text-center">All ads loaded</p>}
        </div>
      </div>
    </div>
  );
};
