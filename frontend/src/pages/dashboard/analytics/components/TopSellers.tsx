import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { Analytics } from "@/types/Analytics";
import { Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

export default function TopSellers({
  items,
}: {
  items: Analytics["topSellers"];
}) {
  const { t } = useTranslation("analytics");

  const chartConfig = {
    quantity: { label: t("topSellers.sold"), color: "var(--primary)" },
  } satisfies ChartConfig;

  const chartData = items.map((item) => ({
    name: item.name,
    quantity: item.quantity,
  }));

  return (
    <Card>
      <CardHeader className="flex items-center gap-2">
        <Trophy className="size-5 text-muted-foreground" />
        <CardTitle className="text-base">{t("topSellers.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[220px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 4, right: 24 }}
          >
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              axisLine={false}
              width={88}
              tickMargin={4}
            />
            <XAxis dataKey="quantity" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="quantity" fill="var(--color-quantity)" radius={4}>
              <LabelList
                dataKey="quantity"
                position="right"
                offset={8}
                className="fill-muted-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
