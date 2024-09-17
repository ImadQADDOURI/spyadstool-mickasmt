// components/adsLibrary/AdCard.tsx
import React, { useState } from "react";
import Image from "next/image";
import parse from "html-react-parser";
import {
  BadgeCheck,
  BadgeMinus,
  ExternalLink,
  Facebook,
  Flame,
  Globe,
  Heart,
  Info,
  Instagram,
  MessageCircle,
  Play,
  ThumbsUp,
  TrendingUp,
} from "lucide-react";

import { Ad, MediaItem } from "@/types/ad";
import AudienceNetworkIcon from "@/components/shared/AudienceNetworkIcon";

import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { AdDetails } from "./AdDetails";
import { SaveAdButton } from "./AdsCollections/SaveAdButton";
import DisplayPixelPlatformPayment from "./DisplayPixelPlatformPayment";
import ExpandableText from "./expandableText";
import PageNameWithPopover from "./PageNameWithPopover";
import TrackingPixelDetector from "./TrackingPixelDetector";

interface AdCardProps {
  ad: Ad;
  compact?: boolean;
}

type Snapshot = Ad["snapshot"];

export const AdCard: React.FC<AdCardProps> = ({ ad, compact = false }) => {
  const {
    adArchiveID,
    startDate,
    endDate,
    pageName,
    publisherPlatform,
    isActive,
    snapshot,
  } = ad;

  const [showAdDetails, setShowAdDetails] = useState(false);

  const formatDate = (timestamp: number | undefined) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);

  const renderMedia = () => {
    if (!snapshot) return null;

    const cards = snapshot.cards ?? [];
    const images = snapshot.images ?? [];
    const videos = snapshot.videos ?? [];

    const mediaItems: MediaItem[] = [...cards, ...images, ...videos];

    if (mediaItems.length > 0) {
      return (
        <Carousel className="w-full rounded-3xl bg-gray-50 dark:bg-gray-800">
          <CarouselContent>
            {mediaItems.map((item, index) => (
              <CarouselItem key={index}>
                <div className="flex flex-col">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md">
                    {item.resized_image_url && (
                      <Image
                        src={item.resized_image_url}
                        alt={item.title || `Ad image ${index + 1}`}
                        layout="fill"
                        objectFit="cover"
                      />
                    )}
                    {item.video_preview_image_url && (
                      <>
                        {playingVideo === index ? (
                          <video
                            src={item.video_sd_url || undefined}
                            controls
                            autoPlay
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <>
                            <Image
                              src={item.video_preview_image_url}
                              alt={`Video preview ${index + 1}`}
                              layout="fill"
                              objectFit="cover"
                            />
                            <Play
                              className="absolute inset-0 m-auto h-12 w-12 cursor-pointer text-white opacity-80 hover:opacity-100"
                              onClick={() => setPlayingVideo(index)}
                            />
                          </>
                        )}
                      </>
                    )}
                  </div>
                  <div className="flex flex-col items-center justify-center p-2">
                    <div>
                      {item.title && (
                        <>
                          <p className="text-sm font-bold">{item.title}</p>

                          {item.body && (
                            <ExpandableText text={item.body} maxLength={25} />
                          )}
                        </>
                      )}
                    </div>
                    <div>
                      {item.link_url && (
                        <button className="group relative mt-1 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-red-100 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:text-white dark:hover:text-gray-900 dark:focus:ring-red-400">
                          <span className="relative rounded-md bg-white px-5 py-1 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900">
                            <a
                              href={item.link_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {item.cta_text || "Learn More"}
                            </a>
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {mediaItems.length > 1 && (
            <>
              <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 p-0" />
              <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 p-0" />
            </>
          )}
        </Carousel>
      );
    }
    return null;
  };

  const renderPlatformIcons = () => {
    const icons: { [key: string]: React.ReactNode } = {
      facebook: <Facebook className="h-5 w-5" color="#0866FF" />,
      instagram: <Instagram className="h-5 w-5" color="#D915DA" />,
      messenger: <MessageCircle className="h-5 w-5" color="#0084FF" />,
      audience_network: <AudienceNetworkIcon className="h-5 w-5" />,
    };

    return publisherPlatform?.map((platform) => (
      <span key={platform} className="mr-1 cursor-pointer" title={platform}>
        {icons[platform.toLowerCase()] || <></>}
      </span>
    ));
  };
  // const renderDate = () => {
  //   if (endDate && startDate && endDate <= startDate) {
  //     return `Started on ${formatDate(startDate)}`;
  //   }
  //   return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  // };

  const renderDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const startDateObj = startDate ? new Date(startDate * 1000) : null;
    const endDateObj = endDate ? new Date(endDate * 1000) : null;

    if (!startDateObj || !endDateObj) {
      return "N/A";
    }

    if (endDateObj < startDateObj || endDateObj >= yesterday) {
      return `Started on ${formatDate(startDate)}`;
    }

    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  if (compact) {
    const imageUrl =
      snapshot.cards?.[0]?.resized_image_url ||
      snapshot.cards?.[0]?.video_preview_image_url ||
      snapshot.images?.[0]?.resized_image_url ||
      snapshot.videos?.[0]?.video_preview_image_url ||
      "";

    return (
      <div className="relative h-24 w-24 overflow-hidden rounded-lg shadow-md">
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Ad thumbnail"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 flex flex-col justify-end bg-black bg-opacity-50 p-1">
          <p>
            {isActive ? (
              <BadgeCheck className="h-4 w-4 text-white" />
            ) : (
              <BadgeMinus className="h-4 w-4 text-white" />
            )}
          </p>{" "}
          <p className="truncate text-sm font-semibold text-white">
            {adArchiveID}
          </p>
          <p className="text-sm text-white">{renderDate()}</p>
        </div>
      </div>
    );
  }
  // return (
  // <div className="h-ful relative w-full overflow-hidden rounded-lg shadow-md">
  //   {renderMedia()}
  //   <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 text-white">
  //     <p className="text-xs">{ad.adArchiveID}</p>
  //     <p className="text-xs">{renderDate()}</p>
  //   </div>
  // </div>
  // <div className="group relative w-full overflow-hidden rounded-lg pb-[100%] shadow-md">
  //   {renderMedia()}
  //   <div className="absolute inset-0 flex flex-col justify-end bg-black bg-opacity-50 p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
  //     <p className="truncate text-xs font-semibold text-white">
  //       ID: {adArchiveID}
  //     </p>
  //     <p className="text-xs text-white">{renderDate()}</p>
  //   </div>
  // </div>

  //   );
  // }

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-4">
        <div className="mb-2 flex  justify-between text-sm text-gray-700 dark:text-gray-100">
          <div>Library ID: {adArchiveID || "N/A"}</div>
          <SaveAdButton ad={ad} />
          <div className="m-0 flex flex-row">
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="hover:text-red-500">
              <Heart className="h-4 w-4 " />
            </Button>
          </div>
        </div>

        <div className="mb-2 flex items-center text-sm text-gray-700 dark:text-gray-100">
          <span
            className={`mr-2 inline-flex items-center rounded-full px-2 py-1 font-semibold ${isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>

        <div>
          <h1> {ad?.snapshot.title}</h1>
        </div>
        <div>
          <h1> {ad?.snapshot.caption} </h1>
        </div>

        <div className="mb-2 flex items-center text-sm text-gray-700 dark:text-gray-100">
          <span>{renderDate()}</span>
        </div>

        <div className="mb-2 flex items-center text-sm text-gray-700 dark:text-gray-100">
          <span className="mr-2">Platforms</span>
          {renderPlatformIcons()}
        </div>

        {/* <div className="mb-2 flex items-center text-sm text-gray-700 dark:text-gray-100">
          <span className="mr-2">Pixels</span>
          <TrackingPixelDetector
            url={snapshot.link_url}
            usePuppeteer={true}
            autoDetect={false} // prop to control automatic detection
          />
        </div> */}

        <div className="mb-2 flex items-center text-sm text-gray-700 dark:text-gray-100">
          <DisplayPixelPlatformPayment
            url={snapshot.link_url || undefined}
            usePuppeteer={true}
            keepBrowserOpen={true}
            useCache={true}
            dynamicTimeout={1000}
            autoDetect={false}
          />
        </div>

        {ad.collationCount && ad.collationCount > 0 && (
          <div className="relative mb-4 transform overflow-hidden rounded-lg transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-90"></div>
            <div className="relative flex items-center justify-between px-4 py-2">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-6 w-6 text-white drop-shadow-sm" />
                <span className="text-lg font-bold text-white drop-shadow">
                  ADs
                </span>
              </div>
              <div className="flex items-center space-x-2 ">
                <span className="text-2xl font-extrabold text-white drop-shadow-md ">
                  {ad.collationCount || 0}
                </span>
                {ad.collationCount > 5 && (
                  <Flame className="h-6 w-6 animate-pulse text-yellow-300" />
                )}
              </div>
            </div>
          </div>
        )}
        {/* {ad.collationCount && ad.collationCount > 0 && (
          <div className="relative mb-4 transform overflow-hidden rounded-lg transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-90"></div>
            <div className="relative flex items-center justify-between px-4 py-2">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-6 w-6 text-white drop-shadow-sm" />
                <span className="text-lg font-bold text-white drop-shadow">
                  ADs
                </span>
              </div>
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-2xl font-extrabold text-white drop-shadow-md">
                {ad.collationCount || 0}
              </span>
              {ad.collationCount > 5 && (
                <Flame className="h-6 w-6 animate-pulse text-yellow-300" />
              )}
            </div>
          </div>
        )} */}

        {ad.isAAAEligible && (
          <div className="mb-2 flex items-center text-sm text-gray-700 dark:text-gray-100">
            <Image
              src={"/icons/europe.png"}
              alt={``}
              width={24}
              height={24}
              className="mr-2"
            />
            <span className="mr-2">{` EU transparency`} </span>

            <span title="Additional information for ads that were shown in EU. Click See ad details">
              <Info className="h-4 w-4 cursor-pointer" />
            </span>
          </div>
        )}

        <button
          className="group relative mb-2 inline-flex w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 group-hover:from-purple-600 group-hover:to-blue-500 dark:text-white dark:focus:ring-blue-800"
          onClick={() => setShowAdDetails(true)}
        >
          <span className="relative w-full rounded-md bg-white px-5 py-2 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900">
            See ad details
          </span>
        </button>

        <div className="mb-2 flex items-center">
          {snapshot?.page_profile_picture_url && (
            <Image
              src={snapshot.page_profile_picture_url}
              alt={pageName || "Page profile"}
              width={40}
              height={40}
              className="mr-2 rounded-full"
            />
          )}

          <div>
            <PageNameWithPopover snapshot={snapshot as Snapshot} />
          </div>
        </div>

        {snapshot?.body?.markup &&
          snapshot?.body?.markup.__html !==
            "&#123;&#123;product.brand&#125;&#125;" && (
            <div className=" text-xs">
              <ExpandableText
                text={snapshot.body.markup.__html || ""}
                maxLength={50}
              />
            </div>
          )}

        {renderMedia()}
      </CardContent>
      <CardFooter>
        {snapshot?.link_url && (
          <button className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-purple-200 group-hover:from-purple-500 group-hover:to-pink-500 dark:text-white dark:focus:ring-purple-800">
            <span className="relative w-full rounded-md bg-white px-5 py-2 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900">
              <a
                href={snapshot.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
              >
                {snapshot.cta_text || "Learn More"}
              </a>
            </span>
          </button>
        )}
      </CardFooter>
      {showAdDetails && (
        <AdDetails ad={ad} onClose={() => setShowAdDetails(false)} />
      )}
    </Card>
  );
};
