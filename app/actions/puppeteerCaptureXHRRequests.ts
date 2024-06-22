"use server";

import puppeteer from "puppeteer";

export const puppeteerCaptureXHRRequests = async () => {
  const TARGET_URL = "https://www.facebook.com/ads/library";
  let browser;

  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const requests: any[] = [];

    await page.setRequestInterception(true);

    page.on("request", (request) => {
      if (
        request.resourceType() === "xhr" ||
        request.resourceType() === "fetch"
      ) {
        requests.push({
          url: request.url(),
          method: request.method(),
          headers: request.headers(),
          postData: request.postData(),
        });
      }
      request.continue();
    });

    await page.goto(TARGET_URL, { waitUntil: "networkidle2" });

    console.log(
      "🚀 ~ file: puppeteerCaptureXHRRequests.ts:puppeteerCaptureXHRRequests ~ requests:",
      //requests,
    );
    return requests;
  } catch (error) {
    console.error("An error occurred:", error);
    return [];
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error("Failed to close the browser:", closeError);
      }
    }
  }
};
