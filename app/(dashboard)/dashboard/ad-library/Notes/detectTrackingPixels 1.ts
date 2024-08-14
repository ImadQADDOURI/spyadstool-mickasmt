// app/actions/detectTrackingPixels.ts
"use server";

import puppeteer from "puppeteer";

interface FetchResult {
  html: string;
  scripts: string[];
  requests: string[];
}

interface TrackingPixelDetector {
  name: string;
  detect: (result: FetchResult) => boolean;
}

const trackingPixelDetectors: TrackingPixelDetector[] = [
  {
    name: "Meta",
    detect: (result) => {
      const patterns = [
        "connect.facebook.net",
        "facebook-jssdk",
        "facebook.com/tr",
        "instagram.com/embed.js",
        "facebook.com/plugins",
        "config/231708391375805",
      ];
      return patterns.some(
        (pattern) =>
          result.html.includes(pattern) ||
          result.scripts.some((src) => src.includes(pattern)) ||
          result.requests.some((url) => url.includes(pattern)),
      );
    },
  },
  {
    name: "Snapchat",
    detect: (result) => {
      const patterns = ["sc-static.net/scevent.min.js", "tr6.snapchat.com"];
      return patterns.some(
        (pattern) =>
          result.html.includes(pattern) ||
          result.scripts.some((src) => src.includes(pattern)) ||
          result.requests.some((url) => url.includes(pattern)),
      );
    },
  },
  {
    name: "Google",
    detect: (result) => {
      const patterns = [
        "google-analytics.com/analytics.js",
        "googletagmanager.com/gtag/js",
        "googleadservices.com/pagead/conversion",
        "google.com/ads/ga-audiences",
      ];
      return patterns.some(
        (pattern) =>
          result.html.includes(pattern) ||
          result.scripts.some((src) => src.includes(pattern)) ||
          result.requests.some((url) => url.includes(pattern)),
      );
    },
  },
  {
    name: "LinkedIn",
    detect: (result) => {
      const patterns = [
        "snap.licdn.com/li.lms-analytics/insight.min.js",
        "platform.linkedin.com",
      ];
      return patterns.some(
        (pattern) =>
          result.html.includes(pattern) ||
          result.scripts.some((src) => src.includes(pattern)) ||
          result.requests.some((url) => url.includes(pattern)),
      );
    },
  },
  {
    name: "Twitter",
    detect: (result) => {
      const patterns = [
        "static.ads-twitter.com/uwt.js",
        "platform.twitter.com",
      ];
      return patterns.some(
        (pattern) =>
          result.html.includes(pattern) ||
          result.scripts.some((src) => src.includes(pattern)) ||
          result.requests.some((url) => url.includes(pattern)),
      );
    },
  },
  {
    name: "TikTok",
    detect: (result) => {
      const patterns = ["analytics.tiktok.com", "tiktok.com/i18n"];
      return patterns.some(
        (pattern) =>
          result.html.includes(pattern) ||
          result.scripts.some((src) => src.includes(pattern)) ||
          result.requests.some((url) => url.includes(pattern)),
      );
    },
  },
  {
    name: "Pinterest",
    detect: (result) => {
      const patterns = ["pintrk", "assets.pinterest.com"];
      return patterns.some(
        (pattern) =>
          result.html.includes(pattern) ||
          result.scripts.some((src) => src.includes(pattern)) ||
          result.requests.some((url) => url.includes(pattern)),
      );
    },
  },
  {
    name: "Amazon",
    detect: (result) => {
      const patterns = ["amazon-adsystem.com", "assoc-amazon.com"];
      return patterns.some(
        (pattern) =>
          result.html.includes(pattern) ||
          result.scripts.some((src) => src.includes(pattern)) ||
          result.requests.some((url) => url.includes(pattern)),
      );
    },
  },
  {
    name: "Microsoft",
    detect: (result) => {
      const patterns = ["clarity.ms", "bat.bing.com"];
      return patterns.some(
        (pattern) =>
          result.html.includes(pattern) ||
          result.scripts.some((src) => src.includes(pattern)) ||
          result.requests.some((url) => url.includes(pattern)),
      );
    },
  },
  {
    name: "Adobe",
    detect: (result) => {
      const patterns = ["demdex.net", "omtrdc.net"];
      return patterns.some(
        (pattern) =>
          result.html.includes(pattern) ||
          result.scripts.some((src) => src.includes(pattern)) ||
          result.requests.some((url) => url.includes(pattern)),
      );
    },
  },
  {
    name: "Criteo",
    detect: (result) => {
      const patterns = ["static.criteo.net"];
      return patterns.some(
        (pattern) =>
          result.html.includes(pattern) ||
          result.scripts.some((src) => src.includes(pattern)) ||
          result.requests.some((url) => url.includes(pattern)),
      );
    },
  },
  {
    name: "Taboola",
    detect: (result) => {
      const patterns = ["cdn.taboola.com", "tfa.js"];
      return patterns.some(
        (pattern) =>
          result.html.includes(pattern) ||
          result.scripts.some((src) => src.includes(pattern)) ||
          result.requests.some((url) => url.includes(pattern)),
      );
    },
  },
  {
    name: "Outbrain",
    detect: (result) => {
      const patterns = ["outbrain.com/outbrain.js"];
      return patterns.some(
        (pattern) =>
          result.html.includes(pattern) ||
          result.scripts.some((src) => src.includes(pattern)) ||
          result.requests.some((url) => url.includes(pattern)),
      );
    },
  },
];

async function fetchWithPuppeteer(url: string): Promise<FetchResult> {
  console.log("Starting Puppeteer fetch for:", url);
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  );

  const requests: string[] = [];
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    console.log("Request URL:", request.url());
    requests.push(request.url());
    request.continue();
  });

  console.log("Navigating to page...");
  await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
  console.log("Page loaded, waiting for 10 seconds...");
  await new Promise((resolve) => setTimeout(resolve, 10000));

  console.log("Scrolling page...");
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log("Extracting page content...");
  const html = await page.content();
  console.log("HTML length:", html.length);

  console.log("Extracting scripts...");
  const scripts = await page.evaluate(() =>
    Array.from(document.getElementsByTagName("script")).map(
      (script) => script.src,
    ),
  );
  console.log("Scripts found:", scripts.length);

  console.log("Requests intercepted:", requests.length);

  await browser.close();
  return { html, scripts, requests };
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
  return { html, scripts: [], requests: [] };
}

export async function detectTrackingPixels(
  url: string,
  usePuppeteer: boolean = false,
): Promise<string[]> {
  try {
    console.log("Starting pixel detection for:", url);
    console.log("Using Puppeteer:", usePuppeteer);

    let result: FetchResult;

    if (usePuppeteer) {
      result = await fetchWithPuppeteer(url);
    } else {
      result = await fetchWithSimpleRequest(url);
    }

    if (!result.html) {
      throw new Error("Received empty response from the server");
    }

    console.log("Checking for tracking pixels...");
    const detectedPixels = trackingPixelDetectors
      .filter((detector) => {
        const detected = detector.detect(result);
        console.log(`${detector.name} pixel detected:`, detected);
        return detected;
      })
      .map((detector) => detector.name);

    console.log("Detected pixels:", detectedPixels);
    return detectedPixels;
  } catch (error) {
    console.error("Error in detectTrackingPixels:", error);
    throw error;
  }
}
