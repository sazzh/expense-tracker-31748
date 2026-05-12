import { Box, Text } from "@mantine/core";
import { useNavigate } from "react-router";

export function AdminPage() {
  const navigate = useNavigate();

  return (
    <>
      <Box mx="auto" w="100%" maw="1050" p="sm">
        <h1 className="title">Expense Tracker Activity</h1>
        <Text c="dimmed" size="sm" ml="lg">View all users accounts and their activity.</Text>
      </Box>
    </>
  )
}