// app/actions/detectTrackingPixels.ts
"use server";

import * as puppeteer from "puppeteer";

// Global default settings
const DEFAULT_SETTINGS = {
  USE_PUPPETEER: true,
  BROWSER_HEADLESS: false,
  KEEP_BROWSER_OPEN: true,
  Navigation_TIMEOUT: 10000, // time to wait for navigation to complete
  DYNAMIC_TIMEOUT: 1000, // time to wait for dynamic content to load
  USE_CACHE: true,
  CACHE_DURATION: 1000 * 60 * 60 * 24, // 24 hours
};
//CACHE_DURATION = 1000 * 60 * 60; // 1 hour
//CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours

//CACHE_DURATION = Infinity; // no time limit
//While this would maximize performance, it's generally not recommended because:
//Websites can change their tracking pixels over time.
//You might miss new tracking technologies or pixels that are added.
//If there was an error in detection, it would never self-correct.

interface FetchResult {
  html: string;
  resources: string[];
}

interface TrackingPixelDetector {
  name: string;
  patterns: string[];
}

const trackingPixelDetectors: TrackingPixelDetector[] = [
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
    patterns: ["analytics.tiktok.com", "tiktok.com/i18n"],
  },
  {
    name: "Pinterest",
    patterns: ["pintrk", "assets.pinterest.com"],
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
];

let browserInstance: puppeteer.Browser | null = null;

async function getBrowser() {
  if (!browserInstance) {
    browserInstance = await puppeteer.launch({
      headless: DEFAULT_SETTINGS.BROWSER_HEADLESS,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }
  return browserInstance;
}

async function fetchWithPuppeteer(
  url: string,
  keepBrowserOpen: boolean = DEFAULT_SETTINGS.KEEP_BROWSER_OPEN,
  dynamicTimeout: number = DEFAULT_SETTINGS.DYNAMIC_TIMEOUT,
): Promise<FetchResult> {
  const browser = await getBrowser();
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  );

  const resources: string[] = [];
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    resources.push(request.url());
    request.continue();
  });

  await page.goto(url, {
    waitUntil: "networkidle0",
    timeout: DEFAULT_SETTINGS.Navigation_TIMEOUT,
  });

  // Scroll to the bottom of the page
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  // Add a delay to allow for dynamic content to load
  // Use the configurable dynamicTimeout
  await new Promise((resolve) => setTimeout(resolve, dynamicTimeout));

  const html = await page.content();

  await page.close();

  if (!keepBrowserOpen) {
    await browser.close();
    browserInstance = null;
  }

  return { html, resources };
}

async function fetchWithSimpleRequest(url: string): Promise<FetchResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  const response = await fetch(url, {
    signal: controller.signal,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
  });

  clearTimeout(timeoutId);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const html = await response.text();
  return { html, resources: [] };
}

function detectPixels(result: FetchResult): string[] {
  const allContent = result.html + " " + result.resources.join(" ");
  return trackingPixelDetectors
    .filter((detector) =>
      detector.patterns.some((pattern) => allContent.includes(pattern)),
    )
    .map((detector) => detector.name);
}

const cache: { [url: string]: { result: string[]; timestamp: number } } = {};

export async function detectTrackingPixels(
  url: string,
  usePuppeteer: boolean = DEFAULT_SETTINGS.USE_PUPPETEER,
  keepBrowserOpen: boolean = DEFAULT_SETTINGS.KEEP_BROWSER_OPEN,
  useCache: boolean = DEFAULT_SETTINGS.USE_CACHE,
  dynamicTimeout: number = DEFAULT_SETTINGS.DYNAMIC_TIMEOUT,
): Promise<string[]> {
  const now = Date.now();
  if (
    useCache &&
    cache[url] &&
    now - cache[url].timestamp < DEFAULT_SETTINGS.CACHE_DURATION
  ) {
    return cache[url].result;
  }

  try {
    let result: FetchResult;
    if (usePuppeteer) {
      result = await fetchWithPuppeteer(url, keepBrowserOpen, dynamicTimeout);
    } else {
      result = await fetchWithSimpleRequest(url);
    }

    const detectedPixels = detectPixels(result);

    if (useCache) {
      cache[url] = { result: detectedPixels, timestamp: now };
    }

    console.log("Detected pixels:", detectedPixels);
    return detectedPixels;
  } catch (error) {
    console.error("Error in detectTrackingPixels:", error);
    throw error;
  }
}

export async function detectTrackingPixelsMultiple(
  urls: string[],
  usePuppeteer: boolean = DEFAULT_SETTINGS.USE_PUPPETEER,
  keepBrowserOpen: boolean = DEFAULT_SETTINGS.KEEP_BROWSER_OPEN,
  useCache: boolean = DEFAULT_SETTINGS.USE_CACHE,
  dynamicTimeout: number = DEFAULT_SETTINGS.DYNAMIC_TIMEOUT,
): Promise<{ [url: string]: string[] }> {
  const results = await Promise.all(
    urls.map((url) =>
      detectTrackingPixels(
        url,
        usePuppeteer,
        keepBrowserOpen,
        useCache,
        dynamicTimeout,
      ),
    ),
  );
  return Object.fromEntries(urls.map((url, index) => [url, results[index]]));
}

// Function to manually close the browser if it's open
export async function closeBrowser() {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}

{
  /*
  // For a single URL
const pixels = await detectTrackingPixels('https://example.com', true, true, true, 2000);
console.log(pixels);

// For multiple URLs
const multipleResults = await detectTrackingPixelsMultiple(
  ['https://example1.com', 'https://example2.com'],
  true, // use Puppeteer
  true, // keep browser open
  true  // use cache
);
console.log(multipleResults);

// To manually close the browser when you're done
await closeBrowser();
  */
}
