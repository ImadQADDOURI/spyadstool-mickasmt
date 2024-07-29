// components/adsLibrary/Analytics.tsx
"use client";

import React, { useMemo } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Ad } from "@/types/ad";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AnalyticsProps {
  ads: Ad[];
}

const Analytics: React.FC<AnalyticsProps> = ({ ads }) => {
  const chartData = useMemo(() => {
    const dataMap = new Map<string, number>();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    ads.forEach((ad) => {
      if (ad.startDate === undefined) return;

      const startDate = new Date(ad.startDate * 1000);
      let endDate: Date;

      if (ad.endDate === undefined || new Date(ad.endDate * 1000) < startDate) {
        // Ad is ongoing
        endDate = today;
      } else {
        // Ad has a defined end date
        endDate = new Date(ad.endDate * 1000);
        endDate.setDate(endDate.getDate() - 1); // Count up to one day before end date
      }

      for (
        let date = new Date(startDate);
        date <= endDate;
        date.setDate(date.getDate() + 1)
      ) {
        const dateString = date.toISOString().split("T")[0];
        dataMap.set(dateString, (dataMap.get(dateString) || 0) + 1);
      }
    });

    return Array.from(dataMap, ([date, activeVersions]) => ({
      date,
      activeVersions,
    })).sort((a, b) => a.date.localeCompare(b.date));
  }, [ads]);

  const currentActiveVersions =
    chartData[chartData.length - 1]?.activeVersions || 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ad Version Activity Analytics</CardTitle>
        <CardDescription>
          Number of active ad versions over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} domain={[0, "dataMax + 1"]} />
            <Tooltip />
            <defs>
              <linearGradient
                id="colorActiveVersions"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#EC4899" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="activeVersions"
              stroke="#8B5CF6"
              fillOpacity={1}
              fill="url(#colorActiveVersions)"
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold">
            Current Active Ad Versions: {currentActiveVersions}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Analytics;
