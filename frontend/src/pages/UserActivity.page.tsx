import { ActionIcon, Box, Button, Group, Text } from "@mantine/core";
import { useNavigate, useParams } from "react-router";
import { getUser, getUserExpenses } from "../api/Users";
import { useEffect, useState } from "react";
import type { User } from "../types/User";
import type { Expense } from "../types/Expense";

export function UserActivityPage() {
  const { id } = useParams();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const user: User = await getUser(id);
        const expenses: Expense[] = await getUserExpenses(id);
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

  // if not expenses then display no expenses / history

  return (
    <>
      <Box mx="auto" w="100%" maw="1050" p="sm">
        <h1 className="title">{user.username}'s Activity</h1>
        <Text c="dimmed" size="sm" ml="lg">Viewing expense history of {user.role} {user.username}.</Text>

        <Box mt="lg">
          {expenses.map(expense => (
            <Box key={expense.id} p="xs" mb="sm" style={{ border: "2px solid #eee", borderRadius: 12 }}>
              <Group justify="space-between" align="center">
                <div style={{ paddingLeft: '2rem' }}>
                  <Text fw={500}>{expense.name}</Text>
                  <Text size="sm" c="dimmed">{expense.description}</Text>
                  <Text size="sm" c="dimmed">{expense.category}</Text>
                  <Text size="sm" c="dimmed">{"$" + (expense.amount_cents / 100).toFixed(2)}</Text>
                </div>
              </Group>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  )
}