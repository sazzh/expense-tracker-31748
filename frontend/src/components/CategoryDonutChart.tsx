import { DonutChart } from "@mantine/charts";
import { CATEGORY_COLOURS, type Category } from "../types/Expense";

export default function CategoryDonutChart({ byCategory }: { byCategory: { category: string, total: number }[] }) {
  return (
    <DonutChart
      withLabelsLine={false}
      labelsType="value"
      withLabels={false}
      size={200}
      thickness={30}
      paddingAngle={2}
      tooltipDataSource="segment"
      chartLabel=""
      valueFormatter={(value) => `$${(value / 100).toFixed(2)}`}
      data={byCategory.map((item) => ({
        name: item.category.charAt(0).toUpperCase() + item.category.slice(1),
        value: item.total,
        color: CATEGORY_COLOURS[item.category as Category],
      }))}
    />
  );
}