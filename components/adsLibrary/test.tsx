"use client";

import { useEffect, useState } from "react";
import { set } from "date-fns";

import { AdGraphQL } from "@/types/ad";
import {
  AdLibraryAdCollationDetailsQuery,
  AdLibraryMobileFocusedStateProviderRefetchQuery,
  AdLibrarySearchPaginationQuery,
} from "@/app/actions/Meta-GraphQL-Queries";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { AdCard_GraphQl } from "./AdCard_GraphQl";
import { AdList_GraphQl } from "./AdList_GraphQl";

export const Test = () => {
  const [ads, setAds] = useState<AdGraphQL[]>([]);
  const [forwardCursor, setForwardCursor] = useState<string | null>(null);
  const [isComplete, setIsResultComplete] = useState(false);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [collationID, setCollationID] = useState<string | null>(null);
  const [query, setQuery] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState<any>(null);
  const [page, setPage] = useState<any>(null);
  const [pageID, setPageID] = useState<any>(null);

  async function handleSearch() {
    const result = await AdLibraryAdCollationDetailsQuery({
      // collationGroupID: collationID || "1247580993346891",
      collationGroupID: collationID || "1247580993346891",
      forwardCursor: null,
      //   backwardCursor: null,
      activeStatus: "ALL",
      //   adType: "ALL",
      //   bylines: [],
      //   countries: null,
      //   location: null,
      //   potentialReach: [],
      //   publisherPlatforms: [],
      //   regions: [],
      //   sessionID: "ca227fe6-a7d7-431f-a8a2-94d2e69d7da8",
      //   startDate: null,
    });

    setAds(result.ads);
    setForwardCursor(result.forward_cursor);
    setIsResultComplete(result.is_complete);
    setTotalCount(result.total_count);
  }

  async function fetchAds() {
    const result = await AdLibrarySearchPaginationQuery({
      activeStatus: "ALL",
      adType: "ALL",
      bylines: [],
      collationToken: null,
      contentLanguages: [],
      countries: ["ALL"],
      // cursor:"AQHR3E1VCNfnSwNk8uwi9rTjdrwGnsWl-GUN8FnIeRu1Xi_iKJWM5JIAFNrxvS3cmChA",
      excludedIDs: [],
      first: 30,
      location: null,
      mediaType: "ALL",
      pageIDs: [],
      potentialReachInput: [],
      publisherPlatforms: [],
      queryString: query || "cat",
      regions: [],
      searchType: "KEYWORD_UNORDERED",
      sessionID: "6f643586-6dae-4e72-bcb5-779de1d6815b",
      sortData: null,
      source: "NAV_HEADER",
      startDate: null,
      v: "7218b1",
      viewAllPageID: "0",
    });

    setAds(result.ads);
    setForwardCursor(result.end_cursor);
    setIsResultComplete(result.has_next_page);
    setTotalCount(result.count);
  }

  async function fetchPage() {
    const result = await AdLibraryMobileFocusedStateProviderRefetchQuery({
      activeStatus: "ALL",
      adType: "ALL",
      audienceTimeframe: "LAST_7_DAYS",
      bylines: [],
      //collationToken: "4c63fadb-145f-428f-9696-7e1824245ee8",
      contentLanguages: [],
      countries: ["ALL"],
      country: "ALL",
      excludedIDs: [],
      fetchPageInfo: true,
      fetchSharedDisclaimers: true,
      location: null,
      mediaType: "ALL",
      pageIDs: [],
      potentialReachInput: [],
      publisherPlatforms: [],
      queryString: "",
      regions: [],
      searchType: "PAGE",
      sessionID: "d9c83232-8090-4de2-b3c5-b66c6cd7a137",
      sortData: null,
      source: null,
      startDate: null,
      v: "eab698",
      viewAllPageID: pageID || "150008058381451",
    });
    setAds(result.ads);
    setForwardCursor(result.end_cursor);
    setIsResultComplete(result.has_next_page);
    setTotalCount(result.count);
    setPageInfo(result.page_info);
    setPage(result.page);
  }

  return (
    <div>
      <div>
        <h1></h1>
        <div className="mb-4 flex flex-row space-x-4">
          <Input
            className="w-50"
            type="text"
            onChange={(e) => setCollationID(e.target.value)}
          />
          <Button onClick={handleSearch}>AdCollationDetailsQuery</Button>
          <h1></h1>
          <Input
            className="w-50"
            type="text"
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button onClick={fetchAds}>SearchPaginationQuery</Button>
          <h1></h1>
          <Input
            className="w-50"
            type="text"
            onChange={(e) => setPageID(e.target.value)}
          />
          <Button onClick={fetchPage}>
            MobileFocusedStateProviderRefetchQuery
          </Button>
        </div>

        <div>{isComplete ? "true" : "false"}</div>
        <div>totalCount: {totalCount}</div>
        <div>forwardCursor: {forwardCursor}</div>
        <div>pageInfo: {JSON.stringify(pageInfo)}</div>
        <div>page: {JSON.stringify(page)}</div>
      </div>
      <div>
        <AdList_GraphQl ads={ads} />
      </div>
    </div>
  );
};
