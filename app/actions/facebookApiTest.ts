// app/actions/facebookApiTest.ts
"use server";

import { cookies } from "next/headers";
import { z } from "zod";

// Define the input schema for the server action
const InputSchema = z.object({
  queryString: z.string().min(1),
  cursor: z.string().optional(),
});

// Define the output schema for the server action
const OutputSchema = z.object({
  data: z.unknown(),
});

export async function fetchFacebookAds(input: z.infer<typeof InputSchema>) {
  // Validate input
  const validatedInput = InputSchema.parse(input);

  const cookieStore = cookies();
  const fbCookie =
    cookieStore.get("fb_cookie")?.value ||
    "datr=OcriZmtZzOtqJKEUX9Zhukco; sb=upzuZjh-bKjXqMoe0VbegPf7; fr=0Q1eXeTtiLUaz52p0..Bm7py6..AAA.0.0.Bm7py6.AWVzM2Hv3fc; wd=672x935";

  const options = {
    method: "POST",
    headers: {
      cookie: fbCookie,
      accept: "*/*",
      "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
      "content-type": "application/x-www-form-urlencoded",
      origin: "https://www.facebook.com",
      priority: "u=1, i",
      referer:
        "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=MA&media_type=all&q=cat&search_type=keyword_unordered&source=nav-header",
      "sec-ch-prefers-color-scheme": "light",
      "sec-ch-ua":
        '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
      "sec-ch-ua-full-version-list":
        '"Chromium";v="128.0.6613.139", "Not;A=Brand";v="24.0.0.0", "Google Chrome";v="128.0.6613.139"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-model": '""',
      "sec-ch-ua-platform": '"Windows"',
      "sec-ch-ua-platform-version": '"15.0.0"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
      "x-asbd-id": "129477",
      "x-fb-friendly-name": "AdLibrarySearchPaginationQuery",
      "x-fb-lsd": "AVqy31NLRXs",
    },
    body: new URLSearchParams({
      av: "0",
      __aaid: "0",
      __user: "0",
      __a: "1",
      __req: "2r",
      __hs: "19987.HYP:comet_plat_default_pkg.2.1..0.0",
      dpr: "1",
      __ccg: "EXCELLENT",
      __rev: "1016694340",
      __s: "4oz6iz:acglpu:lj4r7d",
      __hsi: "7417037990527946704",
      __dyn:
        "7xeUmxa13yoS1syUbFp432m2q1Dxu13wqovzEdF8ixy360CEbo9E3-xS6Ehw2nVEK12wvk0gq78b87C2m3K2y11wBz81s8hwGwQwoEcE7O2l0Fwqo31wp8kwyx2cwAxq1izXwrUcUjwGzE2VKUbo5G4EG1MUlwhE2Lxiaw5rwSyES0gq0K-1Lwqp8aE2cwmo6O1Fw5VwtU5K",
      __csr:
        "gFk_aRINflzkF4lGJybXDi59GVazpAmvykiBhEiyCqEiWwWxiq6oaoky5y8a829wkohxmiaG0B8G1ewtA0z8GEK0Jo6Wdwqoao7Si0dcw0gLC0sK02OnzEgw04fYg07dZ00p39Qaw2DE1EUG0a0w5sw",
      __comet_req: "1",
      lsd: "AVqy31NLRXs",
      jazoest: "2924",
      __spin_r: "1016694340",
      __spin_b: "trunk",
      __spin_t: "1726913729",
      __jssesw: "1",
      fb_api_caller_class: "RelayModern",
      fb_api_req_friendly_name: "AdLibrarySearchPaginationQuery",
      variables: JSON.stringify({
        activeStatus: "ACTIVE",
        adType: "ALL",
        bylines: [],
        collationToken: null,
        contentLanguages: [],
        countries: ["MA"],
        cursor: validatedInput.cursor || null,
        excludedIDs: [],
        first: 30,
        location: null,
        mediaType: "ALL",
        pageIDs: [],
        potentialReachInput: [],
        publisherPlatforms: [],
        queryString: validatedInput.queryString,
        regions: [],
        searchType: "KEYWORD_UNORDERED",
        sessionID: "3f156780-a547-4e64-8bcb-69402d0ce274",
        sortData: null,
        source: "NAV_HEADER",
        startDate: null,
        v: "7218b1",
        viewAllPageID: "0",
      }),
      server_timestamps: "true",
      doc_id: "8022477101123416",
    }),
  };

  try {
    const response = await fetch(
      "https://www.facebook.com/api/graphql/",
      options,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Validate output
    return OutputSchema.parse({ data });
  } catch (error) {
    console.error("Error fetching Facebook ads:", error);
    throw error;
  }
}
