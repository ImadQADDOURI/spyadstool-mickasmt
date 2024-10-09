// components/adsLibrary/EuAdStatistic.tsx
import React from "react";
import { Info, Loader2 } from "lucide-react";

import { countryCodesAlpha2Flag } from "@/lib/countryCodesAlpha2Flag";
import AgeBarChart from "@/components/adLibrary/adInsights/AgeBarChart";
import CountryBarChart from "@/components/adLibrary/adInsights/CountryBarChart";
import GenderPieChart from "@/components/adLibrary/adInsights/GenderPieChart";

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
    return (
      <div className="flex items-center justify-center py-8 text-gray-500 dark:text-gray-400">
        <div className="mr-3 h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-purple-500"></div>
        Loading Statistics...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-lg bg-red-100 p-4 text-red-700 dark:bg-red-900 dark:text-red-300"
        role="alert"
      >
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  const aaaInfo = data?.data?.ad_library_main?.ad_details?.aaa_info;

  if (!aaaInfo) {
    return (
      <div className="rounded-lg bg-gray-100 p-4 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
        No Statistics available.
      </div>
    );
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
      countryCodesAlpha2Flag.find((c) => c.value === countryCode)?.label ||
      countryCode,
    total: totals.total,
    male: totals.male,
    female: totals.female,
    unknown: totals.unknown,
  }));

  return (
    <div className="space-y-6 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          European Union Statistics
        </h3>
        <Info className="h-5 w-5 text-gray-400 dark:text-gray-500" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Gender Audience"
          value={gender_audience || "Not specified"}
        />
        <StatCard
          title="Age Audience"
          value={
            age_audience
              ? `${age_audience.min}-${age_audience.max}`
              : "Not specified"
          }
        />
        <StatCard
          title="EU Total Reach"
          value={eu_total_reach.toLocaleString()}
        />
      </div>

      <div className="space-y-6">
        <ChartSection title="Gender Distribution">
          <GenderPieChart
            men={totalMale}
            women={totalFemale}
            unknown={totalUnknown}
          />
        </ChartSection>

        <ChartSection title="Age Distribution">
          <AgeBarChart data={ageBarChartData} />
        </ChartSection>

        <ChartSection title="Country Distribution">
          <CountryBarChart data={countryBarChartData} />
        </ChartSection>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string | number }> = ({
  title,
  value,
}) => (
  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
      {title}
    </h4>
    <p className="mt-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
      {value}
    </p>
  </div>
);

const ChartSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="space-y-2">
    <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300">
      {title}
    </h4>
    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">{children}</div>
  </div>
);
