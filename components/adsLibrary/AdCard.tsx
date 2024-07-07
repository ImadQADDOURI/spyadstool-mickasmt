// components/adsLibrary/AdCard.tsx

import React from "react";
import Image from "next/image";
import {
  ExternalLink,
  Facebook,
  Globe,
  Info,
  Instagram,
  MessageCircle,
  Play,
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
                        <Image
                          src={item.video_preview_image_url}
                          alt={`Video preview ${index + 1}`}
                          layout="fill"
                          objectFit="cover"
                        />
                        <Play className="absolute inset-0 m-auto h-12 w-12 text-white opacity-75" />
                      </>
                    )}
                  {"title" in item && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 text-white">
                      <p className="text-sm font-bold">{item.title}</p>
                      <p className="text-xs">{item.body}</p>
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
      <span key={platform} className="mr-1" title={platform}>
        {icons[platform.toLowerCase()] || <Globe className="h-4 w-4" />}
      </span>
    ));
  };

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
          <div>Library ID: {adArchiveID || "N/A"}</div>
          <Button variant="ghost" size="sm">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
        <div className="mb-2 flex items-center text-xs text-gray-500">
          <span
            className={`mr-2 inline-flex items-center rounded-full px-2 py-1 font-semibold ${isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>
        <div className="mb-2 flex items-center text-xs text-gray-500">
          <span>
            {formatDate(startDate)} - {formatDate(endDate)}
          </span>
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
          <Info className="h-4 w-4" />
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
            <h3 className="font-bold">{pageName || "Unknown Page"}</h3>
            <p className="text-xs text-gray-500">Sponsored</p>
          </div>
        </div>

        {renderMedia()}

        {snapshot?.body?.markup && (
          <div
            dangerouslySetInnerHTML={{
              __html: snapshot.body.markup.__html || "",
            }}
            className="mb-4 text-sm"
          />
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
