import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import parse from "html-react-parser";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { Ad } from "@/types/ad";
import { FilterParams } from "@/types/filterParams";
import { fetchAdLibraryDetails } from "@/app/actions/fetchAdDetails";
import { analyzeKeywords } from "@/app/actions/geminiAi";
import { AdLibraryAdDetailsV2Query } from "@/app/actions/Meta-GraphQL-Queries";
import { searchAds } from "@/app/actions/search_ads";

import { Button } from "../ui/button";
import { AdCard } from "./AdCard";
import AdCreativeGenerator from "./AdCreativeGenerator";
import Analytics from "./Analytics";
import { Carousel } from "./Carousel";
import { EuAdStatistic } from "./EuAdStatistic";
import KeywordAnalysisTable from "./KeywordAnalysisTable";
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

  // EU ADs
  const [adDetails, setAdDetails] = useState<any>(null);
  const [isLoadingEuStats, setIsLoadingEuStats] = useState(false);
  const [euStatsError, setEuStatsError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const countries = searchParams.get("countries");

  // Keyword Analysis
  const [keywordAnalysis, setKeywordAnalysis] = useState<any>(null);
  const [isLoadingKeywords, setIsLoadingKeywords] = useState(false);
  const [keywordError, setKeywordError] = useState<string | null>(null);

  // Function to get ad versions
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
          !totalCount && setTotalCount(results.payload.totalCount); //Set totalCount only in the first call from searchAds response
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

  // Function to get EU ad stats
  const fetchEuAdStats = useCallback(async () => {
    setIsLoadingEuStats(true);
    setEuStatsError(null);
    console.log("🚀🚀🚀🚀 - ad.isAAAEligible", ad.isAAAEligible);

    try {
      // const result = await fetchAdLibraryDetails({
      //   adArchiveID: ad.adArchiveID || "",
      //   pageID: ad.pageID || "",
      //   isAdNotAAAEligible: !ad.isAAAEligible,
      //   country: countries ? countries.split(",")[0] : "", // Use the first country if available, otherwise empty string
      // });
      const result = await AdLibraryAdDetailsV2Query({
        adArchiveID: ad.adArchiveID,
        pageID: ad.pageID,

        country: "ALL",
        source: "FB_LOGO",
        // isAdNonPolitical: true,
        isAdNotAAAEligible: !ad.isAAAEligible,
      });
      setAdDetails(result);
    } catch (err) {
      setEuStatsError("Failed to fetch EU ad statistics");
      console.error(err);
    } finally {
      setIsLoadingEuStats(false);
    }
  }, [ad.adArchiveID, ad.pageID, ad.isAAAEligible, countries]);

  // Function to fetch keyword analysis
  const fetchKeywordAnalysis = useCallback(async () => {
    setIsLoadingKeywords(true);
    setKeywordError(null);
    try {
      const result = await analyzeKeywords(ad);
      setKeywordAnalysis(result);
    } catch (error) {
      console.error("Error analyzing keywords:", error);
      setKeywordError("Failed to analyze keywords");
    } finally {
      setIsLoadingKeywords(false);
    }
  }, [ad]);

  useEffect(() => {
    if (!initialFetchDone.current) {
      setDetailedAds([]);
      setForwardCursor(null);
      setIsResultComplete(false);
      setTotalCount(null);
      setRemainingCount(null);
      fetchAdDetails(false);
      fetchEuAdStats();
      fetchKeywordAnalysis();

      initialFetchDone.current = true;
    }
  }, [ad.collationID, fetchAdDetails, fetchEuAdStats, fetchKeywordAnalysis]);

  const handleLoadMore = () => {
    if (!isComplete && !isLoading) {
      fetchAdDetails(true);
    }
  };

  // Effect to disable scrolling and hide overflow when component mounts
  useEffect(() => {
    // Disable scrolling and hide overflow
    document.body.style.overflow = "hidden";

    // Re-enable scrolling and show overflow when component unmounts
    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative h-[90vh] w-[90vw] overflow-hidden rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
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
            <AdCreativeGenerator ad={ad} />
          </div>
          <div className="h-1/2 w-full overflow-y-auto rounded-lg bg-gray-50 p-4 shadow-inner dark:bg-gray-900 lg:h-full lg:w-1/2">
            <Analytics ads={detailedAds} />

            <EuAdStatistic
              data={adDetails}
              isLoading={isLoadingEuStats}
              error={euStatsError}
            />

            <KeywordAnalysisTable
              data={keywordAnalysis}
              isLoading={isLoadingKeywords}
              error={keywordError}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
