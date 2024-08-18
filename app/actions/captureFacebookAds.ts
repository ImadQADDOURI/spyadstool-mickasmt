"use server";

import fs from "fs/promises";
import path from "path";
import puppeteer, { Browser, Page } from "puppeteer";

let browser: Browser | null = null;
let page: Page | null = null;
let requests: any[] = [];

export async function startCapturingFacebookAds() {
  if (!browser) {
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();

    // Enable request interception
    await page.setRequestInterception(true);

    page.on("request", (request) => {
      requests.push({
        url: request.url(),
        method: request.method(),
        headers: request.headers(),
        postData: request.postData(),
        timestamp: new Date().toISOString(),
      });
      request.continue();
    });

    await page.goto("https://www.facebook.com/ads/library", {
      waitUntil: "networkidle0",
    });

    return {
      message: "Capture started. Browser is open and capturing requests.",
    };
  }
  return { message: "Capture already in progress." };
}

export async function stopCapturingAndCloseBrowser() {
  if (browser && page) {
    await browser.close();

    // Save captured requests to a file
    const filePath = path.join(process.cwd(), "captured_requests.json");
    await fs.writeFile(filePath, JSON.stringify(requests, null, 2));

    browser = null;
    page = null;
    requests = [];

    return {
      message: "Capture stopped. Browser closed and data saved.",
      filePath,
    };
  }
  return { message: "No active capture to stop." };
}
