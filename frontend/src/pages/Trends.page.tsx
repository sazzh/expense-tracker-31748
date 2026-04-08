import { Box, Divider, Group, Paper, Text } from "@mantine/core";
import BackButton from "../components/BackButton";
import { useEffect, useState } from "react";
import { getExpensesByCategory, getExpensesByMonth } from "../api/Expenses";
import { type MonthlyExpenses, type CategoryTotal } from "../types/Trends";
import CategoryDonutChart from "../components/CategoryDonutChart";
import ExpenseBarChart from "../components/ExpensesBarChart";

export function TrendsPage() {
  const [byCategory, setByCategory] = useState<CategoryTotal[]>([]);
  const [byMonth, setByMonth] = useState<MonthlyExpenses[]>([]);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const [categoryTrend, monthlyTrend] = await Promise.all([
          getExpensesByCategory(),
          getExpensesByMonth()
        ]);
        setByCategory(categoryTrend);
        setByMonth(monthlyTrend)

      } catch (error) {
        console.error("Error fetching trends:", error);
      }
    };
    fetchTrends();  
  }, []);

  return (
    <>
      <BackButton />
      <Box mx="auto" w="100%" maw="1050" p="sm" pt="0">
        <h1>Your Expense Trends</h1>
        <Text c="dimmed" size="sm" ml="lg" ta="center">Welcome to your expense trends!</Text>
        <Text c="dimmed" size="sm" ml="lg" mb="lg" ta="center">Here you can view your spending patterns by 
          category as well as monthly expenditure trends.</Text>
      </Box>
      <Group justify="center" gap={50}>
        <Paper shadow="sm" px="100" py="md" radius="md" withBorder h={470}>
          <CategoryDonutChart byCategory={byCategory} />
        </Paper>
        <Paper shadow="sm" px="100" py="md" radius="md" withBorder h={470}>
          <ExpenseBarChart byMonth={byMonth} />
          <Divider />
          <Text size="sm" ta="center" mt="xs">
            Total across all months: ${(byMonth.reduce((sum, month) => sum + month.total, 0) / 100).toFixed(2)}
          </Text>
        </Paper>
      </Group>
    </>
  )
}