// components/CollectionAdsDisplay.tsx
import React from 'react';
import { AdsList } from '@/components/adsLibrary/AdsList';
import { Ad } from '@/types/ad';
import { ScrollButtons } from '../ScrollButtons';

interface CollectionAdsProps {
  collectionName: string;
  collectionId: string;
  ads: Ad[];
  adCount: number;
  lastUpdated: string;
}

export function CollectionAdsDisplay({ collectionName, collectionId, ads, adCount, lastUpdated }: CollectionAdsProps) {
  return (
    <div className="container mx-auto min-h-screen bg-gray-100 px-4 py-12 dark:bg-gray-900">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          {collectionName}
        </h1>
        <div className="flex justify-between items-center text-md text-gray-600 dark:text-gray-400">
          <span>{adCount} ads in this collection</span>
          <span>Last updated: {lastUpdated}</span>
        </div>
      </div>
      
      {ads.length > 0 ? (
        <AdsList ads={ads} />
      ) : (
        <div className="text-center text-gray-600 dark:text-gray-400 mt-16">
          No ads in this collection yet. Start saving ads to see them here!
        </div>
      )}
      
        {/* Scroll buttons */}
        <ScrollButtons />
    </div>
  );
}