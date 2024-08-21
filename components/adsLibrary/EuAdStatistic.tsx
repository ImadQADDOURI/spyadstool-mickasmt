// components/adsLibrary/EuAdStatistic.tsx
import React from "react";

import { countryCodesAlpha2 } from "@/lib/countryCodesAlpha2";
import AgeBarChart from "@/components/adsLibrary/AgeBarChart";
import CountryBarChart from "@/components/adsLibrary/CountryBarChart";
import GenderPieChart from "@/components/adsLibrary/GenderPieChart";

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

  // Initialize totals
  let totalMale = 0;
  let totalFemale = 0;
  let totalUnknown = 0;
  const countryTotals: Record<
    string,
    { total: number; male: number; female: number; unknown: number }
  > = {};
  const ageRangeTotals: Record<
    string,
    { total: number; male: number; female: number; unknown: number }
  > = {};

  // Calculate totals
  age_country_gender_reach_breakdown.forEach((country) => {
    country.age_gender_breakdowns.forEach((breakdown) => {
      const male = breakdown.male || 0;
      const female = breakdown.female || 0;
      const unknown = breakdown.unknown || 0;

      // Update global totals
      totalMale += male;
      totalFemale += female;
      totalUnknown += unknown;

      // Update country-specific totals
      if (!countryTotals[country.country]) {
        countryTotals[country.country] = {
          total: 0,
          male: 0,
          female: 0,
          unknown: 0,
        };
      }
      countryTotals[country.country].male += male;
      countryTotals[country.country].female += female;
      countryTotals[country.country].unknown += unknown;
      countryTotals[country.country].total += male + female + unknown;

      // Update age range totals
      if (!ageRangeTotals[breakdown.age_range]) {
        ageRangeTotals[breakdown.age_range] = {
          total: 0,
          male: 0,
          female: 0,
          unknown: 0,
        };
      }
      ageRangeTotals[breakdown.age_range].male += male;
      ageRangeTotals[breakdown.age_range].female += female;
      ageRangeTotals[breakdown.age_range].unknown += unknown;
      ageRangeTotals[breakdown.age_range].total += male + female + unknown;
    });
  });

  // Sort age ranges
  const sortedAgeRanges = Object.entries(ageRangeTotals).sort((a, b) => {
    const ageA = parseInt(a[0].split("-")[0]);
    const ageB = parseInt(b[0].split("-")[0]);
    return ageA - ageB;
  });

  // Sort countries by total audience size
  const sortedCountries = Object.entries(countryTotals).sort(
    (a, b) => b[1].total - a[1].total,
  );

  // Prepare data for AgeBarChart
  const ageBarChartData = sortedAgeRanges.map(([ageRange, totals]) => ({
    ageRange,
    total: totals.total,
    male: totals.male,
    female: totals.female,
    unknown: totals.unknown,
  }));

  // Prepare data for CountryBarChart
  const countryBarChartData = sortedCountries.map(([countryCode, totals]) => ({
    countryCode,
    countryLabel:
      countryCodesAlpha2.find((c) => c.value === countryCode)?.label ||
      countryCode,
    total: totals.total,
    male: totals.male,
    female: totals.female,
    unknown: totals.unknown,
  }));

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
        {/* <div>
          <strong>Total Audience by Gender:</strong>
          <ul className="list-inside list-disc">
            <li>Male: {totalMale.toLocaleString()}</li>
            <li>Female: {totalFemale.toLocaleString()}</li>
            <li>Unknown: {totalUnknown.toLocaleString()}</li>
          </ul>
        </div> */}
        <GenderPieChart
          men={totalMale}
          women={totalFemale}
          unknown={totalUnknown}
        />

        {/* <div>
          <strong>Audience by Age Range:</strong>
          <ul className="list-inside list-disc">
            {sortedAgeRanges.map(([ageRange, totals]) => (
              <li key={ageRange}>
                {ageRange}: {totals.total.toLocaleString()}
                (M: {totals.male.toLocaleString()}, F:{" "}
                {totals.female.toLocaleString()}, U:{" "}
                {totals.unknown.toLocaleString()})
              </li>
            ))}
          </ul>
        </div> */}
        <AgeBarChart data={ageBarChartData} />

        {/* <div>
          <strong>Audience by Country:</strong>
          <ul className="list-inside list-disc">
            {sortedCountries.map(([countryCode, totals]) => {
              const countryLabel =
                countryCodesAlpha2.find((c) => c.value === countryCode)
                  ?.label || countryCode;
              return (
                <li key={countryCode}>
                  {countryLabel}: {totals.total.toLocaleString()}
                  (M: {totals.male.toLocaleString()}, F:{" "}
                  {totals.female.toLocaleString()}, U:{" "}
                  {totals.unknown.toLocaleString()})
                </li>
              );
            })}
          </ul>
        </div> */}

        <CountryBarChart data={countryBarChartData} />
      </div>
    </div>
  );
};
