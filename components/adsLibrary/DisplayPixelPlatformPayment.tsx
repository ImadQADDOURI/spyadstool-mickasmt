// app/components/adsLibrary/DisplayPixelPlatformPayment.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AlertCircle,
  FileQuestion,
  FileScan,
  FileWarning,
  Info,
  Loader2,
  Search,
  XCircle,
} from "lucide-react";

import {
  isNonTrackableWebsite,
  paymentDetectors,
  platformDetectors,
  trackingPixelDetectors,
} from "@/lib/Scrape_Detectorpatterns_NonTrackableWebsites";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { detectPixelPlatformPayment } from "@/app/actions/detectPixelPlatformPayment";

interface TrackingDetectorProps {
  url?: string | undefined;
  usePuppeteer?: boolean;
  keepBrowserOpen?: boolean;
  useCache?: boolean;
  dynamicTimeout?: number;
  autoDetect?: boolean;
}

interface DetectionResult {
  pixels: string[];
  platforms: string[];
  payments: string[];
}

export default function DisplayPixelPlatformPayment({
  url,
  usePuppeteer,
  keepBrowserOpen,
  useCache,
  dynamicTimeout,
  autoDetect = false,
}: TrackingDetectorProps) {
  const [detectedFeatures, setDetectedFeatures] = useState<DetectionResult>({
    pixels: [],
    platforms: [],
    payments: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showButton, setShowButton] = useState(true);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (autoDetect && buttonRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            detectFeatures();
          }
        },
        { threshold: 1.0 },
      );

      observer.observe(buttonRef.current);

      return () => observer.disconnect();
    }
  }, [autoDetect, url]);

  const detectFeatures = async () => {
    if (!url) {
      console.log("No URL provided, exiting.");
      return;
    }

    if (isLoading) {
      console.log("Already loading, exiting.");
      return;
    }

    setIsLoading(true);
    setShowButton(false);
    try {
      const result = await detectPixelPlatformPayment(url);
      setDetectedFeatures(result);
      setError(null);
    } catch (err) {
      console.error("Detection failed:", err);
      setError(
        err instanceof Error ? err.message : "Failed to analyze the website",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (showButton) {
    return (
      <div className="mb-2 flex items-center text-sm text-gray-700 dark:text-gray-100">
        <span className="mr-2">Analyze Website</span>
        {url ? (
          isNonTrackableWebsite(url) ? (
            // Notify the user if non Trackable Websites

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center text-sm text-yellow-500">
                    <Info className="mr-1 h-5 w-5" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    This is a known platform where tracking is not applicable
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <button
              ref={buttonRef}
              onClick={detectFeatures}
              className="relative z-30 inline-flex items-center justify-center rounded-lg bg-gradient-to-br from-teal-300 to-lime-300 p-1 text-sm font-medium text-gray-900 transition-transform duration-300 hover:scale-105 hover:text-white focus:outline-none focus:ring-4 focus:ring-lime-200"
            >
              <span title="Analyze the Pixels Frameworks & Payments used in the website">
                <FileScan className="h-5 w-5" />
              </span>
            </button>
          )
        ) : (
          // Notify the user if no URL is provided
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex items-center text-sm text-gray-500">
                  <FileWarning className="h-5 w-5" />
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>No URL to analyze</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing website...
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

  const renderFeatureSection = (title: string, features: string[]) => (
    <div className="mb-2 flex flex-row items-center">
      <span className="mr-2">{title}</span>
      {features.length === 0 ? (
        <div className="flex items-center text-gray-500">
          <XCircle className="h-4 w-4" />
        </div>
      ) : (
        <div className="flex flex-row gap-2">
          {features.map((featureName, index) => {
            const feature = [
              ...trackingPixelDetectors,
              ...platformDetectors,
              ...paymentDetectors,
            ].find((d) => d.name === featureName);
            return (
              <div key={index} className="group relative flex items-center">
                {feature && feature.icon ? (
                  <div className="relative">
                    <Image
                      src={feature.icon}
                      alt={featureName}
                      width={24}
                      height={24}
                      className="transition-transform group-hover:scale-110"
                    />
                    <span className=" absolute left-1/2 z-10 min-w-max -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                      {featureName}
                    </span>
                  </div>
                ) : (
                  <div className="mr-2 h-4 w-4 rounded-full bg-gray-200">
                    <span>{featureName}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div>
      {renderFeatureSection("Pixel", detectedFeatures.pixels)}
      {renderFeatureSection("Framework", detectedFeatures.platforms)}
      {renderFeatureSection("Payment", detectedFeatures.payments)}
    </div>
  );
}

// how to use DisplayPixelPlatformPayment

{
  /*
    import DisplayPixelPlatformPayment from "@/components/adsLibrary/DisplayPixelPlatformPayment";

export default function SomePage() {
  return (
    <div>
      <h1>Website Analysis</h1>
      <DisplayPixelPlatformPayment
        url="https://example.com"
        usePuppeteer={true}
        keepBrowserOpen={true}
        useCache={true}
        dynamicTimeout={2000}
        autoDetect={false}
      />
    </div>
  );
}
    */
}
