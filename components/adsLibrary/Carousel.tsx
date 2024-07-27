import { Ad } from "@/types/ad";

import { AdCard } from "./AdCard";

const Carousel: React.FC<{
  ads: Ad[];
  isLoading: boolean;
  error: string | null;
}> = ({ ads, isLoading, error }) => {
  // Implement a carousel or scrollable list of small ad previews
  return (
    <div className="h-[60vh] overflow-y-auto">
      {isLoading && ads.length === 0 && <p>Loading ad details...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {ads.map((detailedAd) => (
        <div key={detailedAd.adArchiveID} className="mb-2">
          <AdCard ad={detailedAd} />
        </div>
      ))}
    </div>
  );
};

export default Carousel;
