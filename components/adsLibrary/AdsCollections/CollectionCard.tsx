// components/adsLibrary/AdsCollections/CollectionCard.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Clock, Image } from "lucide-react";

import { formatTimeAgo } from "@/lib/formatTimeAgo";
import { Card, CardContent } from "@/components/ui/card";
import { CollectionOptions } from "@/components/adsLibrary/AdsCollections/CollectionOptions";

interface Collection {
  id: string;
  name: string;
  updatedAt: string;
  savedAdsCount: number;
  firstAdImageUrl?: string | null;
  lastSavedAt: string;
}

interface CollectionCardProps {
  collection: Collection;
  onEdit: (collection: Collection) => void;
  onDelete: (collectionId: string) => void;
  onMove: (collectionId: string) => void;
}

export function CollectionCard({
  collection,
  onEdit,
  onDelete,
  onMove,
}: CollectionCardProps) {
  return (
    <Card className="group relative flex h-full transform flex-col overflow-hidden rounded-2xl bg-white transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl dark:bg-gray-800">
      <Link
        href={`/dashboard/collections/${collection.id}`}
        className="absolute inset-0 z-10"
      >
        <span className="sr-only">View collection</span>
      </Link>
      <CardContent className="flex h-full flex-col p-0">
        <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
          {collection.firstAdImageUrl ? (
            <img
              src={collection.firstAdImageUrl}
              alt={`First ad in ${collection.name}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Image className="h-16 w-16 text-gray-400" />
            </div>
          )}
          <div className="absolute right-2 top-2 z-20">
            <CollectionOptions
              collection={collection}
              onEdit={onEdit}
              onDelete={onDelete}
              onMove={onMove}
            />
          </div>
        </div>
        <div className="flex flex-grow flex-col justify-between p-6">
          <h2 className="mb-2 line-clamp-2 text-xl font-bold text-gray-800 dark:text-gray-200">
            {collection.name}
          </h2>
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>{collection.savedAdsCount} ads</span>
            <span className="flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              {formatTimeAgo(collection.lastSavedAt)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
