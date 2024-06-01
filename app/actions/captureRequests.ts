// /app/actions/captureRequests.ts
"use server";

import puppeteer from "puppeteer";

export const captureRequests = async () => {
  const TARGET_URL = "https://www.facebook.com/ads/library";

  const browser = await puppeteer.launch({ headless: false });
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

  await browser.close();
  return requests;
};
