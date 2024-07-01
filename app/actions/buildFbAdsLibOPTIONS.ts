"use server";

import { prisma } from "@/lib/db";

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
      method: method || "POST",
      headers: {
        ...headers,
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        priority: "u=1, i",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        referer: "https://www.facebook.com/ads/library/",
        "sec-ch-prefers-color-scheme": "light",
        "sec-ch-ua-model": "",
        "sec-ch-ua-platform-version": "15.0.0",
        //"sec-ch-ua-full-version-list": "Not/A)Brand";v="8.0.0.0", "Chromium";v="126.0.6478.116", "Google Chrome";v="126.0.6478.116"
      },
      body: postData ? new URLSearchParams(postData).toString() : undefined,
    };

    // Store the options in the database
    const storedOptions = await prisma.xHRRequestOptions.create({
      data: {
        url,
        method: options.method,
        headers: options.headers,
        body: options.body,
        queryParams: Object.fromEntries(new URL(url).searchParams),
      },
    });

    console.log(
      "🚀 ~ file: buildFbAdsLibOPTIONS.ts:buildFbAdsLibOPTIONS ~ options stored in database:",
      storedOptions.id,
    );

    return storedOptions;
  } catch (error) {
    console.error("Error storing XHR options:", error);
    return {
      message:
        " ❌ An error occurred while building and storing the XHR request options ",
      error: error.message,
    };
  }
}

export async function getStoredOptions() {
  // Retrieve the most recent options from the database
  const latestOptions = await prisma.xHRRequestOptions.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!latestOptions) {
    return null;
  }

  // Convert the stored data back into the format your application expects
  return {
    method: latestOptions.method || "POST",
    headers: (latestOptions.headers as Record<string, string>) || {},
    body: latestOptions.body || "",
  };
}
