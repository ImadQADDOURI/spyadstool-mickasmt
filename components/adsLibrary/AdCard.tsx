// components/adsLibrary/AdCard.tsx
import React, { useState } from "react";
import Image from "next/image";
import {
  ExternalLink,
  Facebook,
  Globe,
  Heart,
  Info,
  Instagram,
  MessageCircle,
  Play,
  ThumbsUp,
} from "lucide-react";

import { Ad } from "@/types/ad";
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
import ExpandableText from "./expandableText";
import PageNameWithPopover from "./PageNameWithPopover";

interface AdCardProps {
  ad: Ad;
}

export const AdCard: React.FC<AdCardProps> = ({ ad }) => {
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

    const mediaItems = [...cards, ...images, ...videos];

    if (mediaItems.length > 0) {
      return (
        <Carousel className="w-full rounded-3xl bg-gray-50  dark:bg-gray-800">
          <CarouselContent>
            {mediaItems.map((item, index) => (
              <CarouselItem key={index}>
                <div className="flex flex-col">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md">
                    {"resized_image_url" in item && item.resized_image_url && (
                      <Image
                        src={item.resized_image_url}
                        alt={item.title || `Ad image ${index + 1}`}
                        layout="fill"
                        objectFit="cover"
                      />
                    )}
                    {"video_preview_image_url" in item &&
                      item.video_preview_image_url && (
                        <>
                          {playingVideo === index ? (
                            <video
                              src={item.video_sd_url}
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
                      {" "}
                      {"title" in item && (
                        <>
                          <p className="text-sm font-bold">{item.title}</p>
                          <p className="text-xs">
                            {item.body && (
                              <ExpandableText
                                text={item.body || ""}
                                maxLength={15}
                              />
                            )}
                          </p>
                        </>
                      )}
                    </div>
                    <div>
                      <>
                        {"link_url" in item && item.link_url && (
                          <button className="group relative mt-1 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-red-100 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:text-white dark:hover:text-gray-900 dark:focus:ring-red-400">
                            <span className="relative rounded-md bg-white px-5 py-1 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900">
                              <a
                                href={item.link_url + ""}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {item.cta_text || "Learn More"}
                              </a>
                            </span>
                          </button>
                        )}
                      </>
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
      facebook: <Facebook className="h-4 w-4" color="#0866FF" />,
      instagram: <Instagram className="h-4 w-4" color="#D915DA" />,
      messenger: <MessageCircle className="h-4 w-4" color="#0084FF" />,
      audience_network: <AudienceNetworkIcon className="h-4 w-4" />,
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

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-4">
        <div className="mb-2 flex  justify-between text-xs text-gray-700 dark:text-gray-100">
          <div>Library ID: {adArchiveID || "N/A"}</div>
          <div className="m-0 flex flex-row">
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="hover:text-red-500">
              <Heart className="h-4 w-4 " />
            </Button>
          </div>
        </div>

        <div className="mb-2 flex items-center text-xs text-gray-700 dark:text-gray-100">
          <span
            className={`mr-2 inline-flex items-center rounded-full px-2 py-1 font-semibold ${isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="mb-2 flex items-center text-xs text-gray-700 dark:text-gray-100">
          <span>{renderDate()}</span>
        </div>

        <div className="mb-2 flex items-center text-xs text-gray-700 dark:text-gray-100">
          <span className="mr-2">Platforms</span>
          {renderPlatformIcons()}
        </div>

        <div className="mb-2 flex items-center text-xs text-gray-700 dark:text-gray-100">
          <span className="mr-2">ADs</span>
          <span className="mr-2 text-lg font-bold text-red-600">
            {ad.collationCount || 0}
          </span>
          <span title="ads use this creative and text">
            <Info className="h-4 w-4 cursor-pointer" />
          </span>
        </div>

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
            <PageNameWithPopover snapshot={ad.snapshot} />
          </div>
        </div>

        {renderMedia()}

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
