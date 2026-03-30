import { ActionIcon, Box, Paper, Table } from "@mantine/core";
import type { Expense } from "../types/Expense";
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { useState } from "react";

type ExpenseTableProps = {
  data: Expense[],
};

export default function ExpenseTable(props: ExpenseTableProps) {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('expense_storage_key');
    return saved ? JSON.parse(saved) : [];
  });

  const deleteExpense = (id: string) => {
    const expenseToDel = expenses.find(expense => expense.id === id);
    if (window.confirm(`Are you sure you want to delete "${expenseToDel.expense}"?`)) {
      setExpenses(expenses.filter(expense => expense.id !== id));
    }
  }

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
          {props.data.map((row) =>
            <Table.Tr key={row.expenseId}>
              <Table.Td>{row.expenseId}</Table.Td>
              <Table.Td>{new Intl.DateTimeFormat('en-AU').format(row.date)}</Table.Td>
              <Table.Td>{row.expense}</Table.Td>
              <Table.Td>{(row.amount / 10).toFixed(2)}</Table.Td>
              <Table.Td>{row.category}</Table.Td>
              <Table.Td>{row.description}</Table.Td>
              <Table.Td style={{ width: "9%" }}>
                  <ActionIcon.Group>
                    <ActionIcon variant="subtle" aria-label="Edit Expense"
                      
                      >
                      <IconEdit size={28} stroke={1.25} color="black" />
                    </ActionIcon>
                    <ActionIcon variant="subtle" aria-label="Delete Expense"
                      onClick={() => deleteExpense(row.expenseId)} 
                      >
                      <IconTrash size={28} stroke={1.25} color="var(--danger)" />
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