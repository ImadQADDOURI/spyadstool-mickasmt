// @/app/actions/search_ads.ts

import { FilterParams } from "@/types/filterParams";
import store_XHR_Request_Options from "@/lib/store_XHR_Request_Options";
import { buildFbAdsLibUrl } from "@/app/actions/buildFbAdsLibUrl";

export const searchAds = async (filters: FilterParams): Promise<any> => {
  try {
    // Build the URL with the given filters
    const url = await buildFbAdsLibUrl(filters);

    // Get the request options
    const options = store_XHR_Request_Options.getOptions();

    console.log("🚀🚀🚀🚀 ~ file: search_ads.ts:searchAds ~ options:", options);

    console.log("🚀🚀🚀🚀 ~ file: search_ads.ts:searchAds ~ url:", url);

    // Fetch the data from the Facebook Ads Library
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`🚀🚀 HTTP error! status: ${response.status}`);
    }

    // Process the response to remove "for (;;);"
    const text = await response.text();
    const cleanedText = text.replace("for (;;);", "");

    // Parse the cleaned JSON string
    //const data = JSON.parse(cleanedText);

    return text;
  } catch (error) {
    console.error("🚀🚀🚀Error fetching data:", error.message);
    throw new Error("Failed to fetch data from Facebook Ads Library");
  }
};
