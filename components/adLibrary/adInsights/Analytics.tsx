// components/adsLibrary/Analytics.tsx
"use client";

import React, { useMemo } from "react";
import { useTheme } from "next-themes";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AdData } from "@/types/ad";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import AnalyzeTrends from "./AnalyzeTrends";

interface AnalyticsProps {
  ads: AdData[];
}

const Analytics: React.FC<AnalyticsProps> = ({ ads }) => {
  const { theme } = useTheme();

  const { chartData, activeAdsCount } = useMemo(() => {
    const dataMap = new Map<string, number>();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let activeCount = 0;

    ads.forEach((ad) => {
      if (ad.start_date === undefined) return;
      // // display ads Dates
      // console.log(
      //   `Before : Start Date: ${new Date(ad.startDate * 1000).toLocaleDateString()}, End Date: ${ad.endDate ? new Date(ad.endDate * 1000).toLocaleDateString() : "Ongoing"}, Active: ${ad.isActive}`,
      // );
      const startDate = new Date(ad.start_date * 1000);
      let endDate: Date;

      if (
        // if endDate not a valid date use today as end date
        ad.end_date === undefined ||
        new Date(ad.end_date * 1000) < startDate ||
        new Date(ad.end_date * 1000) >= tomorrow
      ) {
        console.log("🚀🚀🚀🚀 !!! invalid end date !!!", ad.end_date);
        endDate = today;
      } else {
        endDate = new Date(ad.end_date * 1000);
      }

      //Populating the Data Map:For each day between the start and end date of an ad, we increment the count in our dataMap.This gives us a day-by-day count of how many ads were active on each date.
      for (
        let date = new Date(startDate);
        date <= endDate;
        date.setDate(date.getDate() + 1)
      ) {
        const dateString = date.toISOString().split("T")[0];
        dataMap.set(dateString, (dataMap.get(dateString) || 0) + 1);
      }

      // Count current active ads,We increment activeCount for each ad that is currently active.
      if (ad.is_active) {
        activeCount++;
      }
    });

    //// Adding Extra Days:
    // Add a day at the start with value 0
    if (dataMap.size > 0) {
      const firstDay = new Date(
        Math.min(
          ...Array.from(dataMap.keys()).map((date) => new Date(date).getTime()),
        ),
      );
      const startDay = new Date(firstDay);
      startDay.setDate(startDay.getDate() - 1);
      const startDayString = startDay.toISOString().split("T")[0];
      dataMap.set(startDayString, 0);
    }

    // Add an extra day at the end
    if (activeCount > 0) {
      const extraDay = new Date(today);
      extraDay.setDate(extraDay.getDate() + 1);
      const extraDayString = extraDay.toISOString().split("T")[0];
      dataMap.set(extraDayString, activeCount);
    } else {
      // If there are no active ads, add an extra day with value 0
      const dates = Array.from(dataMap.keys()).map((date) => new Date(date));
      if (dates.length > 0) {
        const lastDay = new Date(Math.max(...dates.map((d) => d.getTime())));
        const extraDay = new Date(lastDay);
        extraDay.setDate(extraDay.getDate() + 1);
        const extraDayString = extraDay.toISOString().split("T")[0];
        dataMap.set(extraDayString, 0);
      } else {
        // If dataMap is empty, use today's date
        const extraDayString = today.toISOString().split("T")[0];
        dataMap.set(extraDayString, 0);
      }
    }

    //Preparing Chart Data:
    //We convert our dataMap into an array of objects, each containing a date and the count of active ads for that date.
    //We sort this array by date to ensure chronological order.
    const dates = Array.from(dataMap, ([date, activeVersions]) => ({
      date,
      activeVersions,
    })).sort((a, b) => a.date.localeCompare(b.date));

    // log the ( date / active ads ) array
    // for (const date of dates) {
    //   console.log(`  ${date.date}: ${date.activeVersions}`);
    // }
    // console.log("🚀🚀🚀🚀");

    return { chartData: dates, activeAdsCount: activeCount };
  }, [ads]);

  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const formatTooltipDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const chartColor = theme === "dark" ? "#FF1493" : "#8B00FF";

  return (
    <Card className="w-full transition-shadow duration-300 hover:shadow-lg">
      <CardHeader className="items-center">
        <CardTitle className="text-2xl font-bold">Ad Scale</CardTitle>
        <CardDescription className="text-sm text-gray-500">
          Number of active ad versions over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <XAxis
              dataKey="date"
              tickFormatter={formatXAxis}
              interval="preserveStartEnd"
              tickCount={5}
              stroke={theme === "dark" ? "#888" : "#333"}
            />
            <YAxis
              allowDecimals={false}
              domain={[0, "dataMax + 1"]}
              tickCount={5}
              stroke={theme === "dark" ? "#888" : "#333"}
            />
            <Tooltip
              labelFormatter={(label) => formatTooltipDate(label as string)}
              contentStyle={{
                backgroundColor:
                  theme === "dark"
                    ? "rgba(51, 51, 51, 0.8)"
                    : "rgba(255, 255, 255, 0.8)",
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                backdropFilter: "blur(4px)",
              }}
              itemStyle={{
                color: theme === "dark" ? "#fff" : "#333",
              }}
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColor} stopOpacity={0.8} />
                <stop offset="100%" stopColor={chartColor} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="activeVersions"
              stroke={chartColor}
              fill="url(#colorGradient)"
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 6,
                strokeWidth: 2,
                stroke: theme === "dark" ? "#fff" : "#333",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-6 text-center">
          <p className="text-2xl font-bold">
            Current Active Ad Versions:
            <span className="ml-2 text-3xl text-indigo-600 dark:text-indigo-400">
              {activeAdsCount}
            </span>
          </p>
        </div>
        <AnalyzeTrends
          chartData={chartData}
          periods={[7, 30, 0]} // Customize periods as needed // [7, 30, 0];  7 days, 30 days, all-time
        />
      </CardContent>
    </Card>
  );
};

export default Analytics;
