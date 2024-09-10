import React, { useMemo } from "react";
import Image from "next/image";

interface DataPoint {
  date: string;
  activeVersions: number;
}

interface AnalyzeTrendsProps {
  chartData: DataPoint[];
  periods?: number[];
}

interface TrendAnalysis {
  trend: string;
  changePercentage: number;
}

const DEFAULT_PERIODS = [7, 30, 0]; // 7 days, 30 days, all-time

const AnalyzeTrends: React.FC<AnalyzeTrendsProps> = ({
  chartData,
  periods = DEFAULT_PERIODS,
}) => {
  const trendAnalyses = useMemo(() => {
    return periods.map((period) => ({
      period: period === 0 ? "All" : `${period}d`,
      analysis: analyzeTrendPeriod(chartData.slice(-period || undefined)),
    }));
  }, [chartData, periods]);

  return (
    <div className="w-full overflow-hidden rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md dark:from-gray-800 dark:to-indigo-900">
      <div className="flex items-stretch justify-between divide-x divide-gray-200 dark:divide-gray-700">
        {trendAnalyses.map(({ period, analysis }) => (
          <div
            key={period}
            className="flex min-w-[100px] flex-1 flex-col items-center justify-between p-2 transition-all duration-300 hover:bg-white/50 dark:hover:bg-gray-700/50"
          >
            <span className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
              {period}
            </span>
            <div className="mb-1 flex items-center">
              <TrendIcon trend={analysis.trend} />
              <span
                className={`text-sm font-bold ${getTrendColor(analysis.trend)} ml-1`}
              >
                {analysis.trend}
              </span>
            </div>
            <ChangeDisplay value={analysis.changePercentage} />
          </div>
        ))}
      </div>
    </div>
  );
};

const ChangeDisplay: React.FC<{ value: number }> = ({ value }) => {
  const formattedValue = value.toFixed(1);
  const isPositive = value >= 0;
  const barWidth = Math.min(Math.abs(value), 100);
  const barColor = isPositive ? "bg-green-500" : "bg-red-500";

  return (
    <div className="w-full">
      <div className="flex h-2 items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className={`h-full ${barColor} transition-all duration-500 ease-out`}
          style={{
            width: `${barWidth}%`,
            marginLeft: isPositive ? "50%" : `${50 - barWidth}%`,
          }}
        ></div>
      </div>
      <span
        className={`text-xs font-medium ${isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"} mt-1 block text-center`}
      >
        {isPositive ? "+" : ""}
        {formattedValue}%
      </span>
    </div>
  );
};

function analyzeTrendPeriod(data: DataPoint[]): TrendAnalysis {
  if (data.length < 2) {
    return { trend: "Insufficient Data", changePercentage: 0 };
  }

  const values = data.map((point) => point.activeVersions);
  const firstValue = values[0];
  const lastValue = values[values.length - 1];
  const changePercentage = ((lastValue - firstValue) / firstValue) * 100;

  return { trend: getTrendName(changePercentage), changePercentage };
}

function getTrendName(changePercentage: number): string {
  if (changePercentage > 20) return "Rapid Growth";
  if (changePercentage > 5) return "Gradual Increase";
  if (changePercentage < -20) return "Sharp Decline";
  if (changePercentage < -5) return "Gradual Decrease";
  return "Stable";
}

function getTrendColor(trend: string): string {
  switch (trend) {
    case "Rapid Growth":
    case "Gradual Increase":
      return "text-green-600 dark:text-green-400";
    case "Sharp Decline":
    case "Gradual Decrease":
      return "text-red-600 dark:text-red-400";
    case "Stable":
      return "text-blue-600 dark:text-blue-400";
    default:
      return "text-gray-600 dark:text-gray-400";
  }
}
const TrendIcon: React.FC<{ trend: string }> = ({ trend }) => {
  let iconPath = "";
  switch (trend) {
    case "Rapid Growth":
      iconPath = "/icons/arrow_up.svg";
      break;
    case "Gradual Increase":
      iconPath = "/icons/arrow_up_right.svg";
      break;
    case "Sharp Decline":
      iconPath = "/icons/arrow_down.svg";
      break;
    case "Gradual Decrease":
      iconPath = "/icons/arrow_down_right.svg";
      break;
    case "Stable":
      iconPath = "/icons/arrow_right.svg";
      break;
    default:
      iconPath = "/icons/arrow_zigzag.svg";
  }

  return (
    <div className="inline-flex h-4 w-4 items-center justify-center">
      <Image src={iconPath} alt={trend} width={16} height={16} />
    </div>
  );
};

export default AnalyzeTrends;
