// components/adsLibrary/AdCard.tsx

import React from "react";
import Image from "next/image";

import { Ad } from "@/types/ad";

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
    collationCount,
    startDate,
    endDate,
    pageName,
    publisherPlatform,
    isActive,
    snapshot,
  } = ad;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const renderMedia = () => {
    if (!snapshot) {
      console.error("Snapshot is null or undefined", snapshot);
      return null;
    }

    const cards = snapshot.cards ?? [];
    const images = snapshot.images ?? [];
    const videos = snapshot.videos ?? [];

    if (cards.length > 0 || images.length > 0 || videos.length > 0) {
      return (
        <Carousel>
          <CarouselContent>
            {cards.map((card, index) => (
              <CarouselItem key={`card-${index}`}>
                {card.resized_image_url ? (
                  <Image
                    src={card.resized_image_url}
                    alt={card.title}
                    width={300}
                    height={200}
                  />
                ) : (
                  <p>{" 🖼️ "}</p>
                )}
              </CarouselItem>
            ))}
            {images.map((image, index) => (
              <CarouselItem key={`image-${index}`}>
                <Image
                  src={image.resized_image_url}
                  alt="Ad image"
                  width={300}
                  height={200}
                />
              </CarouselItem>
            ))}
            {videos.map((video, index) => (
              <CarouselItem key={`video-${index}`}>
                <Image
                  src={video.video_preview_image_url}
                  alt="Video preview"
                  width={300}
                  height={200}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      );
    }
    return null;
  };

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-4">
        <div className="mb-4 flex items-center">
          {snapshot?.page_profile_picture_url ? (
            <Image
              src={snapshot.page_profile_picture_url}
              alt={pageName}
              width={40}
              height={40}
              className="mr-2 rounded-full"
            />
          ) : (
            <div className="mr-2 h-10 w-10 rounded-full bg-gray-200" />
          )}
          <div>
            <h3 className="font-bold">{pageName || "Unknown Page"}</h3>
            <p className="text-sm text-gray-500">Sponsored</p>
          </div>
        </div>
        {snapshot?.body?.markup ? (
          <div
            dangerouslySetInnerHTML={snapshot.body.markup}
            className="mb-4"
          />
        ) : (
          <p className="text-gray-500">No ad content available</p>
        )}
        {renderMedia()}
      </CardContent>
      <CardFooter className="flex flex-wrap justify-between text-sm text-gray-500">
        <div>ID: {adArchiveID}</div>
        <div>
          {" "}
          <p>Ads: {collationCount}</p>{" "}
        </div>
        <div>
          {startDate && endDate
            ? `${formatDate(startDate)} - ${formatDate(endDate)}`
            : "Date range not available"}
        </div>
        <div>Platforms: {publisherPlatform?.join(", ") || "Not specified"}</div>
        <div>
          Status:{" "}
          {isActive !== undefined
            ? isActive
              ? "Active"
              : "Inactive"
            : "Unknown"}
        </div>
      </CardFooter>
    </Card>
  );
};
