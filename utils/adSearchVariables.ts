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
  sortData: string | null;
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

  // If niche_as_keyword is specified, it's added to the queryString and the searchType is set to "KEYWORD_EXACT_PHRASE", regardless of the original searchType value.
  // If niche_as_keyword is not specified but category_as_keyword is, then category_as_keyword is added to the queryString and the searchType is set to "KEYWORD_UNORDERED", regardless of the original searchType value.
  // The queryString is properly combined with commas and spaces.
  // The searchType is adjusted when necessary.
  let queryString = getParam("q", "");
  const nicheAsKeyword = getParam("niche_as_keyword", "");
  const categoryAsKeyword = getParam("category_as_keyword", "");
  let searchType = getParam("search_type", "KEYWORD_UNORDERED");

  if (nicheAsKeyword) {
    queryString = [queryString, nicheAsKeyword].filter(Boolean).join(", ");
    searchType = "KEYWORD_EXACT_PHRASE";
  } else if (categoryAsKeyword) {
    queryString = [queryString, categoryAsKeyword].filter(Boolean).join(", ");
    searchType = "KEYWORD_UNORDERED";
  }

  return {
    activeStatus: getParam("active_status", "ALL"),
    adType: getParam("ad_type", "ALL"),
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
    queryString,
    regions: [],
    searchType,
    sessionID: "36350c01-dbe2-4778-b84f-b1d1ec03ae57",
    //sessionID: Math.random().toString(36).substring(7),
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
