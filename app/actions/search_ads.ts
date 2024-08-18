// @/app/actions/search_ads.ts

"use server";

import { FilterParams } from "@/types/filterParams";
//import store_XHR_Request_Options from "@/lib/store_XHR_Request_Options";
import {
  getFbAdsLibOptionsWithoutDB,
  getStoredOptions,
} from "@/app/actions/buildFbAdsLibOPTIONS";
import { buildFbAdsLibUrl } from "@/app/actions/buildFbAdsLibUrl";

export const searchAds = async (filters: FilterParams): Promise<any> => {
  try {
    // Build the URL with the given filters
    const url = await buildFbAdsLibUrl(filters);

    // Get the request options from DB
    //const options = await getStoredOptions();
    // Get the request options from function
    const options = await getFbAdsLibOptionsWithoutDB();

    //console.log("🚀🚀🚀🚀 ~ file: search_ads.ts:searchAds ~ url:", url);
    //console.log("🚀🚀🚀🚀 ~ file: search_ads.ts:searchAds ~ options:", options);

    // console.log("🚀🚀🚀🚀 ~ XHR url & options ~ 🚀🚀🚀🚀");
    // console.log(url, "\n", options);

    // Fetch the data from the Facebook Ads Library
    const response = await fetch(url, options || undefined);

    if (!response.ok) {
      throw new Error(`🚀🚀 HTTP error! status: ${response.status}`);
    }

    // Process the response to remove "for (;;);"
    const text = await response.text();
    const cleanedText = text.replace("for (;;);", "");

    // Parse the cleaned JSON string
    const data = JSON.parse(cleanedText);
    // console.log(
    //   "🚀🚀🚀🚀 ~ file: search_ads.ts:searchAds ~ cleanedText:",
    //   cleanedText,
    // );

    //console.log("🚀🚀🚀🚀 ~ file: search_ads.ts:searchAds ~ data:", data);

    console.log(
      "🚀🚀🚀🚀 ~ file: search_ads.ts:searchAds ~ ADs Found :",
      data.payload.totalCount,
    );
    return data;
  } catch (error) {
    console.error("🚀🚀🚀🚀Error fetching data:", error.message);
    throw new Error("Failed to fetch data from Facebook Ads Library");
  }
};
