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

import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
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
        <Carousel className="w-full">
          <CarouselContent>
            {mediaItems.map((item, index) => (
              <CarouselItem key={index}>
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
                  {"title" in item && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 text-white">
                      <p className="text-xs font-bold">{item.title}</p>
                      <p className="text-xs">
                        {item.body && (
                          <ExpandableText
                            text={item.body || ""}
                            maxLength={15}
                          />
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {mediaItems.length > 1 && (
            <>
              <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
              <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
            </>
          )}
        </Carousel>
      );
    }
    return null;
  };

  const renderPlatformIcons = () => {
    const icons: { [key: string]: React.ReactNode } = {
      facebook: <Facebook className="h-4 w-4" />,
      instagram: <Instagram className="h-4 w-4" />,
      messenger: <MessageCircle className="h-4 w-4" />,
      audience_network: <Globe className="h-4 w-4" />,
    };

    return publisherPlatform?.map((platform) => (
      <span key={platform} className="mr-1 cursor-pointer" title={platform}>
        {icons[platform.toLowerCase()] || <></>}
      </span>
    ));
  };
  const renderDate = () => {
    if (endDate && startDate && endDate <= startDate) {
      return `Started on ${formatDate(startDate)}`;
    }
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-4">
        <div className="mb-2 flex  justify-between text-xs text-gray-500">
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

        <div className="mb-2 flex items-center text-xs text-gray-500">
          <span
            className={`mr-2 inline-flex items-center rounded-full px-2 py-1 font-semibold ${isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="mb-2 flex items-center text-xs text-gray-500">
          <span>{renderDate()}</span>
        </div>

        <div className="mb-2 flex items-center text-xs text-gray-500">
          <span className="mr-2">Platforms</span>
          {renderPlatformIcons()}
        </div>

        <div className="mb-2 flex items-center text-xs text-gray-500">
          <span className="mr-2">ADs</span>
          <span className="mr-2 text-lg font-bold text-red-600">
            {ad.collationCount || 0}
          </span>
          <span title="ads use this creative and text">
            <Info className="h-4 w-4 cursor-pointer" />
          </span>
        </div>

        <Button variant="secondary" size="sm" className="mb-4 w-full">
          See ad details
        </Button>

        <div className="mb-4 flex items-center">
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
            {/* <h3 className="font-bold">{pageName || "Unknown Page"}</h3>
            <p className="text-xs text-gray-500">Sponsored</p> */}
            <PageNameWithPopover snapshot={ad.snapshot} />
          </div>
        </div>

        {renderMedia()}

        {snapshot?.body?.markup &&
          snapshot?.body?.markup.__html !==
            "&#123;&#123;product.brand&#125;&#125;" && (
            <div className="my-4 text-xs">
              <ExpandableText
                text={snapshot.body.markup.__html || ""}
                maxLength={50}
              />
            </div>
          )}
      </CardContent>
      <CardFooter>
        {snapshot?.link_url && (
          <Button size="sm" className="w-full">
            <a
              href={snapshot.link_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {snapshot.cta_text || "Learn More"}
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
