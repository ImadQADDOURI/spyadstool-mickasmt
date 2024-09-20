// app/actions/detectPixelPlatformPayment.ts
"use server";

import { createHash } from "crypto";
import * as puppeteer from "puppeteer";

import {
  paymentDetectors,
  platformDetectors,
  TrackingDetector,
  trackingPixelDetectors,
} from "@/lib/Scrape_Detectorpatterns_NonTrackableWebsites";

// Optimized settings for balancing speed and data collection

const DEFAULT_SETTINGS = {
  USER_AGENT:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  BROWSER_HEADLESS: true,
  INITIAL_WAIT: 1000, // 1 second
  MAX_TOTAL_TIME: 5000, // 5 seconds
  SCROLL_INTERVAL: 50, // 50 ms for faster scrolling
  CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours
};

interface RequestData {
  url: string;
  type: string;
  method: string;
  postData?: string;
}

interface FetchResult {
  html: string;
  requests: RequestData[];
  isComplete: boolean;
}

interface DetectionResult {
  pixels: string[];
  platforms: string[];
  payments: string[];
  isComplete: boolean;
}

const cache: Map<string, { result: DetectionResult; timestamp: number }> =
  new Map();

let browserInstance: puppeteer.Browser | null = null;

async function getBrowser(): Promise<puppeteer.Browser> {
  if (!browserInstance || !browserInstance.isConnected()) {
    if (browserInstance) {
      console.log(
        "⛏️ Existing browser instance disconnected. Creating new instance.",
      );
      await browserInstance.close().catch(() => {}); // Attempt to close, ignore errors
    }
    browserInstance = await puppeteer.launch({
      headless: DEFAULT_SETTINGS.BROWSER_HEADLESS,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    });
    console.log("⛏️ New browser instance created");
  }
  return browserInstance;
}

async function fetchWithPuppeteer(url: string): Promise<FetchResult> {
  //console.log(`⛏️ Fetching data for URL: ${url}`);
  const browser = await getBrowser();
  const page = await browser.newPage();

  let isComplete = false;
  const requests: RequestData[] = [];
  let latestHtml = "";

  try {
    await page.setUserAgent(DEFAULT_SETTINGS.USER_AGENT);
    await page.setRequestInterception(true);

    page.on("request", (request) => {
      requests.push({
        url: request.url(),
        type: request.resourceType(),
        method: request.method(),
        postData: request.postData(),
      });
      request.continue();
    });

    const navigationPromise = page
      .goto(url, { waitUntil: "networkidle0" })
      .catch((error) => {
        console.warn(`⛏️ Navigation error for ${url}:`, error.message);
      });

    await new Promise((resolve) =>
      setTimeout(resolve, DEFAULT_SETTINGS.INITIAL_WAIT),
    );

    const dataCollectionPromise = progressiveDataCollection(page);

    await Promise.race([
      navigationPromise,
      new Promise((resolve) =>
        setTimeout(resolve, DEFAULT_SETTINGS.MAX_TOTAL_TIME),
      ),
    ]);

    isComplete = true;

    latestHtml = await dataCollectionPromise;

    return { html: latestHtml, requests, isComplete };
  } catch (error) {
    console.error(`⛏️ Error during page fetch for ${url}:`, error);
    return { html: latestHtml, requests, isComplete: false };
  } finally {
    await page
      .close()
      .catch((error) => console.warn("⛏️ Error closing page:", error));
  }
}

async function progressiveDataCollection(
  page: puppeteer.Page,
): Promise<string> {
  let latestHtml = "";
  const startTime = Date.now();

  return new Promise<string>((resolve) => {
    const interval = setInterval(async () => {
      try {
        latestHtml = await page.content().catch(() => latestHtml);

        await page
          .evaluate(() => {
            window.scrollBy(0, window.innerHeight);
          })
          .catch(() => {});

        const bottomReached = await page
          .evaluate(
            () =>
              window.innerHeight + window.scrollY >= document.body.offsetHeight,
          )
          .catch(() => true);

        if (
          bottomReached ||
          Date.now() - startTime > DEFAULT_SETTINGS.MAX_TOTAL_TIME
        ) {
          clearInterval(interval);
          resolve(latestHtml);
        }
      } catch (error) {
        clearInterval(interval);
        resolve(latestHtml);
      }
    }, DEFAULT_SETTINGS.SCROLL_INTERVAL);
  });
}

function detectFeatures(result: FetchResult): DetectionResult {
  const allContent = `${result.html} ${result.requests.map((r) => `${r.url} ${r.postData || ""}`).join(" ")}`;

  const detectForCategory = (detectors: TrackingDetector[]): string[] => {
    return detectors
      .filter((detector) =>
        detector.patterns.some((pattern) => allContent.includes(pattern)),
      )
      .map((detector) => detector.name);
  };

  return {
    pixels: detectForCategory(trackingPixelDetectors),
    platforms: detectForCategory(platformDetectors),
    payments: detectForCategory(paymentDetectors),
    isComplete: result.isComplete,
  };
}

function getCacheKey(url: string): string {
  return createHash("md5").update(url).digest("hex");
}

export async function detectPixelPlatformPayment(
  url: string,
): Promise<DetectionResult> {
  console.log(`⛏️ Starting detection for URL: ${url}`);
  const cacheKey = getCacheKey(url);
  const now = Date.now();
  const cached = cache.get(cacheKey);

  if (cached && now - cached.timestamp < DEFAULT_SETTINGS.CACHE_DURATION) {
    console.log("⛏️ Returning cached result");
    return cached.result;
  }

  try {
    const result = await fetchWithPuppeteer(url);
    const detectedFeatures = detectFeatures(result);

    cache.set(cacheKey, { result: detectedFeatures, timestamp: now });
    //console.log("⛏️ Detection complete and result cached");
    console.log("⛏️⛏️⛏️", detectedFeatures);

    return detectedFeatures;
  } catch (error) {
    console.error(`⛏️ Error in detectFeatures for ${url}:`, error);
    return { pixels: [], platforms: [], payments: [], isComplete: false };
  }
}

export async function detectFeaturesMultiple(
  urls: string[],
): Promise<{ [url: string]: DetectionResult }> {
  console.log(`⛏️ Starting detection for ${urls.length} URLs`);
  const results = await Promise.all(
    urls.map((url) =>
      detectPixelPlatformPayment(url).catch((error) => {
        console.error(`⛏️ Error detecting features for ${url}:`, error);
        return { pixels: [], platforms: [], payments: [], isComplete: false };
      }),
    ),
  );
  console.log("⛏️ Multiple URL detection complete");
  return Object.fromEntries(urls.map((url, index) => [url, results[index]]));
}

export async function closeBrowser() {
  if (browserInstance) {
    await browserInstance
      .close()
      .catch((error) => console.warn("⛏️ Error closing browser:", error));
    browserInstance = null;
    console.log("⛏️ Browser instance closed");
  }
}

process.on("unhandledRejection", (reason, promise) => {
  console.error("⛏️ Unhandled Rejection at:", promise, "reason:", reason);
});

// Usage example (commented out)
/*
(async () => {
  try {
    const features = await detectPixelPlatformPayment('https://example.com');
    console.log(features);

    const multipleResults = await detectFeaturesMultiple(['https://example1.com', 'https://example2.com']);
    console.log(multipleResults);
  } catch (error) {
    console.error("⛏️ Error in main execution:", error);
  } finally {
    await closeBrowser();
  }
})();
*/
