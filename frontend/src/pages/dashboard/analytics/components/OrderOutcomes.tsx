import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { Analytics } from "@/types/Analytics";
import { ChartPie } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Label, Pie, PieChart } from "recharts";

// Status colours: green = collected (good), red = cancelled, blue = in flight.
const COLORS = {
  collected: "oklch(0.72 0.15 155)",
  cancelled: "var(--destructive)",
  active: "oklch(0.68 0.14 240)",
} as const;

export default function OrderOutcomes({ data }: { data: Analytics }) {
  const { t } = useTranslation("analytics");

  // Whatever isn't collected or cancelled is still in flight (queued/ready).
  const active = data.totalOrders - data.collectedOrders - data.cancelledOrders;

  const chartConfig = {
    collected: { label: t("outcomes.collected"), color: COLORS.collected },
    cancelled: { label: t("outcomes.cancelled"), color: COLORS.cancelled },
    active: { label: t("outcomes.active"), color: COLORS.active },
  } satisfies ChartConfig;

  const chartData = (
    [
      { key: "collected", value: data.collectedOrders },
      { key: "cancelled", value: data.cancelledOrders },
      { key: "active", value: active },
    ] as const
  )
    .filter((segment) => segment.value > 0)
    .map((segment) => ({ ...segment, fill: `var(--color-${segment.key})` }));

  const completion = Math.round(data.completionRate * 100);

  return (
    <Card>
      <CardHeader className="flex items-center gap-2">
        <ChartPie className="size-5 text-muted-foreground" />
        <CardTitle className="text-base">{t("outcomes.title")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-10">
        <ChartContainer
          config={chartConfig}
          className="aspect-square h-[180px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent nameKey="key" hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="key"
              innerRadius={55}
              strokeWidth={2}
            >
              <Label
                content={({ viewBox }) => {
                  if (!viewBox || !("cx" in viewBox)) return null;
                  const cx = viewBox.cx ?? 0;
                  const cy = viewBox.cy ?? 0;
                  return (
                    <text x={cx} y={cy} textAnchor="middle">
                      <tspan
                        x={cx}
                        y={cy - 2}
                        className="fill-foreground text-2xl font-semibold"
                      >
                        {completion}%
                      </tspan>
                      <tspan
                        x={cx}
                        y={cy + 16}
                        className="fill-muted-foreground text-xs"
                      >
                        {t("outcomes.completion")}
                      </tspan>
                    </text>
                  );
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        <ul className="flex w-full flex-col gap-2.5 sm:w-auto sm:min-w-44">
          {chartData.map((segment) => {
            const share = data.totalOrders
              ? Math.round((segment.value / data.totalOrders) * 100)
              : 0;
            return (
              <li
                key={segment.key}
                className="flex items-center gap-2.5 text-sm"
              >
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: COLORS[segment.key] }}
                />
                <span className="flex-1 text-muted-foreground">
                  {chartConfig[segment.key].label}
                </span>
                <span className="font-medium tabular-nums">
                  {segment.value}
                </span>
                <span className="w-9 text-right text-muted-foreground tabular-nums">
                  {share}%
                </span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
