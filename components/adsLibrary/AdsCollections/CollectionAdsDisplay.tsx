// components/adsLibrary/AdsCollections/CollectionAdsDisplay.tsx
"use client";

import React from "react";

import { formatTimeAgo } from "@/lib/formatTimeAgo";
import { AdsList } from "@/components/adsLibrary/AdsList";

import { ScrollButtons } from "../ScrollButtons";

interface Collection {
  id: string;
  name: string;
  updatedAt: string;
  savedAdsCount: number;
  savedAds: {
    id: string;
    adData: any;
  }[];
}

interface CollectionAdsDisplayProps {
  collection: Collection;
}

export function CollectionAdsDisplay({
  collection,
}: CollectionAdsDisplayProps) {
  const ads = collection.savedAds.map((savedAd) => savedAd.adData);

  return (
    <div className="container mx-auto min-h-screen bg-gray-100 px-4 py-12 dark:bg-gray-900">
      <div className="mb-8">
        <h1 className="mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-3xl font-bold text-transparent">
          {collection.name}
        </h1>
        <div className="text-md flex items-center justify-between text-gray-600 dark:text-gray-400">
          <span>{collection.savedAdsCount} ads in this collection</span>
          <span>Last updated: {formatTimeAgo(collection.updatedAt)}</span>
        </div>
      </div>

      {ads.length > 0 ? (
        <AdsList ads={ads} />
      ) : (
        <div className="mt-16 text-center text-gray-600 dark:text-gray-400">
          No ads in this collection yet. Start saving ads to see them here!
        </div>
      )}

      <ScrollButtons />
    </div>
  );
}
