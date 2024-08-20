import React from "react";
import { Cell, Label, Pie, PieChart, ResponsiveContainer } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface GenderPieChartProps {
  men: number;
  women: number;
  unknown: number;
}

const GenderPieChart: React.FC<GenderPieChartProps> = ({
  men,
  women,
  unknown,
}) => {
  const total = men + women + unknown;

  const chartData = [
    { gender: "Men", value: men, fill: "hsl(210, 100%, 85%)" }, // Light blue
    { gender: "Women", value: women, fill: "hsl(330, 100%, 85%)" }, // Light pink
    { gender: "Unknown", value: unknown, fill: "hsl(270, 100%, 85%)" }, // Light purple
  ];

  const chartConfig: ChartConfig = {
    value: {
      label: "Value",
    },
    Men: {
      label: "Men",
      color: "hsl(210, 100%, 85%)",
    },
    Women: {
      label: "Women",
      color: "hsl(330, 100%, 85%)",
    },
    Unknown: {
      label: "Unknown",
      color: "hsl(270, 100%, 85%)",
    },
  };

  const CustomLegendContent = ({ payload }: { payload?: Array<any> }) => {
    if (!payload) return null;
    return (
      <ul className="flex flex-wrap justify-center gap-4">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center">
            <span
              className="mr-2 inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="mr-1">{entry.value}</span>
            <span className="text-muted-foreground">
              ({entry.payload.value})
            </span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card className="flex flex-col  border-none bg-transparent shadow-none m-0">
      <CardHeader className="items-center pb-0 m-0">
        <CardTitle className=" pb-0">Gender Distribution</CardTitle>
        {/* <CardDescription>Total: {total}</CardDescription> */}
      </CardHeader>
      <CardContent className="m-0 flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie className="m-0"
                data={chartData}
                dataKey="value"
                nameKey="gender"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                labelLine={false}
                label={({ name, percent, gender }) =>
                  `${(percent * 100).toFixed(0)}%`
                }
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
                <Label className="m-0"
                  content={({ viewBox }) => {
                    const { cx, cy } = viewBox;
                    return (
                      <text
                        x={cx}
                        y={cy}
                        fill="var(--foreground)"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        <tspan
                          x={cx}
                          y={cy}
                          dy="-0.5em"
                          fontSize="24"
                          fontWeight="bold"
                          className="fill-gray-700 dark:fill-gray-100"
                        >
                          {total}
                        </tspan>
                        <tspan
                          x={cx}
                          y={cy}
                          dy="1.5em"
                          fontSize="14"
                          className="fill-gray-700 dark:fill-gray-100"
                        >
                          Total
                        </tspan>
                      </text>
                    );
                  }}
                />
              </Pie>
              {/* <ChartLegend
                content={<ChartLegendContent nameKey="gender" />}
                className="-translate-y-6 flex-wrap gap-1 [&>*]:basis-1/3 [&>*]:justify-center"
              /> */}
              <ChartLegend
                content={<CustomLegendContent />}
                className="flex w-full -translate-y-6 justify-center m-0"
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default GenderPieChart;
