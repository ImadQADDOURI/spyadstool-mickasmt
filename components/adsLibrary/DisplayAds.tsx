import React from "react";

interface CleanedAd {
  adArchiveID: string;
  startDate: number;
  endDate: number;
  isActive: boolean;
}

interface CleanedData {
  isResultComplete: boolean;
  forwardCursor: string;
  backwardCursor: string;
  totalCount: number;
  collationToken: string;
  ads: CleanedAd[];
}

interface DisplayAdsProps {
  data: CleanedData | null;
}

const DisplayAds: React.FC<DisplayAdsProps> = ({ data }) => {
  if (!data) {
    return <p>No results found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <h2 className="mb-2 text-xl font-bold">Search Results</h2>
      <p>Total Count: {data.totalCount}</p>
      <p>Is Result Complete: {data.isResultComplete ? "Yes" : "No"}</p>
      <table className="mt-4 min-w-full border border-gray-300 bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="border-b px-4 py-2">Ad Archive ID</th>
            <th className="border-b px-4 py-2">Start Date</th>
            <th className="border-b px-4 py-2">End Date</th>
            <th className="border-b px-4 py-2">Is Active</th>
          </tr>
        </thead>
        <tbody>
          {data.ads.map((ad, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
              <td className="border-b px-4 py-2">{ad.adArchiveID}</td>
              <td className="border-b px-4 py-2">
                {new Date(ad.startDate * 1000).toLocaleDateString()}
              </td>
              <td className="border-b px-4 py-2">
                {new Date(ad.endDate * 1000).toLocaleDateString()}
              </td>
              <td className="border-b px-4 py-2">
                {ad.isActive ? "Yes" : "No"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DisplayAds;
