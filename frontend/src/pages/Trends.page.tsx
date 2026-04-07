import { Box, Text } from "@mantine/core";
import BackButton from "../components/BackButton";

export function TrendsPage() {
  return (
    <>
      <BackButton />
      <Box mx="auto" w="100%" maw="1050" p="sm" pt="0">
        <h1 className="title">Your Expense Trends</h1>
        <Text c="dimmed" size="sm" ml="lg">Welcome to your expense trends!</Text>
        <Text c="dimmed" size="sm" ml="lg" mb="lg">Here you can view your spending patterns by 
          category as well as monthly expenditure trends.</Text>
      </Box>
    </>
  )
}