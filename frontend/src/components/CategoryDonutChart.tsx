import { DonutChart } from "@mantine/charts";
import { CATEGORY_COLOURS, type Category } from "../types/Expense";
import { Box, Divider, Group, Stack, Text } from "@mantine/core";
import { formatMoney } from "../utils/numberFormat";
import { capitalise } from "../utils/capitaliseFormat";

export default function CategoryDonutChart({ byCategory }: { byCategory: { category: string, total: number }[] }) {
  const sortedCategories = [...byCategory].sort((a, b) => b.total - a.total)
  const total = byCategory.reduce((sum, item) => sum + Number(item.total), 0)

  return (
    <Stack align="center">
    <Text size="sm" fw={700}>Total Expenditure by Category</Text>
    {byCategory.length === 0 ? ( 
      <Text c="dimmed" size="sm">No data available</Text>
    ) : (
      <Box>
      <DonutChart
        size={200}
        thickness={30}
        paddingAngle={1}
        tooltipDataSource="segment"
        chartLabel="Category"
        valueFormatter={(value) => `$${formatMoney(value)}`}
        data={sortedCategories.map((item) => ({
          name: capitalise(item.category),
          value: Number(item.total),
          color: CATEGORY_COLOURS[item.category as Category],
        }))}
      />
      <Stack gap="xs" w="100%">
        {sortedCategories.map((item) => (
          <Group key={item.category} justify="space-between">
            <Group gap="xs">
              <Box w={10} h={10} bg={CATEGORY_COLOURS[item.category as Category]} style={{ borderRadius: "50%" }} />
              <Text size="sm" c="dimmed">
                {capitalise(item.category)}
              </Text>
            </Group>
            <Text size="sm" fw={500}>
              ${formatMoney(item.total)}
            </Text>
          </Group>
        ))}
        <Divider />
        <Group justify="space-between">
          <Text size="sm">
            Total
          </Text>
          <Text size="sm">
            ${formatMoney(total)}
          </Text>
        </Group>
      </Stack>
      </Box>
    )}
    </Stack>
  );
}