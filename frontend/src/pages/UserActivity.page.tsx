import { Box, Center, Group, Loader, Paper, Text } from "@mantine/core";
import { useParams } from "react-router";
import { getUser, getUserExpenses } from "../api/Users";
import { useEffect, useState } from "react";
import type { User } from "../types/User";
import type { Expense } from "../types/Expense";
import BackButton from "../components/BackButton";
import { IconCoin } from "@tabler/icons-react";
import ErrorAlert from "../components/ErrorAlert";

export function UserActivityPage() {
  const { id } = useParams();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const user: User = await getUser(id!);
        const expenses: Expense[] = await getUserExpenses(id!);
        setUser(user);
        setExpenses(expenses);
      } catch (err) {
        setError("Unable to retrieve user and/or their expenses. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [id]);

  if (loading) {
		return (
			<Center h={470}>
				<Loader />
			</Center>
		)
	}

	if (error) return <ErrorAlert error={error} centered />
	if (!user) return <ErrorAlert error="User not found" />

  return (
    <>
      <Box mx="auto" w="100%" maw="1050" p="sm">
        <BackButton />
        <h1 className="title">{user.username}'s Activity</h1>
        <Text c="dimmed" size="sm" ml="lg">Viewing expense history of {user.role} {user.username}.</Text>

        <Box mt="lg">
          {expenses.map(expense => (
            <Paper key={expense.id} shadow="xs" radius="md" p="md" mb="sm" withBorder style={{ borderColor: "#e5e5e5" }}>
              <Group justify="space-between" align="center">
                <Box style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <IconCoin stroke={1.25} size={50} style={{ marginLeft: '1rem'}} />
                  <Box pl="xl">
                    <Text fw={500} size="lg">{expense.name}</Text>
                    <Text size="sm" c="dimmed">{expense.description}</Text>
                    <Text size="sm" c="dimmed">{expense.category}</Text>
                    <Text size="sm" c="dimmed">${expense.amount.toFixed(2)}</Text>
                  </Box>
                </Box>
                <Box pr="sm" ta="right">
                  <Text size="xs" c="dimmed">Created: { new Intl.DateTimeFormat('en-AU', { dateStyle: "medium", timeStyle: "short" }).format(new Date(expense.created_at))}</Text>
                  <Text size="xs" c="dimmed">Last updated: { new Intl.DateTimeFormat('en-AU', { dateStyle: "medium", timeStyle: "short" }).format(new Date(expense.updated_at))}</Text>
                </Box>
              </Group>
            </Paper>
          ))}
        </Box>
      </Box>
    </>
  )
}