"use server";

import puppeteer from "puppeteer";

export const puppeteerCapture_Requests_Responses = async () => {
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

    page.on("response", async (response) => {
      if (
        response.request().resourceType() === "xhr" ||
        response.request().resourceType() === "fetch"
      ) {
        const requestIndex = requests.findIndex(
          (req) => req.url === response.url(),
        );
        if (requestIndex !== -1) {
          requests[requestIndex].response = {
            status: response.status(),
            headers: response.headers(),
            body: await response.text(),
          };
        }
      }
    });

    await page.goto(TARGET_URL, { waitUntil: "networkidle2" });

    console.log(
      "🚀 ~ file: puppeteerCaptureRequests.ts:puppeteerCaptureRequests ~ requests:",
      requests,
    );

    return requests;
  } catch (error) {
    console.error("An error occurred:", error);
    return { error: error.message };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
