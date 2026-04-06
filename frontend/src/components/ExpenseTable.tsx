import { ActionIcon, Badge, Box, Paper, Table, Text, TextInput } from "@mantine/core";
import { IconEdit, IconSearch, IconTrash } from '@tabler/icons-react'
import { CATEGORY_COLOURS, type Expense } from "../types/Expense";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteExpense, getExpenses } from "../api/Expenses";

export default function ExpenseTable() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      try {
        const data: Expense[] = await getExpenses();
        setExpenses(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const filtered = expenses.filter((expense) =>
    expense.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) { return }
    await deleteExpense(id);
    setExpenses(expenses.filter(expense => expense.id !== id));
  }

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <Box>
    <TextInput mb="md" leftSection={<IconSearch stroke={1.25} />} placeholder="Search expenses..." value={search} onChange={(e) => setSearch(e.target.value)} />
    <Paper shadow="sm" radius="md" withBorder style={{overflow: "hidden"}}>
      <Table verticalSpacing="xs" highlightOnHover striped stripedColor="primary.0">
        <Table.Thead bg="primary.3">
          <Table.Tr>
            <Table.Th w={60} ta="center">ID</Table.Th>
            <Table.Th w={130} ta="center">Date</Table.Th>
            <Table.Th w={220}>Expense</Table.Th>
            <Table.Th w={150}>Amount ($)</Table.Th>
            <Table.Th w={180}>Category</Table.Th>
            <Table.Th w={220}>Description</Table.Th>
            <Table.Th w={90}>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filtered.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={7} align="center">
                <Text c="dimmed" size="sm" py="xl">No expenses found.</Text>
              </Table.Td>
            </Table.Tr>
          ) : (
          filtered.map((expense) =>
            <Table.Tr key={expense.id}>
              <Table.Td ta="center">{expense.id}</Table.Td>
              <Table.Td ta="center">{new Intl.DateTimeFormat('en-AU').format(new Date(expense.date))}</Table.Td>
              <Table.Td>{expense.name}</Table.Td>
              <Table.Td>{"$" + (expense.amount_cents / 100).toFixed(2)}</Table.Td>
              <Table.Td>
                <Badge variant="light" radius="sm" color={CATEGORY_COLOURS[expense.category]}>
                  {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
                </Badge>
              </Table.Td>
              <Table.Td>{expense.description ?? ""}</Table.Td>
              <Table.Td>
                  <ActionIcon.Group>
                    <ActionIcon variant="subtle" aria-label="Edit Expense"
                      component={Link} to={`/expense/${expense.id}`}>
                      <IconEdit stroke={1.25} color="black" />
                    </ActionIcon>
                    <ActionIcon variant="subtle" aria-label="Delete Expense"
                      onClick={() => handleDelete(expense.id)}>
                      <IconTrash stroke={1.25} color="var(--danger)" />
                    </ActionIcon>
                  </ActionIcon.Group>
              </Table.Td>
            </Table.Tr>
          ))
        }
        </Table.Tbody>
      </Table>
    </Paper>
    </Box>
  );
}