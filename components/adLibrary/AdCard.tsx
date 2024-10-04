import React, { useState } from "react";
import Image from "next/image";
import {
  ExternalLink,
  Facebook,
  Flame,
  Heart,
  Info,
  Instagram,
  MessageCircle,
  Play,
  TrendingUp,
} from "lucide-react";

import { AdData } from "@/types/ad";

import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
//import { AdDetails } from "./AdDetails";
import { SaveAdButton } from "./adCollections/SaveAdButton";
import DisplayPixelPlatformPayment from "./microComponents/DisplayPixelPlatformPayment";
import ExpandableText from "./microComponents/expandableText";
import PageNameWithPopover from "./PageNameWithPopover";

interface AdCardProps {
  ad: AdData;
  compact?: boolean;
}

export const AdCard: React.FC<AdCardProps> = ({ ad, compact = false }) => {
  const {
    ad_archive_id,
    start_date,
    end_date,
    page_name,
    publisher_platform,
    is_active,
    snapshot,
  } = ad;
  const [showAdDetails, setShowAdDetails] = useState(false);

  const [playingVideo, setPlayingVideo] = useState<number | null>(null);

  const formatDate = (timestamp: number | undefined) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const renderMedia = () => {
    if (!snapshot) return null;

    const mediaItems = [
      ...(snapshot.cards || []),
      ...(snapshot.images || []),
      ...(snapshot.videos || []),
    ];

    if (mediaItems.length > 0) {
      return (
        <Carousel className="w-full rounded-lg bg-gray-50 dark:bg-gray-800">
          <CarouselContent>
            {mediaItems.map((item, index) => (
              <CarouselItem key={index}>
                <div className="relative aspect-video w-full overflow-hidden rounded-md">
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
              </CarouselItem>
            ))}
          </CarouselContent>
          {mediaItems.length > 1 && (
            <>
              <CarouselPrevious />
              <CarouselNext />
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
      audience_network: (
        <Image
          src="/icons/audience_network_facebook.svg"
          alt="Audience Network Facebook"
          width={24}
          height={24}
          className="h-5 w-5 "
        />
      ),
    };

    return publisher_platform?.map((platform) => (
      <span key={platform} className="mr-1 cursor-pointer" title={platform}>
        {icons[platform.toLowerCase()] || <></>}
      </span>
    ));
  };

  const renderDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const startDateObj = start_date ? new Date(start_date * 1000) : null;
    const endDateObj = end_date ? new Date(end_date * 1000) : null;

    if (!startDateObj || !endDateObj) {
      return "N/A";
    }

    if (endDateObj < startDateObj || endDateObj >= yesterday) {
      return `Started on ${formatDate(start_date)}`;
    }

    return `${formatDate(start_date)} - ${formatDate(end_date)}`;
  };

  return (
    <Card className="w-full max-w-sm overflow-hidden shadow-lg">
      <CardContent className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-xs text-gray-500">ID: {ad_archive_id}</div>
          <div className="flex space-x-2">
            {/* <SaveAdButton ad={ad} /> */}
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="hover:text-red-500">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold">{snapshot?.title}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {snapshot?.caption}
          </p>
        </div>

        <div className="mb-4 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              {is_active ? "Active" : "Inactive"}
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              {renderDate()}
            </span>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-gray-600 dark:text-gray-400">
              Platforms:
            </span>
            {renderPlatformIcons()}
          </div>
        </div>

        {renderMedia()}

        <div className="mt-4">
          <PageNameWithPopover snapshot={snapshot} />
          {snapshot?.body?.text && (
            <ExpandableText text={snapshot.body.text} maxLength={100} />
          )}
        </div>

        {ad.is_aaa_eligible && (
          <div className="mt-2 flex items-center text-xs text-gray-600 dark:text-gray-400">
            <Image
              src="/icons/europe.png"
              alt="EU"
              width={16}
              height={16}
              className="mr-1"
            />
            <span>EU transparency</span>
            <Info className="ml-1 h-3 w-3 cursor-help" />
          </div>
        )}
      </CardContent>

      <CardFooter className="bg-gray-50 p-4 dark:bg-gray-800">
        <DisplayPixelPlatformPayment
          url={snapshot?.link_url || undefined}
          usePuppeteer={true}
          keepBrowserOpen={true}
          useCache={true}
          dynamicTimeout={1000}
          autoDetect={false}
        />
        {ad.collation_count && ad.collation_count > 0 && (
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
                  {ad.collation_count || 0}
                </span>
                {ad.collation_count > 5 && (
                  <Flame className="h-6 w-6 animate-pulse text-yellow-300" />
                )}
              </div>
            </div>
          </div>
        )}

        {ad.is_aaa_eligible && (
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
              alt={page_name || "Page profile"}
              width={40}
              height={40}
              className="mr-2 rounded-full"
            />
          )}

          <div>
            <PageNameWithPopover snapshot={snapshot} />
          </div>
        </div>

        {snapshot?.body?.text &&
          snapshot?.body?.text !== "&#123;&#123;product.brand&#125;&#125;" && (
            <div className=" text-xs">
              <ExpandableText text={snapshot.body.text || ""} maxLength={50} />
            </div>
          )}

        {renderMedia()}
      </CardFooter>
      <CardFooter>
        {snapshot?.link_url && (
          <a
            href={snapshot.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block w-full rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
          >
            {snapshot.cta_text || "Learn More"}
          </a>
        )}
      </CardFooter>
      {/* {showAdDetails && (
        <AdDetails ad={ad} onClose={() => setShowAdDetails(false)} />
      )} */}
    </Card>
  );
};
