// /app/page.tsx
"use client";

import { useState, useTransition } from "react";

import { AdsLibrary } from "@/components/adsLibrary/AdsLibrary";
import {
  buildFbAdsLibOPTIONS,
  getStoredOptions,
} from "@/app/actions/buildFbAdsLibOPTIONS";
import { buildFbAdsLibUrl } from "@/app/actions/buildFbAdsLibUrl";
//import { puppeteerCapture_Requests_Responses } from "@/app/(dashboard)/dashboard/ad-library/Notes/puppeteerCaptureXHRRequestsAndResponses";
import { puppeteerCaptureXHRRequests } from "@/app/actions/puppeteerCaptureXHRRequests";

export default function Home() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();

  const function_puppeteerCaptureXHRRequests = async () => {
    startTransition(async () => {
      try {
        const data = await puppeteerCaptureXHRRequests();
        console.log("🚀 ~ file: page.tsx:handleCapture ~ data:");
      } catch (error) {
        console.error("Error capturing requests:", error);
      }
    });
  };

  const function_buildFbAdsLibOPTIONS = async () => {
    startTransition(async () => {
      try {
        const options = await buildFbAdsLibOPTIONS();
        console.log(
          "🚀 ~ file: page.tsx:buildFbAdsLibOPTIONS ~ options:",
          options,
        );
      } catch (error) {
        console.error("Error function_buildFbAdsLibOPTIONS:", error);
      }
    });
  };

  const display_Store_XHR_Request_Options = async () => {
    startTransition(async () => {
      try {
        const options = await getStoredOptions();
        console.log(
          "🚀 ~ file: page.tsx:buildFbAdsLibOPTIONS ~ options: getStoredOptions ",
          options,
        );
      } catch (error) {
        console.error("Error capturing requests:", error);
      }
    });
  };

  const function_buildFbAdsLibURL = async () => {
    startTransition(async () => {
      try {
        const url = await buildFbAdsLibUrl({ q: "cat", ad_type: "all" });
        console.log("🚀 ~ file: page.tsx:buildFbAdsLibUrl ~ options:", url);
      } catch (error) {
        console.error("Error function_buildFbAdsLibURL:", error);
      }
    });
  };

  return (
    <div>
      <h1>Puppeteer Capture XHR Requests</h1>
      <button
        className="mr-2 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        onClick={function_puppeteerCaptureXHRRequests}
        disabled={isPending}
      >
        {isPending ? "Capturing..." : "Capture Requests"}
      </button>

      <h1>Build buildFbAdsLibOPTIONS</h1>
      <button
        className="mr-2 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        onClick={function_buildFbAdsLibOPTIONS}
        disabled={isPending}
      >
        {isPending ? "Processing..." : "buildFbAdsLibOPTIONS"}
      </button>

      <h1>display_Store_XHR_Request_Options</h1>
      <button
        className="mr-2 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        onClick={display_Store_XHR_Request_Options}
        disabled={isPending}
      >
        {isPending ? "Processing..." : "display_Store_XHR_Request_Options"}
      </button>

      <h1>buildFbAdsLibUrl</h1>
      <button
        className="mr-2 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        onClick={function_buildFbAdsLibURL}
        disabled={isPending}
      >
        {isPending ? "Processing..." : "buildFbAdsLibUrl"}
      </button>

      <AdsLibrary />
    </div>
  );
}
