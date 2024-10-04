import React from "react";

import { AdData } from "@/types/ad";

import { AdPreviewCard } from "./AdPreviewCard";

interface AdPreviewCardGridProps {
  ads: AdData[];
}

export const AdPreviewCardGrid: React.FC<AdPreviewCardGridProps> = ({
  ads,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
      {ads.map((ad) => (
        //ad.collation_count && // to display only ads with collationCount > 0
        <AdPreviewCard key={ad.ad_archive_id} ad={ad} />
      ))}
    </div>
  );
};

export default AdPreviewCardGrid;
