// components/adsLibrary/Carousel.tsx
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Slider from "react-slick";

import { Ad } from "@/types/ad";

import { AdCard } from "./AdCard";

import "slick-carousel/slick/slick.css";

interface CarouselProps {
  ads: Ad[];
  isLoading: boolean;
  error: string | null;
  totalCount: number | null;
  isComplete: boolean;
  onLoadMore: () => void;
}

const PrevArrow = (props: any) => (
  <button
    {...props}
    className="absolute left-0 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-white p-2 shadow-md dark:bg-gray-800"
  >
    <ChevronLeft className="h-6 w-6 text-gray-600 dark:text-gray-400" />
  </button>
);

const NextArrow = (props: any) => (
  <button
    {...props}
    className="absolute right-0 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-white p-2 shadow-md dark:bg-gray-800"
  >
    <ChevronRight className="h-6 w-6 text-gray-600 dark:text-gray-400" />
  </button>
);

export const Carousel: React.FC<CarouselProps> = ({
  ads,
  isLoading,
  error,
  totalCount,
  isComplete,
  onLoadMore,
}) => {
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);

  const settings = {
    dots: false,
    infinite: false,
    speed: 4, // Increased speed for faster sliding
    slidesToShow: 5,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const handleAdClick = (ad: Ad) => {
    setSelectedAd(ad);
  };

  const closeAdDetails = () => {
    setSelectedAd(null);
  };

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex items-center justify-between rounded-lg bg-gray-100 p-3 dark:bg-gray-700">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {ads.length} of {totalCount || "?"} ads loaded
        </p>
        {!isComplete && (
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="rounded-md bg-blue-500 px-3 py-1 text-sm text-white transition-colors duration-300 hover:bg-blue-600"
          >
            {isLoading ? "Loading..." : "Load More"}
          </button>
        )}
      </div>

      <div className="relative">
        {isLoading && ads.length === 0 && (
          <p className="text-center text-gray-600 dark:text-gray-400">
            Loading ad details...
          </p>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}
        <div className="mx-8">
          <Slider {...settings}>
            {ads.map((ad) => (
              <div key={ad.adArchiveID} className="px-2">
                <button onClick={() => handleAdClick(ad)} className="w-full">
                  <AdCard ad={ad} compact={true} />
                </button>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {selectedAd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-800">
            <button
              onClick={closeAdDetails}
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-200">
              Ad Details
            </h2>
            <AdCard ad={selectedAd} compact={false} />
          </div>
        </div>
      )}
    </div>
  );
};
