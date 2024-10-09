import React from "react";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface AgeRangeData {
  ageRange: string;
  total: number;
  male: number;
  female: number;
  unknown: number;
}

interface AgeBarChartProps {
  data: AgeRangeData[];
}

const chartConfig = {
  male: {
    label: "Male",
    color: "hsl(210, 100%, 85%)",
  },
  female: {
    label: "Female",
    color: "hsl(330, 100%, 85%)",
  },
  unknown: {
    label: "Unknown",
    color: "hsl(270, 100%, 85%)",
  },
};

export const AgeBarChart: React.FC<AgeBarChartProps> = ({ data }) => {
  const sortedData = [...data].sort((a, b) => {
    const ageA = parseInt(a.ageRange.split("-")[0]);
    const ageB = parseInt(b.ageRange.split("-")[0]);
    return ageA - ageB;
  });

  return (
    <Card className="flex w-full flex-col border-none bg-transparent shadow-none">
      <CardHeader className="items-center">
        <CardTitle>Audience by Age Range</CardTitle>
        <CardDescription>
          Distribution of audience across different age groups
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sortedData} layout="horizontal">
              <XAxis dataKey="ageRange" />
              <YAxis />
              <Tooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name, item) => (
                      <>
                        <div
                          className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                          style={
                            {
                              "--color-bg": chartConfig[name].color,
                            } as React.CSSProperties
                          }
                        />
                        {chartConfig[name].label}
                        <div className="ml-auto font-mono font-medium tabular-nums text-foreground">
                          {value.toLocaleString()}
                        </div>
                        {name === "unknown" && (
                          <div className="mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium text-foreground">
                            Total
                            <div className="ml-auto font-mono font-medium tabular-nums text-foreground">
                              {item.payload.total.toLocaleString()}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  />
                }
              />
              <Legend />
              <Bar dataKey="male" stackId="a" fill={chartConfig.male.color} />
              <Bar
                dataKey="female"
                stackId="a"
                fill={chartConfig.female.color}
              />
              <Bar
                dataKey="unknown"
                stackId="a"
                fill={chartConfig.unknown.color}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default AgeBarChart;
