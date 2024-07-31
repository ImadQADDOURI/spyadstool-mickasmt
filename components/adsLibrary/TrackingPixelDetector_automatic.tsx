// app/components/adsLibrary/TrackingPixelDetector.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AlertCircle, Loader2, XCircle } from "lucide-react";

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
  const [shouldDetect, setShouldDetect] = useState(false);

  const detectPixels = useCallback(async () => {
    if (!url) return;

    setIsLoading(true);
    setError(null);

    try {
      const pixels = await detectTrackingPixels(url, usePuppeteer);
      setDetectedPixels(pixels);
    } catch (err) {
      console.error("Failed to detect pixels:", err);
      setError(
        err instanceof Error ? err.message : "Failed to analyze the website",
      );
    } finally {
      setIsLoading(false);
    }
  }, [url, usePuppeteer]);

  useEffect(() => {
    if (!shouldDetect) return;

    const idleCallback = requestIdleCallback(
      () => {
        detectPixels();
      },
      { timeout: 5000 },
    ); // Set a 5-second timeout

    return () => cancelIdleCallback(idleCallback);
  }, [shouldDetect, detectPixels]);

  useEffect(() => {
    // Reset states when URL changes
    setDetectedPixels([]);
    setIsLoading(false);
    setError(null);

    // Schedule the detection to run after a short delay
    const timer = setTimeout(() => {
      setShouldDetect(true);
    }, 100);

    return () => {
      clearTimeout(timer);
      setShouldDetect(false);
    };
  }, [url]);

  if (!shouldDetect) {
    return null; // Don't render anything until we're ready to detect
  }

  if (isLoading) {
    return <Loader2 className="animate-spin" />;
  }

  if (error) {
    return (
      <div className="flex items-center text-red-500">
        <AlertCircle className="mr-2 h-4 w-4" />
        <span>{error}</span>
      </div>
    );
  }

  if (detectedPixels.length === 0) {
    return (
      <div className="flex items-center text-gray-500">
        <XCircle className="mr-2 h-4 w-4 " />
        <span>No pixels detected</span>
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-2">
      {detectedPixels.map((pixel, index) => (
        <div key={index} title={pixel} className="h-6 w-6">
          {pixelIcons[pixel] ? (
            <Image src={pixelIcons[pixel]} alt={pixel} width={24} height={24} />
          ) : (
            pixel
          )}
        </div>
      ))}
    </div>
  );
}
