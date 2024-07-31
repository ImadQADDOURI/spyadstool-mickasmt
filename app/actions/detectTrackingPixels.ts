// app/actions/detectTrackingPixels.ts
"use server";

import puppeteer from "puppeteer";

interface TrackingPixelDetector {
  name: string;
  detect: (html: string) => boolean;
}

const trackingPixelDetectors: TrackingPixelDetector[] = [
  {
    name: "Meta",
    detect: (html) =>
      html.includes("connect.facebook.net") ||
      html.includes("facebook-jssdk") ||
      html.includes("facebook.com/tr") ||
      html.includes("instagram.com/embed.js") ||
      html.includes("facebook.com/plugins"),
  },
  {
    name: "Snapchat",
    detect: (html) =>
      html.includes("sc-static.net/scevent.min.js") ||
      html.includes("tr6.snapchat.com"),
  },
  {
    name: "Google",
    detect: (html) =>
      html.includes("google-analytics.com/analytics.js") ||
      html.includes("googletagmanager.com/gtag/js") ||
      html.includes("googleadservices.com/pagead/conversion") ||
      html.includes("google.com/ads/ga-audiences"),
  },
  {
    name: "LinkedIn",
    detect: (html) =>
      html.includes("snap.licdn.com/li.lms-analytics/insight.min.js") ||
      html.includes("platform.linkedin.com"),
  },
  {
    name: "Twitter",
    detect: (html) =>
      html.includes("static.ads-twitter.com/uwt.js") ||
      html.includes("platform.twitter.com"),
  },
  {
    name: "TikTok",
    detect: (html) =>
      html.includes("analytics.tiktok.com") || html.includes("tiktok.com/i18n"),
  },
  {
    name: "Pinterest",
    detect: (html) =>
      html.includes("pintrk") || html.includes("assets.pinterest.com"),
  },
  {
    name: "Amazon",
    detect: (html) =>
      html.includes("amazon-adsystem.com") || html.includes("assoc-amazon.com"),
  },
  {
    name: "Microsoft",
    detect: (html) =>
      html.includes("clarity.ms") || html.includes("bat.bing.com"),
  },
  {
    name: "Adobe",
    detect: (html) =>
      html.includes("demdex.net") || html.includes("omtrdc.net"),
  },
  {
    name: "Criteo",
    detect: (html) => html.includes("static.criteo.net"),
  },
  {
    name: "Taboola",
    detect: (html) => html.includes("cdn.taboola.com"),
  },
  {
    name: "Outbrain",
    detect: (html) => html.includes("outbrain.com/outbrain.js"),
  },
];

async function fetchWithPuppeteer(url: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const html = await page.content();
  await browser.close();
  return html;
}

async function fetchWithSimpleRequest(url: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 1000); // 5 second timeout

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

  return await response.text();
}

export async function detectTrackingPixels(
  url: string,
  usePuppeteer: boolean = false,
): Promise<string[]> {
  try {
    console.log(
      "🚀🚀🚀🚀 ~ file: detectTrackingPixels.ts: usePuppeteer:",
      usePuppeteer,
    );

    let html: string;

    if (usePuppeteer) {
      html = await fetchWithPuppeteer(url);
    } else {
      html = await fetchWithSimpleRequest(url);
    }

    if (!html) {
      throw new Error("Received empty response from the server");
    }

    return trackingPixelDetectors
      .filter((detector) => detector.detect(html))
      .map((detector) => detector.name);
  } catch (error) {
    console.error("Error fetching or analyzing the website:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}
