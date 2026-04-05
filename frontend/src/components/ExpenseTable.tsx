import { ActionIcon, Box, Paper, Table, Text } from "@mantine/core";
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { type Expense } from "../types/Expense";
import { useEffect, useState } from "react";

export default function ExpenseTable() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/expenses');

        if (!res.ok) {
          throw new Error(`Failed to fetch expenses: ${res.status} ${res.statusText}`);
        }

        const data: Expense[] = await res.json();
        console.log(data);
        setExpenses(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <Box mx="auto" w="100%" maw="1050" p="sm">
    <Paper shadow="sm" radius="md" withBorder style={{overflow: "hidden"}}>
      <Table verticalSpacing="xs" highlightOnHover striped stripedColor="primary.0">
        <Table.Thead bg="primary.3">
          <Table.Tr>
            <Table.Th ta="center">ID</Table.Th>
            <Table.Th ta="center">Date</Table.Th>
            <Table.Th ta="center">Expense</Table.Th>
            <Table.Th ta="center">Amount ($)</Table.Th>
            <Table.Th ta="center">Category</Table.Th>
            <Table.Th ta="center">Description</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {expenses.map((expense) =>
            <Table.Tr key={expense.id}>
              <Table.Td>{expense.id}</Table.Td>
              <Table.Td>{new Intl.DateTimeFormat('en-AU').format(new Date(expense.date))}</Table.Td>
              <Table.Td>{expense.name}</Table.Td>
              <Table.Td>{"$" + (expense.amount_cents / 100).toFixed(2)}</Table.Td>
              <Table.Td>{expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}</Table.Td>
              <Table.Td>{expense.description ?? "-"}</Table.Td>
              <Table.Td style={{ width: "9%" }}>
                  <ActionIcon.Group>
                    <ActionIcon variant="subtle" aria-label="Edit Expense">
                      <IconEdit stroke={1.25} color="black" />
                    </ActionIcon>
                    <ActionIcon variant="subtle" aria-label="Delete Expense">
                      <IconTrash stroke={1.25} color="var(--danger)" />
                    </ActionIcon>
                  </ActionIcon.Group>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </Paper>
    </Box>
  );
}