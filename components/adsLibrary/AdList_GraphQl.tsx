import { AdGraphQL } from "@/types/ad";

import { AdCard_GraphQl } from "./AdCard_GraphQl";

interface AdsListProps {
  ads: AdGraphQL[];
}

export const AdList_GraphQl: React.FC<AdsListProps> = ({ ads }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
      {ads.map(
        (
          ad, // to display only ads with collationCount > 0
        ) => (
          //ad.collation_count &&
          <AdCard_GraphQl key={ad.ad_archive_id} ad={ad} />
        ),
      )}
    </div>
  );
};
