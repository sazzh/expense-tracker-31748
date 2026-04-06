import { Box, Button, Text } from "@mantine/core";
import ExpenseTable from "../components/ExpenseTable";
import { useNavigate } from "react-router";

export function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <Box mx="auto" w="100%" maw="1050" p="sm">
        <h1 style={{ textAlign: 'left', marginBottom: '1rem' }}>Your Expense Logbook</h1>
        <Text c="dimmed" size="sm" ml="sm">Welcome to your expense logbook! Here you can view and manage all your expenses.</Text>
        <Text c="dimmed" size="sm" ml="sm" mb="md">Click on view trends to see your detailed spending patterns.</Text>
        <ExpenseTable />
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <Button c="black"  onClick={() => navigate('/expense')}>Add new expense</Button>
        </div>
      </Box>
    </>
  )
}