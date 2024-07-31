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
  const { theme } = useTheme();

  const chartData = useMemo(() => {
    const dataMap = new Map<string, number>();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    ads.forEach((ad) => {
      if (ad.startDate === undefined) return;

      const startDate = new Date(ad.startDate * 1000);
      let endDate: Date;

      if (ad.endDate === undefined || new Date(ad.endDate * 1000) < startDate) {
        endDate = today;
      } else {
        endDate = new Date(ad.endDate * 1000);
        endDate.setDate(endDate.getDate() - 1);
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
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Ad Version Activity Analytics
        </CardTitle>
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
              {currentActiveVersions}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Analytics;
