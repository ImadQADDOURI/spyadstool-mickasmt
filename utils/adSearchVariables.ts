import { ReadonlyURLSearchParams } from "next/navigation";

interface AdSearchVariables {
  activeStatus: string;
  adType: string;
  bylines: string[];
  collationToken: string | null;
  contentLanguages: string[];
  countries: string[];
  cursor: string | null;
  excludedIDs: string[];
  first: number;
  location: string | null;
  mediaType: string;
  pageIDs: string[];
  potentialReachInput: any[];
  publisherPlatforms: string[];
  queryString: string;
  regions: string[];
  searchType: string;
  sessionID: string;
  sortData: any | null;
  source: string | null;
  startDate: { min: string | null; max: string | null } | null;
  v: string;
  viewAllPageID: string;
}

export const getAdSearchVariables = (
  searchParams: ReadonlyURLSearchParams,
  endCursor: string | null = null,
  page_id?: string,
): AdSearchVariables => {
  const getParam = (key: string, defaultValue: string) =>
    searchParams.get(key) || defaultValue;
  const getArrayParam = (key: string, defaultValue: string[]) =>
    searchParams.get(key)?.split(",") || defaultValue;

  return {
    activeStatus: getParam("active_status", "ALL"),
    adType: "ALL",
    bylines: [],
    collationToken: null,
    contentLanguages: getArrayParam("content_languages", []),
    countries: getArrayParam("countries", ["ALL"]),
    cursor: endCursor,
    excludedIDs: [],
    first: 30,
    location: null,
    mediaType: getParam("media_type", "ALL"),
    pageIDs: page_id ? [page_id] : [],
    potentialReachInput: [],
    publisherPlatforms: getArrayParam("publisher_platforms", []),
    queryString: getParam("q", ""),
    regions: [],
    searchType: page_id ? "PAGE" : "KEYWORD_UNORDERED",
    sessionID: Math.random().toString(36).substring(7),
    sortData: null,
    source: "NAV_HEADER",
    startDate: (() => {
      const startDate = searchParams.get("start_date");
      const endDate = searchParams.get("end_date");
      return startDate || endDate
        ? { min: startDate || null, max: endDate || null }
        : null;
    })(),
    v: "7218b1",
    viewAllPageID: page_id || "0",
  };
};
