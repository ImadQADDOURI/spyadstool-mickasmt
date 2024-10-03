import { AdGraphQL } from "@/types/ad";

import { Card, CardContent, CardFooter } from "../ui/card";

interface AdCard_GraphQlProps {
  ad: AdGraphQL;
}

export const AdCard_GraphQl: React.FC<AdCard_GraphQlProps> = ({ ad }) => {
  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-4">
        <div>Library ID: {ad.ad_archive_id}</div>
        <div>Collation ID: {ad.collation_id}</div>
        <div>ADs: {ad.collation_count}</div>
        <div>{ad.is_active ? "Active" : "Inactive"}</div>
      </CardContent>
    </Card>
  );
};
