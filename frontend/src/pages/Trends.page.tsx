import { Box, Center, Divider, Group, Loader, Paper, Text } from "@mantine/core";
import BackButton from "../components/BackButton";
import { useCallback, useEffect, useState } from "react";
import { type MonthlyExpenses, type CategoryTotal } from "../types/Trends";
import CategoryDonutChart from "../components/CategoryDonutChart";
import ExpenseBarChart from "../components/ExpensesBarChart";
import { IconCalendar } from "@tabler/icons-react";
import { getExpensesByCategory, getExpensesByMonth } from "../api/Expenses";
import { MonthPickerInput } from "@mantine/dates";
import ErrorAlert from "../components/ErrorAlert";

export function TrendsPage() {
  const [byCategory, setByCategory] = useState<CategoryTotal[]>([]);
  const [byMonth, setByMonth] = useState<MonthlyExpenses[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const fetchTrends = useCallback(async (start: string | null, end: string | null) => {
    setLoading(true);
    setError(null);
    try {
      const [categoryTrend, monthlyTrend] = await Promise.all([
        getExpensesByCategory(start, end),
        getExpensesByMonth(start, end),
      ]);
      setByCategory(categoryTrend);
      setByMonth(monthlyTrend);
    } catch (error) {
      setError("Failed to load trend data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTrends(null, null); }, [fetchTrends]);

  function handleStartDate(val: string | null) {
    setStartDate(val);
    fetchTrends(val, endDate);
  }

  function handleEndDate(val: string | null) {
    setEndDate(val);
    fetchTrends(startDate, val);
  }

  const total = (byMonth.reduce((sum, month) => sum + Number(month.total), 0)).toFixed(2);

  return (
    <>
      <BackButton />
      <Box mx="auto" w="100%" maw="1050" p="sm" pt="0">
        <h1>Your Expense Trends</h1>
        <Text c="dimmed" size="sm" ml="lg" ta="center">Welcome to your expense trends!</Text>
        <Text c="dimmed" size="sm" ml="lg" mb="lg" ta="center">Here you can view your spending patterns by 
          category as well as monthly expenditure trends.</Text>
        <Group justify="center" mb="xl">
          <Text c="dimmed" size="sm">From:</Text>
          <MonthPickerInput
            leftSection={<IconCalendar stroke={1.25}/>}
            placeholder="From"
            value={startDate}
            onChange={handleStartDate}
            maxDate={endDate ? new Date(endDate) : undefined}
            clearable
            w={200}
          />
          <Text c="dimmed" size="sm">to:</Text>
          <MonthPickerInput
            leftSection={<IconCalendar stroke={1.25} />}
            placeholder="To"
            value={endDate}
            onChange={handleEndDate}
            minDate={startDate ? new Date(startDate) : undefined}
            clearable
            w={200}
          />
        </Group>
      </Box>

      {loading && (
        <Center h={470}>
          <Loader />
        </Center>
      )}

      <ErrorAlert error={error} centered />

      {!loading && !error && (
        <Group justify="center" gap={50}>
          <Paper shadow="sm" px="100" py="md" radius="md" withBorder h={470}>
            <CategoryDonutChart byCategory={byCategory} />
          </Paper>
          <Paper shadow="sm" px="100" py="md" radius="md" withBorder h={470}>
            <ExpenseBarChart byMonth={byMonth} />
            <Divider />
            <Text size="sm" ta="center" mt="xs">
              Total across all months: ${total}
            </Text>
          </Paper>
        </Group>
      )}
    </>
  );
}