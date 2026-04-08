import { BarChart } from "@mantine/charts";
import { Stack, Text } from "@mantine/core";

export default function ExpenseBarChart({ byMonth }: { byMonth: { month: string, total: number }[] }) {
  return (
    <Stack align="center">
      <Text size="sm" fw={700} mb="md">Total Monthly Expenditure</Text>
      {byMonth.length === 0 ? (
        <Text c="dimmed" size="sm">No data available</Text>
      ) : (
      <BarChart pb="md"
        h={350}
        w={400}
        data={byMonth}
        dataKey="month"
        valueFormatter={(value) => `$${(value / 100).toFixed(2)}`}
        withBarValueLabel
        series={[
          { name: 'total', label: 'Total Expenses', color: 'primary' }, 
        ]}
      />
      )}
    </Stack>
  )
}