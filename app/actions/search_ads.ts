// @/app/actions/search_ads.ts

"use server";

import { FilterParams } from "@/types/filterParams";
//import store_XHR_Request_Options from "@/lib/store_XHR_Request_Options";
import {
  getFbAdsLibOptionsWithoutDB,
  getStoredOptions,
} from "@/app/actions/buildFbAdsLibOPTIONS";
import { buildFbAdsLibUrl } from "@/app/actions/buildFbAdsLibUrl";

class FacebookBlockError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FacebookBlockError";
  }
}

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
    console.log(
      "🚀🚀🚀🚀 ~ file: search_ads.ts:searchAds ~ cleanedText:",
      cleanedText,
    );

    // Parse the cleaned JSON string
    const data = JSON.parse(cleanedText);

    // Check if the response indicates a Facebook block
    if (
      data.error === 3252001 ||
      (data.errorSummary && data.errorSummary.includes("Temporarily Blocked"))
    ) {
      throw new FacebookBlockError(
        "You've been temporarily blocked by Facebook. Please try again later.",
      );
    }

    data.payload.totalCount &&
      console.log(
        "🚀🚀🚀🚀 ~ file: search_ads.ts:searchAds ~ ADs Found :",
        data.payload.totalCount,
      );

    return data;
  } catch (error) {
    if (error instanceof FacebookBlockError) {
      // Re-throw the custom error to be handled by the client
      throw error;
    }
    console.error("🚀🚀🚀🚀 ~ searchAds ~ Error fetching data:", error.message);
    throw new Error("Failed to fetch data from Facebook Ads Library");
  }
};
