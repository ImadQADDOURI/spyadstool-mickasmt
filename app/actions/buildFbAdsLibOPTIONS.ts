"use server";

import store_XHR_Request_Options from "@/lib/store_XHR_Request_Options";

import { puppeteerCaptureXHRRequests } from "./puppeteerCaptureXHRRequests";

export async function buildFbAdsLibOPTIONS() {
  // Puppeteer capture XHR requests
  const puppeteerResults = await puppeteerCaptureXHRRequests();

  try {
    const specificResult = puppeteerResults.find((result) =>
      result.url.includes(
        "https://www.facebook.com/ads/library/async/search_typeahead/",
      ),
    );

    if (!specificResult) {
      return { message: "No matching URL found" };
    }

    // Extract the necessary fields from the result
    const { url, method, headers, postData } = specificResult;

    // Prepare the options object
    const options = {
      method,
      headers: {
        ...headers,
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        priority: "u=1, i",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        referer: "https://www.facebook.com/ads/library/",
      },
      body: new URLSearchParams(postData),
    };

    console.log(
      "🚀 ~ file: buildFbAdsLibOPTIONS.ts:buildFbAdsLibOPTIONS ~ options:",
      //  options,
    );

    // Store the options in the singleton store
    store_XHR_Request_Options.setOptions(options);

    return options;
  } catch (error) {
    return {
      message: " ❌ An error occurred while building the XHR request options ",
      error: error.message,
    };
  }
}

export async function getStoredOptions() {
  return store_XHR_Request_Options.getOptions();
}
