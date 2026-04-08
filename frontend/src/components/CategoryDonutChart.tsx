import { DonutChart } from "@mantine/charts";
import { CATEGORY_COLOURS, type Category } from "../types/Expense";
import { Box, Group, Paper, Stack, Text } from "@mantine/core";

export default function CategoryDonutChart({ byCategory }: { byCategory: { category: string, total: number }[] }) {
  const sortedCategories = [...byCategory].sort((a, b) => b.total - a.total)

  return (
    <Paper shadow="sm" px="xl" py="md" radius="md" withBorder style={{overflow: "hidden"}}>
    <Text size="sm" fw={700}>Total Expenditure by Category</Text>
    <Stack>
      <DonutChart
        size={200}
        thickness={30}
        paddingAngle={2}
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
      </Stack>
    </Stack>
    </Paper>
  );
}