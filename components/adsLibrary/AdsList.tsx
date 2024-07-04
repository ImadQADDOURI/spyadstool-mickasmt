// components/adsLibrary/AdsList.tsx

import React from "react";

import { Ad } from "@/types/ad";

import { AdCard } from "./AdCard";

interface AdsListProps {
  ads: Ad[];
}

export const AdsList: React.FC<AdsListProps> = ({ ads }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
      {ads.map((ad) => (
        <AdCard key={ad.adArchiveID} ad={ad} />
      ))}
    </div>
  );
};
