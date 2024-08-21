import React, { useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
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
import { Input } from "@/components/ui/input";

interface CountryData {
  countryCode: string;
  countryLabel: string;
  total: number;
  male: number;
  female: number;
  unknown: number;
}

interface CountryBarChartProps {
  data: CountryData[];
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

export const CountryBarChart: React.FC<CountryBarChartProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  const filteredData = data
    .filter(
      (country) =>
        country.countryLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.countryCode.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => b.total - a.total)
    .slice(0, 20); // Show top 20 countries

  return (
    <Card className="flex w-full flex-col border-none bg-transparent shadow-none">
      <CardHeader className="items-center">
        <CardTitle>Audience by Country</CardTitle>
        <CardDescription>
          Distribution of audience across different countries (Top 20)
        </CardDescription>
      </CardHeader>
      <Input
        placeholder="Search countries..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-2 mr-9 w-40 place-self-end"
      />
      <CardContent className="">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={filteredData} layout="vertical">
              <XAxis type="number" />
              <YAxis dataKey="countryLabel" type="category" width={100} />
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
              <Bar
                dataKey="male"
                stackId="a"
                fill={chartConfig.male.color}
                onMouseEnter={() => setHoveredBar("male")}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {filteredData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      hoveredBar === "male" || hoveredBar === null
                        ? chartConfig.male.color
                        : "hsl(210, 100%, 95%)"
                    }
                  />
                ))}
              </Bar>
              <Bar
                dataKey="female"
                stackId="a"
                fill={chartConfig.female.color}
                onMouseEnter={() => setHoveredBar("female")}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {filteredData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      hoveredBar === "female" || hoveredBar === null
                        ? chartConfig.female.color
                        : "hsl(330, 100%, 95%)"
                    }
                  />
                ))}
              </Bar>
              <Bar
                dataKey="unknown"
                stackId="a"
                fill={chartConfig.unknown.color}
                onMouseEnter={() => setHoveredBar("unknown")}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {filteredData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      hoveredBar === "unknown" || hoveredBar === null
                        ? chartConfig.unknown.color
                        : "hsl(270, 100%, 95%)"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default CountryBarChart;
