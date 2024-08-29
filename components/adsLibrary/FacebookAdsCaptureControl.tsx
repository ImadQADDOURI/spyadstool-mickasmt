//FacebookAdsCaptureControl.tsx
"use client";

import { useState } from "react";

import {
  startCapturingFacebookAds,
  stopCapturingAndCloseBrowser,
} from "@/app/actions/captureFacebookAds";

export default function FacebookAdsCaptureControl() {
  const [status, setStatus] = useState("");

  const handleStartCapture = async () => {
    setStatus("Starting capture...");
    const result = await startCapturingFacebookAds();
    setStatus(result.message);
  };

  const handleStopCapture = async () => {
    setStatus("Stopping capture and closing browser...");
    const result = await stopCapturingAndCloseBrowser();
    setStatus(result.message);
  };

  return (
    <div>
      <button
        className="mr-2 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        onClick={handleStartCapture}
      >
        Start Capturing Facebook Ads
      </button>
      <button
        className="mr-2 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        onClick={handleStopCapture}
      >
        Stop Capturing and Close Browser
      </button>
      <p>Status: {status}</p>
    </div>
  );
}
