import { Box, Button, Group, Paper, Text } from "@mantine/core";
import { useNavigate, useParams } from "react-router";
import { getUser, getUserExpenses } from "../api/Users";
import { useEffect, useState } from "react";
import type { User } from "../types/User";
import type { Expense } from "../types/Expense";
import BackButton from "../components/BackButton";

export function UserPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState<User>();
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const user: User = await getUser(id!);
        const expenses: Expense[] = await getUserExpenses(id!);
        setUser(user);
        setExpenses(expenses);
      } catch (err) {
        console.log(err);
      } finally {
        console.log("implement loading status");
      }
    };
    fetchUsers();
  }, [id]);

  if (!user) {
    return (
      <Box p="xl">
        <Text>Loading...</Text>
      </Box>
    );
  }

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <>
      <Box mx="auto" w="100%" maw="1050" p="sm">
        <BackButton />
        <h1 className="title">Manage {user.username}</h1>
        <Paper shadow="sm" radius="md" pl="md" withBorder>
          <h3 style={{ marginBottom: '0.5rem' }}>User Details</h3>
          <Text c="dimmed" size="sm" ml="md" mt={0}>Username: {user.username}.</Text>
          <Text c="dimmed" size="sm" ml="md">User ID: {user.id}.</Text>
          <Text c="dimmed" size="sm" ml="md">Role: {user.role}.</Text>
          <h3 style={{ marginBottom: '0.5rem' }}>Expense Summary</h3>
          <Text c="dimmed" size="sm" ml="md">Total expenses: {expenses.length}.</Text>
          <Text c="dimmed" size="sm" ml="md" mb="lg">Total spent: ${(totalSpent).toFixed(2)}.</Text>

        </Paper>
        <Group mt="lg">
          <Button variant="light" color="gray" onClick={() => navigate(`/admin/users/${user.id}/expenses`)}>
            View Activity
          </Button>
          <Button variant="light">
            Edit Details
          </Button>
          <Button variant="light" color="red">
            Delete User
          </Button>
        </Group>
      </Box>
    </>
  )
}