// app/components/adsLibrary/DisplayPixelPlatformPayment.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AlertCircle, Loader2, Search, XCircle } from "lucide-react";

import { detectPixelPlatformPayment } from "@/app/actions/detectPixelPlatformPayment";

interface TrackingDetectorProps {
  url?: string;
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

const icons: Record<string, string> = {
  // Pixels
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
  // Platforms
  Shopify: "/icons/shopify.svg",
  WooCommerce: "/icons/woocommerce.svg",
  Wix: "/icons/wix.svg",
  BigCommerce: "/icons/bigcommerce.svg",
  Magento: "/icons/magento.svg",
  PrestaShop: "/icons/prestashop.svg",
  OpenCart: "/icons/opencart.svg",
  Squarespace: "/icons/squarespace.svg",
  Shopware: "/icons/shopware.svg",
  YouCan: "/icons/youcan.png",
  Shoppy: "/icons/shoppy.svg",
  // Payments
  Stripe: "/icons/stripe.svg",
  PayPal: "/icons/paypal.svg",
  GooglePay: "/icons/googlepay.svg",
  ApplePay: "/icons/applepay.svg",
  AmazonPay: "/icons/amazonpay.svg",
  Square: "/icons/square.svg",
  Klarna: "/icons/klarna.svg",
  Affirm: "/icons/affirm.svg",
  Afterpay: "/icons/afterpay.svg",
  Venmo: "/icons/venmo.svg",
};

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
    if (!url) return;
    setIsLoading(true);
    setShowButton(false);
    try {
      const result = await detectPixelPlatformPayment(
        url,
        usePuppeteer,
        keepBrowserOpen,
        useCache,
        dynamicTimeout,
      );
      setDetectedFeatures(result);
      setError(null);
    } catch (err) {
      console.error("Failed to detect features:", err);
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
        ref={buttonRef}
        onClick={detectFeatures}
        className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-teal-300 to-lime-300 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-lime-200 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 dark:focus:ring-lime-800"
      >
        <span className="relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900">
          Analyze Website
        </span>
      </button>
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
          {features.map((feature, index) => (
            <div key={index} className="group relative flex items-center">
              {icons[feature] ? (
                <div className="relative">
                  <Image
                    src={icons[feature]}
                    alt={feature}
                    width={24}
                    height={24}
                    className="transition-transform group-hover:scale-110"
                  />
                  <span className="absolute -top-4 left-7 min-w-max -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                    {feature}
                  </span>
                </div>
              ) : (
                <div className="mr-2 h-4 w-4 rounded-full bg-gray-200">
                  <span>{feature}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="">
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
