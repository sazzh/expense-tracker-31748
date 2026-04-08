import { Box, Stack, Text } from "@mantine/core";
import BackButton from "../components/BackButton";
import { useEffect, useState } from "react";
import { getExpensesByCategory } from "../api/Expenses";
import { type CategoryTotal } from "../types/Trends";
import CategoryDonutChart from "../components/CategoryDonutChart";

export function TrendsPage() {
  const [byCategory, setByCategory] = useState<CategoryTotal[]>([]);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const categoryTrend = await getExpensesByCategory();
        setByCategory(categoryTrend);
      } catch (error) {
        console.error("Error fetching category trends:", error);
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
      <Stack align="center" justify="center">
        <Text size="sm">Total expenditure by category:</Text>
        <CategoryDonutChart byCategory={byCategory} />
      </Stack>      
    </>
  )
}