// app/actions/detectPixelPlatformPayment.ts
"use server";

import * as puppeteer from "puppeteer";

// Global default settings
const DEFAULT_SETTINGS = {
  USER_AGENT:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
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
];
// platform detectors
const platformDetectors: TrackingDetector[] = [
  {
    name: "Shopify",
    patterns: ["cdn.shopify.com", "shopify.com/s/files", "myshopify.com"],
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

let browserInstance: puppeteer.Browser | null = null;

async function getBrowser(): Promise<puppeteer.Browser> {
  if (!browserInstance) {
    browserInstance = await puppeteer.launch({
      headless: DEFAULT_SETTINGS.BROWSER_HEADLESS,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  } else {
    try {
      // Check if the browser is still open and usable
      await browserInstance.version();
    } catch (error) {
      console.log(
        "Existing browser instance is not usable, creating a new one",
      );
      await closeBrowser(); // Ensure the old instance is properly closed
      browserInstance = await puppeteer.launch({
        headless: DEFAULT_SETTINGS.BROWSER_HEADLESS,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    }
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

  try {
    await page.setUserAgent(DEFAULT_SETTINGS.USER_AGENT);

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

    return { html, resources };
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  } finally {
    await page.close();

    // Close the browser if keepBrowserOpen is false
    if (!keepBrowserOpen) {
      await closeBrowser();
    }
  }
}

async function fetchWithSimpleRequest(url: string): Promise<FetchResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  const response = await fetch(url, {
    signal: controller.signal,
    headers: {
      "User-Agent": DEFAULT_SETTINGS.USER_AGENT,
    },
  });

  clearTimeout(timeoutId);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const html = await response.text();
  return { html, resources: [] };
}

function detectFeatures(result: FetchResult): DetectionResult {
  const allContent = result.html + " " + result.resources.join(" ");

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
  };
}

const cache: { [url: string]: { result: DetectionResult; timestamp: number } } =
  {};

export async function detectPixelPlatformPayment(
  url: string,
  usePuppeteer: boolean = DEFAULT_SETTINGS.USE_PUPPETEER,
  keepBrowserOpen: boolean = DEFAULT_SETTINGS.KEEP_BROWSER_OPEN,
  useCache: boolean = DEFAULT_SETTINGS.USE_CACHE,
  dynamicTimeout: number = DEFAULT_SETTINGS.DYNAMIC_TIMEOUT,
): Promise<DetectionResult> {
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

    const detectedFeatures = detectFeatures(result);

    if (useCache) {
      cache[url] = { result: detectedFeatures, timestamp: now };
    }

    console.log("Detected features:", detectedFeatures);
    return detectedFeatures;
  } catch (error) {
    console.error("Error in detectFeatures:", error);
    // Return partial results if available, empty arrays otherwise
    return {
      pixels: [],
      platforms: [],
      payments: [],
    };
  }
}

export async function detectFeaturesMultiple(
  urls: string[],
  usePuppeteer: boolean = DEFAULT_SETTINGS.USE_PUPPETEER,
  keepBrowserOpen: boolean = DEFAULT_SETTINGS.KEEP_BROWSER_OPEN,
  useCache: boolean = DEFAULT_SETTINGS.USE_CACHE,
  dynamicTimeout: number = DEFAULT_SETTINGS.DYNAMIC_TIMEOUT,
): Promise<{ [url: string]: DetectionResult }> {
  const results = await Promise.all(
    urls.map((url) =>
      detectPixelPlatformPayment(
        url,
        usePuppeteer,
        keepBrowserOpen,
        useCache,
        dynamicTimeout,
      ).catch((error) => {
        console.error(`Error detecting features for ${url}:`, error);
        return {
          pixels: [],
          platforms: [],
          payments: [],
        };
      }),
    ),
  );
  return Object.fromEntries(urls.map((url, index) => [url, results[index]]));
}

// Function to manually close the browser if it's open
export async function closeBrowser() {
  if (browserInstance) {
    try {
      await browserInstance.close();
    } catch (error) {
      console.error("Error closing browser:", error);
    } finally {
      browserInstance = null;
    }
  }
}

// Usage examples (commented out)
{
  /*
  // For a single URL
  const features = await detectFeatures('https://example.com', true, true, true, 2000);
  console.log(features);

  // For multiple URLs
  const multipleResults = await detectFeaturesMultiple(
    ['https://example1.com', 'https://example2.com'],
    true, // use Puppeteer
    true, // keep browser open
    true, // use cache
    2000  // dynamic timeout
  );
  console.log(multipleResults);

  // To manually close the browser when you're done
  await closeBrowser();
  */
}
