import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  getAdLibraryAdCollationVariables,
  getAdLibraryAdDetailsV2Variables,
} from "@/utils/adSearchVariables";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  X,
} from "lucide-react";

import { AdData } from "@/types/ad";
import Analytics from "@/components/adLibrary/adInsights/Analytics";
import { EuAdStatistic } from "@/components/adLibrary/adInsights/EuAdStatistic";
import AdCreativeGenerator from "@/components/adLibrary/aiComponents/AdCreativeGenerator";
import KeywordAnalysisTable from "@/components/adLibrary/aiComponents/KeywordAnalysisTable";
import { analyzeKeywords } from "@/app/actions/geminiAiService";
import {
  AdLibraryAdCollationDetailsQuery,
  AdLibraryAdDetailsV2Query,
} from "@/app/actions/Meta-GraphQL-Queries";

import { Button } from "../ui/button";

interface AdDetailsProps {
  ad: AdData;
  onClose: () => void;
}

export const AdDetails: React.FC<AdDetailsProps> = ({ ad, onClose }) => {
  const [detailedAds, setDetailedAds] = useState<AdData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forwardCursor, setForwardCursor] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [remainingCount, setRemainingCount] = useState<number | null>(null);
  const initialFetchDone = useRef(false);

  const searchParams = useSearchParams();
  const countries = searchParams.get("countries");

  // EU ADs
  const [adDetails, setAdDetails] = useState<any>(null);
  const [isLoadingEuStats, setIsLoadingEuStats] = useState(false);
  const [euStatsError, setEuStatsError] = useState<string | null>(null);

  // Keyword Analysis
  const [keywordAnalysis, setKeywordAnalysis] = useState<any>(null);
  const [isLoadingKeywords, setIsLoadingKeywords] = useState(false);
  const [keywordError, setKeywordError] = useState<string | null>(null);

  const fetchAdDetails = useCallback(async () => {
    if (isComplete || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      if (!ad.collation_id || !ad.collation_count || ad.collation_count <= 1) {
        setDetailedAds([ad]);
        setIsComplete(true);
        setTotalCount(1);
        setRemainingCount(0);
      } else {
        const variables = getAdLibraryAdCollationVariables(
          ad.collation_id,
          forwardCursor,
          "ALL",
        );
        const results = await AdLibraryAdCollationDetailsQuery(variables);

        setDetailedAds((prevAds) => [...prevAds, ...results.ads]);
        setForwardCursor(results.forward_cursor);
        setIsComplete(results.is_complete);
        setTotalCount((prevCount) => prevCount || results.total_count);
        setRemainingCount((prevCount) => {
          const newCount =
            (prevCount || results.total_count) - results.ads.length;
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
  }, [ad, forwardCursor, isComplete, isLoading]);

  // Function to get EU ad stats
  const fetchEuAdStats = useCallback(async () => {
    setIsLoadingEuStats(true);
    setEuStatsError(null);

    try {
      const variables = getAdLibraryAdDetailsV2Variables(
        ad.ad_archive_id,
        ad.page_id,
        ad.is_aaa_eligible,
      );
      const result = await AdLibraryAdDetailsV2Query(variables);
      setAdDetails(result);
    } catch (err) {
      setEuStatsError("Failed to fetch EU ad statistics");
      console.error(err);
    } finally {
      setIsLoadingEuStats(false);
    }
  }, [ad.ad_archive_id, ad.page_id, ad.is_aaa_eligible]);

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
      setIsComplete(false);
      setTotalCount(null);
      setRemainingCount(null);
      fetchAdDetails();
      fetchEuAdStats();
      fetchKeywordAnalysis();

      initialFetchDone.current = true;
    }
  }, [ad.collation_id, fetchAdDetails, fetchEuAdStats, fetchKeywordAnalysis]);

  const handleLoadMore = () => {
    if (!isComplete && !isLoading) {
      fetchAdDetails();
    }
  };

  // Effect to disable scrolling and hide overflow when component mounts
  useEffect(() => {
    document.body.style.overflow = "hidden";
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
            <AdCreativeGenerator ad={ad} />
          </div>
          <div className="h-1/2 w-full overflow-y-auto rounded-lg bg-gray-50 p-4 shadow-inner dark:bg-gray-900 lg:h-full lg:w-1/2">
            <div className="mb-4 flex items-center justify-between">
              {!isComplete ? (
                <Button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600"
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <span>{isLoading ? "Loading..." : "Load More Ads"}</span>
                </Button>
              ) : (
                <div className="flex items-center space-x-2 text-green-500">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">All ads loaded</span>
                </div>
              )}
              {totalCount !== null && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {remainingCount !== null && remainingCount > 0 ? (
                    <span>{`${remainingCount} of ${totalCount} ads remaining`}</span>
                  ) : (
                    <span>{`${totalCount} total ads`}</span>
                  )}
                </div>
              )}
            </div>
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
