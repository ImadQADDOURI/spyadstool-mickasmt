// components/adsLibrary/EuAdStatistic.tsx
import React from "react";

import { countryCodesAlpha2 } from "@/lib/countryCodesAlpha2";

interface EuAdStatisticProps {
  data: any;
  isLoading: boolean;
  error: string | null;
}

export const EuAdStatistic: React.FC<EuAdStatisticProps> = ({
  data,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return <div className="text-center">Loading Statistics...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  const aaaInfo = data?.data?.ad_library_main?.ad_details?.aaa_info;

  if (!aaaInfo) {
    return <div className="text-center">No Statistics available.</div>;
  }

  const {
    gender_audience,
    age_audience,
    eu_total_reach,
    age_country_gender_reach_breakdown,
  } = aaaInfo;

  // Calculate totals
  let totalMale = 0;
  let totalFemale = 0;
  let totalUnknown = 0;
  const countryTotals: { [key: string]: number } = {};

  age_country_gender_reach_breakdown.forEach((country) => {
    let countryTotal = 0;
    country.age_gender_breakdowns.forEach((breakdown) => {
      totalMale += breakdown.male || 0;
      totalFemale += breakdown.female || 0;
      totalUnknown += breakdown.unknown || 0;
      countryTotal +=
        (breakdown.male || 0) +
        (breakdown.female || 0) +
        (breakdown.unknown || 0);
    });
    countryTotals[country.country] = countryTotal;
  });

  return (
    <div className="rounded-lg bg-white p-4 shadow-md dark:bg-gray-700">
      <h3 className="mb-2 text-lg font-semibold">European Union Statistics</h3>
      <div className="space-y-2">
        <p>
          <strong>Gender Audience:</strong> {gender_audience || "Not specified"}
        </p>
        <p>
          <strong>Age Audience:</strong>{" "}
          {age_audience
            ? `${age_audience.min}-${age_audience.max}`
            : "Not specified"}
        </p>
        <p>
          <strong>EU Total Reach:</strong> {eu_total_reach.toLocaleString()}
        </p>
        <div>
          <strong>Total Audience by Gender:</strong>
          <ul className="list-inside list-disc">
            <li>Male: {totalMale.toLocaleString()}</li>
            <li>Female: {totalFemale.toLocaleString()}</li>
            <li>Unknown: {totalUnknown.toLocaleString()}</li>
          </ul>
        </div>
        <div>
          <strong>Audience by Country:</strong>
          <ul className="list-inside list-disc">
            {Object.entries(countryTotals).map(([countryCode, total]) => {
              const countryLabel =
                countryCodesAlpha2.find((c) => c.value === countryCode)
                  ?.label || countryCode;
              return (
                <li key={countryCode}>
                  {countryLabel}: {total.toLocaleString()}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};
