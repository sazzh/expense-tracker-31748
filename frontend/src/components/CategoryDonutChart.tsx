import { DonutChart } from "@mantine/charts";
import { CATEGORY_COLOURS, type Category } from "../types/Expense";
import { Box, Divider, Group, Stack, Text } from "@mantine/core";

export default function CategoryDonutChart({ byCategory }: { byCategory: { category: string, total: number }[] }) {
  const sortedCategories = [...byCategory].sort((a, b) => b.total - a.total)
  const total = byCategory.reduce((sum, item) => sum + item.total, 0)

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
        valueFormatter={(value) => `$${(value / 100).toFixed(2)}`}
        data={sortedCategories.map((item) => ({
          name: item.category.charAt(0).toUpperCase() + item.category.slice(1),
          value: item.total,
          color: CATEGORY_COLOURS[item.category as Category],
        }))}
      />
      <Stack gap="xs" w="100%">
        {sortedCategories.map((item) => (
          <Group key={item.category} justify="space-between">
            <Group gap="xs">
              <Box w={10} h={10} bg={CATEGORY_COLOURS[item.category as Category]} style={{ borderRadius: "50%" }} />
              <Text size="sm" c="dimmed">
                {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
              </Text>
            </Group>
            <Text size="sm" fw={500}>
              ${(item.total / 100).toFixed(2)}
            </Text>
          </Group>
        ))}
        <Divider />
        <Group justify="space-between">
          <Text size="sm">
            Total
          </Text>
          <Text size="sm">
            ${(total / 100).toFixed(2)}
          </Text>
        </Group>
      </Stack>
      </Box>
    )}
    </Stack>
  );
}