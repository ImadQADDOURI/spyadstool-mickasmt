// app/actions/detectPixelPlatformPayment.ts
"use server";

import { createHash } from "crypto";
import * as puppeteer from "puppeteer";

// Optimized settings for balancing speed and data collection
const DEFAULT_SETTINGS = {
  USER_AGENT:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  BROWSER_HEADLESS: false,
  INITIAL_WAIT: 1000, // 1 second
  MAX_TOTAL_TIME: 6000, // 6 seconds
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

// ... (keep your existing detector patterns)

interface TrackingDetector {
  name: string;
  patterns: string[];
}

interface DetectionResult {
  pixels: string[];
  platforms: string[];
  payments: string[];
}

// pixels detectos
const trackingPixelDetectors: TrackingDetector[] = [
  {
    name: "Meta",
    patterns: [
      "connect.facebook.net",
      "facebook-jssdk",
      "facebook.com/tr",
      "instagram.com/embed.js",
      "facebook.com/plugins",
    ],
  },
  {
    name: "Snapchat",
    patterns: ["sc-static.net/scevent.min.js", "tr6.snapchat.com"],
  },
  {
    name: "Google",
    patterns: [
      "google-analytics.com/analytics.js",
      "googletagmanager.com/gtag/js",
      "googleadservices.com/pagead/conversion",
      "google.com/ads/ga-audiences",
      "google-analytics",
      "googleadservices",
    ],
  },
  {
    name: "LinkedIn",
    patterns: [
      "snap.licdn.com/li.lms-analytics/insight.min.js",
      "platform.linkedin.com",
    ],
  },
  {
    name: "Twitter",
    patterns: ["static.ads-twitter.com/uwt.js", "platform.twitter.com"],
  },
  {
    name: "TikTok",
    patterns: ["analytics.tiktok.com", "tiktok.com/i18n", "analytics.tiktok"],
  },
  {
    name: "Pinterest",
    patterns: ["pintrk", "assets.pinterest.com", "ct.pinterest.com"],
  },
  {
    name: "Amazon",
    patterns: ["amazon-adsystem.com", "assoc-amazon.com"],
  },
  {
    name: "Microsoft",
    patterns: ["clarity.ms", "bat.bing.com"],
  },
  {
    name: "Adobe",
    patterns: ["demdex.net", "omtrdc.net"],
  },
  {
    name: "Criteo",
    patterns: ["static.criteo.net"],
  },
  {
    name: "Taboola",
    patterns: ["cdn.taboola.com"],
  },
  {
    name: "Outbrain",
    patterns: ["outbrain.com/outbrain.js"],
  },
  {
    name: "ABTasty",
    patterns: ["abtasty.com"],
  },
];
// platform detectors
const platformDetectors: TrackingDetector[] = [
  {
    name: "Shopify",
    patterns: [
      "cdn.shopify.com",
      "shopify.com/s/files",
      "myshopify.com",
      "shopifycdn",
      "shopify",
    ],
  },
  {
    name: "WooCommerce",
    patterns: ["woocommerce", "wp-content/plugins/woocommerce"],
  },
  {
    name: "Wix",
    patterns: ["static.wixstatic.com", "wix.com"],
  },
  {
    name: "BigCommerce",
    patterns: ["bigcommerce.com", "bigcommercecdn.com"],
  },
  {
    name: "Magento",
    patterns: ["static.magento.com", "mage/cookies.js"],
  },
  {
    name: "PrestaShop",
    patterns: ["prestashop", "prestashop.com"],
  },
  {
    name: "OpenCart",
    patterns: ["opencart", "catalog/view/javascript/jquery/"],
  },
  {
    name: "Squarespace",
    patterns: ["squarespace.com", "static1.squarespace.com"],
  },
  {
    name: "Shopware",
    patterns: ["shopware", "shopware.com"],
  },
  {
    name: "YouCan",
    patterns: ["youcan.shop", "youcanassets.com"],
  },
  {
    name: "Shoppy",
    patterns: ["shoppy.gg", "cdn.shoppy.gg"],
  },
];
// payment method detectors
const paymentDetectors: TrackingDetector[] = [
  {
    name: "Stripe",
    patterns: ["js.stripe.com", "stripe.com"],
  },
  {
    name: "PayPal",
    patterns: ["paypal.com/sdk", "paypalobjects.com"],
  },
  {
    name: "Google Pay",
    patterns: ["pay.google.com", "googleapis.com/pay"],
  },
  {
    name: "Apple Pay",
    patterns: ["apple-pay-gateway", "apple.com/apple-pay"],
  },
  {
    name: "Amazon Pay",
    patterns: ["static-na.payments-amazon.com", "amazonpay"],
  },
  {
    name: "Square",
    patterns: ["squareup.com", "square.com"],
  },
  {
    name: "Klarna",
    patterns: ["klarna.com", "klarnaservices.com"],
  },
  {
    name: "Affirm",
    patterns: ["affirm.com", "cdn1.affirm.com"],
  },
  {
    name: "Afterpay",
    patterns: ["afterpay.com", "static.afterpay.com"],
  },
  {
    name: "Venmo",
    patterns: ["venmo.com", "venmo.min.js"],
  },
];

const cache: Map<string, { result: DetectionResult; timestamp: number }> =
  new Map();

let browserInstance: puppeteer.Browser | null = null;

async function getBrowser(): Promise<puppeteer.Browser> {
  console.log("Getting browser instance...");
  if (!browserInstance) {
    browserInstance = await puppeteer.launch({
      headless: DEFAULT_SETTINGS.BROWSER_HEADLESS,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    });
    console.log("New browser instance created.");
  }
  return browserInstance;
}

async function fetchWithPuppeteer(url: string): Promise<FetchResult> {
  console.log(`Starting fetchWithPuppeteer for URL: ${url}`);
  const browser = await getBrowser();
  const page = await browser.newPage();

  let isComplete = false;
  const requests: RequestData[] = [];
  let latestHtml = "";

  try {
    console.log("Setting up page...");
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

    console.log("Starting navigation...");
    const navigationPromise = page
      .goto(url, { waitUntil: "networkidle0" })
      .catch((error) => {
        console.warn(`Navigation error for ${url}:`, error.message);
      });

    console.log(`Waiting initial ${DEFAULT_SETTINGS.INITIAL_WAIT}ms...`);
    await new Promise((resolve) =>
      setTimeout(resolve, DEFAULT_SETTINGS.INITIAL_WAIT),
    );

    console.log("Starting progressive data collection...");
    const dataCollectionPromise = progressiveDataCollection(page);

    console.log("Waiting for navigation or timeout...");
    await Promise.race([
      navigationPromise,
      new Promise((resolve) =>
        setTimeout(resolve, DEFAULT_SETTINGS.MAX_TOTAL_TIME),
      ),
    ]);

    isComplete = true;
    console.log("Navigation complete or max time reached.");

    latestHtml = await dataCollectionPromise;
    console.log("Data collection finished.");

    return { html: latestHtml, requests, isComplete };
  } catch (error) {
    console.error(`Error during page fetch for ${url}:`, error);
    return { html: latestHtml, requests, isComplete: false };
  } finally {
    console.log("Closing page...");
    await page
      .close()
      .catch((error) => console.warn("Error closing page:", error));
  }
}

async function progressiveDataCollection(
  page: puppeteer.Page,
): Promise<string> {
  console.log("Starting progressive data collection...");
  let latestHtml = "";
  const startTime = Date.now();

  return new Promise<string>((resolve) => {
    const interval = setInterval(async () => {
      try {
        console.log("Capturing current HTML and scrolling...");
        latestHtml = await page.content().catch((error) => {
          console.warn("Error capturing HTML:", error.message);
          return latestHtml; // Return the last successful capture
        });

        await page
          .evaluate(() => {
            window.scrollBy(0, window.innerHeight);
          })
          .catch((error) => console.warn("Error scrolling:", error.message));

        const bottomReached = await page
          .evaluate(
            () =>
              window.innerHeight + window.scrollY >= document.body.offsetHeight,
          )
          .catch(() => true); // Assume bottom reached if evaluation fails

        if (
          bottomReached ||
          Date.now() - startTime > DEFAULT_SETTINGS.MAX_TOTAL_TIME
        ) {
          console.log("Reached bottom or max time. Ending data collection.");
          clearInterval(interval);
          resolve(latestHtml);
        }
      } catch (error) {
        console.error("Error in progressive data collection:", error);
        clearInterval(interval);
        resolve(latestHtml); // Resolve with the latest HTML we have
      }
    }, DEFAULT_SETTINGS.SCROLL_INTERVAL);
  });
}

function detectFeatures(result: FetchResult): DetectionResult {
  console.log("Detecting features...");
  const allContent = `${result.html} ${result.requests.map((r) => `${r.url} ${r.postData || ""}`).join(" ")}`;

  const detectForCategory = (detectors: TrackingDetector[]): string[] => {
    return detectors
      .filter((detector) =>
        detector.patterns.some((pattern) => allContent.includes(pattern)),
      )
      .map((detector) => detector.name);
  };

  const detectedFeatures = {
    pixels: detectForCategory(trackingPixelDetectors),
    platforms: detectForCategory(platformDetectors),
    payments: detectForCategory(paymentDetectors),
    isComplete: result.isComplete,
  };

  console.log("Feature detection complete:", detectedFeatures);
  return detectedFeatures;
}

function getCacheKey(url: string): string {
  return createHash("md5").update(url).digest("hex");
}

export async function detectPixelPlatformPayment(
  url: string,
): Promise<DetectionResult> {
  console.log(`Starting detection for URL: ${url}`);
  const cacheKey = getCacheKey(url);
  const now = Date.now();
  const cached = cache.get(cacheKey);

  if (cached && now - cached.timestamp < DEFAULT_SETTINGS.CACHE_DURATION) {
    console.log("Returning cached result.");
    return cached.result;
  }

  try {
    const result = await fetchWithPuppeteer(url);
    const detectedFeatures = detectFeatures(result);

    cache.set(cacheKey, { result: detectedFeatures, timestamp: now });
    console.log("Detection complete and result cached.");

    return detectedFeatures;
  } catch (error) {
    console.error(`Error in detectFeatures for ${url}:`, error);
    return { pixels: [], platforms: [], payments: [], isComplete: false };
  }
}

export async function detectFeaturesMultiple(
  urls: string[],
): Promise<{ [url: string]: DetectionResult }> {
  console.log(`Starting multiple URL detection for ${urls.length} URLs`);
  const results = await Promise.all(
    urls.map((url) =>
      detectPixelPlatformPayment(url).catch((error) => {
        console.error(`Error detecting features for ${url}:`, error);
        return { pixels: [], platforms: [], payments: [], isComplete: false };
      }),
    ),
  );
  console.log("Multiple URL detection complete.");
  return Object.fromEntries(urls.map((url, index) => [url, results[index]]));
}

export async function closeBrowser() {
  if (browserInstance) {
    console.log("Closing browser instance...");
    await browserInstance
      .close()
      .catch((error) => console.warn("Error closing browser:", error));
    browserInstance = null;
    console.log("Browser instance closed.");
  }
}

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Optionally, you could close the browser here if it's a critical error
  // closeBrowser().catch(console.error);
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
    console.error("Error in main execution:", error);
  } finally {
    await closeBrowser();
  }
})();
*/
