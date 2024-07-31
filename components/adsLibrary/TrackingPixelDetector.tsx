// app/components/adsLibrary/TrackingPixelDetector.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { AlertCircle, Loader2, Search, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button"; // Assuming you're using shadcn/ui
import { detectTrackingPixels } from "@/app/actions/detectTrackingPixels";

interface TrackingPixelDetectorProps {
  url?: string;
  usePuppeteer?: boolean;
}

const pixelIcons: Record<string, string> = {
  Meta: "/icons/meta.svg",
  Snapchat: "/icons/snapchat.svg",
  Google: "/icons/google.svg",
  LinkedIn: "/icons/linkedin.svg",
  Twitter: "/icons/twitter.svg",
  TikTok: "/icons/tiktok.svg",
  Pinterest: "/icons/pinterest.svg",
  Amazon: "/icons/amazon.svg",
  Microsoft: "/icons/microsoft.svg",
  Adobe: "/icons/adobe.svg",
  Criteo: "/icons/criteo.svg",
  Taboola: "/icons/taboola.svg",
  Outbrain: "/icons/outbrain.svg",
};

export default function TrackingPixelDetector({
  url,
  usePuppeteer = false,
}: TrackingPixelDetectorProps) {
  const [detectedPixels, setDetectedPixels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showButton, setShowButton] = useState(true);

  const detectPixels = async () => {
    if (!url) return;
    setIsLoading(true);
    setShowButton(false);
    try {
      const pixels = await detectTrackingPixels(url, usePuppeteer);
      setDetectedPixels(pixels);
      setError(null);
    } catch (err) {
      console.error("Failed to detect pixels:", err);
      setError(
        err instanceof Error ? err.message : "Failed to analyze the website",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (showButton) {
    return (
      <button
        onClick={detectPixels}
        className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-teal-300 to-lime-300 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-lime-200 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 dark:focus:ring-lime-800"
      >
        <span className="relative rounded-md bg-white px-3 py-0 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900">
          <Search className="h-4 w-4" />
        </span>
      </button>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Detecting pixels...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center text-red-500">
        <AlertCircle className="mr-2 h-4 w-4" /> {error}
      </div>
    );
  }

  if (detectedPixels.length === 0) {
    return (
      <div className="flex items-center text-gray-500">
        <XCircle className="mr-2 h-4 w-4" /> No pixels detected
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-2">
      {detectedPixels.map((pixel, index) => (
        <div key={index} title={pixel} className="h-4 w-4">
          {pixelIcons[pixel] ? (
            <Image src={pixelIcons[pixel]} alt={pixel} width={24} height={24} />
          ) : (
            <span>{pixel}</span>
          )}
        </div>
      ))}
    </div>
  );
}
