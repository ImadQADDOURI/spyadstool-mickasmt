// app/lib/metaGraphQLConstants.ts

export const apiNameToDocId = {
  AdLibraryAdCollationDetailsQuery: "8918149204878948",
  AdLibraryCollationSummaryDetailsAggregateSectionQuery: "4368375336597135",
  AdLibraryAdDetailsV2Query: "8422900291076880",
  AdLibraryMobileFocusedStateProviderRefetchQuery: "7630761763694875",
  AdLibrarySearchPaginationQuery: "8022477101123416",
  AdLibraryFilterContextProviderQuery: "6645028345583352",
  AdLibraryPageHoverCardQuery: "6453683764688391",
  useAdLibraryTypeaheadSuggestionDataSourceQuery: "7801302506625362",
} as const;

export const API_ENDPOINT = "https://www.facebook.com/api/graphql";

export const defaultHeaders = {
  accept: "*/*",
  "accept-language": "en-US,en;q=0.9,fr;q=0.8",
  "content-type": "application/x-www-form-urlencoded",
  cookie:
    "datr=OcriZmtZzOtqJKEUX9Zhukco; sb=upzuZjh-bKjXqMoe0VbegPf7; fr=0Q1eXeTtiLUaz52p0..Bm7py6..AAA.0.0.Bm7py6.AWVzM2Hv3fc; wd=672x935",
  origin: "https://www.facebook.com",
  priority: "u=1, i",
  referer:
    "https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=ALL&media_type=all&q=cat&search_type=keyword_unordered&source=fb-logo",
  "sec-ch-prefers-color-scheme": "light",
  "sec-ch-ua":
    '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
  "sec-ch-ua-full-version-list":
    '"Google Chrome";v="129.0.6668.70", "Not=A?Brand";v="8.0.0.0", "Chromium";v="129.0.6668.70"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-model": '""',
  "sec-ch-ua-platform": '"Windows"',
  "sec-ch-ua-platform-version": '"15.0.0"',
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
  "x-asbd-id": "129477",
  "x-fb-friendly-name": "AdLibrarySearchPaginationQuery",
  "x-fb-lsd": "AVqexOUrQZ0",
};

export const defaultParams = {
  av: "0",
  __aaid: "0",
  __user: "0",
  __a: "1",
  __req: "95",
  __hs: "19997.HYP:comet_plat_default_pkg.2.1..0.0",
  dpr: "1",
  __ccg: "EXCELLENT",
  __rev: "1016945397",
  __s: "5243au:8ozfqr:n30k73",
  __hsi: "7420707946255916517",
  __dyn:
    "7xeUmxa13yoS1syUbFp432m2q1Dxu13wqovzEdF8ixy360CEbo9E3-xS6Ehw2nVEK12wvk0gq78b87C2m3K2y11wBz81s8hwGwQwoEcE7O2l0Fwqo31wp8kwyx2cwAxq1izXwrUcUjwGzE2VKUbo5G4EG1MUlwhE2Lxiaw5rwSyES0gq0K-1Lwqp8aE2cwmo6O1Fw5VwtU5K",
  __csr:
    "gDNq8z4nqLAV6_m9Al5rRmAJeqqQiAjh698-XzLICA4eqUyGLx-5EScBBK1lx22q48lxOi1WwUU6W48iwjU4ObK3a2m0HUqwoUaEixaE4i0E8do20w5UzUrw7jwdR00Rum05QU0bC9oO1yw0dAR00brC013gw1nYw0za9w8y029W",
  __comet_req: "1",
  lsd: "AVqexOUrQZ0",
  jazoest: "2982",
  __spin_r: "1016945397",
  __spin_b: "trunk",
  __spin_t: "1727768207",
  __jssesw: "1",
  fb_api_caller_class: "RelayModern",
  fb_api_req_friendly_name: "AdLibrarySearchPaginationQuery",
  variables:
    '{"activeStatus":"ALL","adType":"ALL","bylines":[],"collationToken":"3b383199-512f-4fd2-832c-5826ec2f467e","contentLanguages":[],"countries":["ALL"],"cursor":"AQHRwY6hlHeo0QkzqWpB_AsoodbcYJe5MKlTVQlMneu0gd1WyBd2lWbgFB7k2MPzxPh4","excludedIDs":[],"first":30,"location":null,"mediaType":"ALL","pageIDs":[],"potentialReachInput":[],"publisherPlatforms":[],"queryString":"cat","regions":[],"searchType":"KEYWORD_UNORDERED","sessionID":"7cc4cfcd-17fd-48b7-934d-df89d7a469f8","sortData":null,"source":"FB_LOGO","startDate":null,"v":"7218b1","viewAllPageID":"0"}',
  server_timestamps: "true",
  doc_id: "8903998899629704",
};
