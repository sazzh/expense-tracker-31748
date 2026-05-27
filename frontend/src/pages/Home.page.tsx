import { Box, Button, Text } from "@mantine/core";
import ExpenseTable from "../components/ExpenseTable";
import { useNavigate } from "react-router";
import { IconPlus } from "@tabler/icons-react";

export function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <Box mx="auto" w="100%" maw="1050" p="sm">
        <h1 className="title">Your Expense Logbook</h1>
        <Text c="dimmed" size="sm" ml="lg">Welcome to your expense logbook!</Text>
        <Text c="dimmed" size="sm" ml="lg">Here you can view and manage all your expenses.</Text>
        <Text c="dimmed" size="sm" ml="lg" mb="lg">Click on view trends to see your detailed spending patterns.</Text>
        <ExpenseTable />
        <div className="btn">
          <Button leftSection={<IconPlus />} variant="light" onClick={() => navigate('/expense')}>
            Add Expense
          </Button>
          <Button variant="light" color="gray" onClick={() => navigate('/trends')}>
            View Trends
          </Button>
        </div>
      </Box>
    </>
  )
}