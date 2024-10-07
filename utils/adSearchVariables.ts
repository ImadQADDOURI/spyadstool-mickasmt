import { ReadonlyURLSearchParams } from "next/navigation";

export const getAdSearchVariables = (
  searchParams: ReadonlyURLSearchParams,
  endCursor: string | null = null,
  page_id?: string,
) => {
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
    pageIDs: [],
    potentialReachInput: [],
    publisherPlatforms: getArrayParam("publisher_platforms", []),
    queryString,
    regions: [],
    searchType,
    sessionID: "36350c01-dbe2-4778-b84f-b1d1ec03ae57",
    //sessionID: Math.random().toString(36).substring(7),
    sortData: searchParams.get("sort_data") || null,
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

export const getAdLibraryMobileVariables = (pageId: string) => {
  return {
    activeStatus: "ALL",
    adType: "ALL",
    audienceTimeframe: "LAST_7_DAYS",
    bylines: [],
    collationToken: null,
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
    viewAllPageID: pageId,
  };
};
