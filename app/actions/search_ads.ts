"use server";

// @/app/actions/search_ads.ts
import { FilterParams } from "@/types/filterParams";
//import store_XHR_Request_Options from "@/lib/store_XHR_Request_Options";
import { getStoredOptions } from "@/app/actions/buildFbAdsLibOPTIONS";
import { buildFbAdsLibUrl } from "@/app/actions/buildFbAdsLibUrl";

export const searchAds = async (filters: FilterParams): Promise<any> => {
  try {
    // Build the URL with the given filters
    const url = await buildFbAdsLibUrl(filters);

    // Get the request options
    const options = await getStoredOptions();

    //console.log("🚀🚀🚀🚀 ~ file: search_ads.ts:searchAds ~ url:", url);
    //console.log("🚀🚀🚀🚀 ~ file: search_ads.ts:searchAds ~ options:", options);

    console.log("🚀🚀🚀🚀 ~ XHR url & options ~ 🚀🚀🚀🚀");
    console.log(url, "\n", options);

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

    console.log("🚀🚀🚀🚀 ~ file: search_ads.ts:searchAds ~ data:", data);

    return data;
  } catch (error) {
    console.error("🚀🚀🚀🚀Error fetching data:", error.message);
    throw new Error("Failed to fetch data from Facebook Ads Library");
  }
};
