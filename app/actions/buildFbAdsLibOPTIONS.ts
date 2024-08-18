"use server";

import { cookies } from "next/headers";

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

// function to get options without using DB
export async function getFbAdsLibOptionsWithoutDB() {
  try {
    const cookieStore = cookies();

    const options = {
      method: "POST",
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9,fr;q=0.8",
        "content-type": "application/x-www-form-urlencoded",
        cookie: cookieStore.toString(), // Use Next.js cookies
        origin: "https://www.facebook.com",
        priority: "u=1, i",
        referer: "https://www.facebook.com/ads/library/",
        "sec-ch-prefers-color-scheme": "light",
        "sec-ch-ua":
          '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
        "sec-ch-ua-full-version-list":
          '"Google Chrome";v="125.0.6422.142", "Chromium";v="125.0.6422.142", "Not.A/Brand";v="24.0.0.0"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-model": '""',
        "sec-ch-ua-platform": '"Windows"',
        "sec-ch-ua-platform-version": '"15.0.0"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        "x-asbd-id": "129477",
        "x-fb-lsd": "AVrXxsv8opo",
      },
      body: new URLSearchParams({
        __aaid: "0",
        __user: "0",
        __a: "1",
        __req: "z",
        __hs: "19883.BP:DEFAULT.2.0..0.0",
        dpr: "1",
        __ccg: "GOOD",
        __rev: "1014085198",
        __s: "61ej9b:8c98qm:xglcc6",
        __hsi: "7378503818031070885",
        __dyn:
          "7xeUmxa3-Q8zo5ObwKBAgc9o9E6u5U4e1FxebzEdF8ixy7EiwvoWdwJwCwfW7oqx60Vo1upEK12wvk1bwbG78b87C2m3K2y11wBz81bo4a4oaEd86a0HU9k2C2218waG5E6i588Egz898mwkE-U6-3e4Ueo2sxOXwJwKwHxaaws8nwhE2Lxiaw4qxa7o-3qazo8U3ywbLwrU6Ci2G0z85C1Iwqo1uo7u1rw",
        __csr: "",
        lsd: "AVrXxsv8opo",
        jazoest: "21096",
        __spin_r: "1014085198",
        __spin_b: "trunk",
        __spin_t: "1717941793",
        __jssesw: "1",
      }).toString(),
    };

    return options;
  } catch (error) {
    console.error("Error in getFbAdsLibOptionsWithoutDB:", error);
    throw new Error("Failed to get Facebook Ads Library options from getFbAdsLibOptionsWithoutDB");
  }
}
