import { ActionIcon, Badge, Box, LoadingOverlay, Paper, Table, Text, Pagination, Group } from "@mantine/core";
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { CATEGORY_COLOURS, type Category, type Expense } from "../types/Expense";
import { useEffect, useState } from "react";
import { deleteExpense, getExpenses } from "../api/Expenses";
import ExpenseFilters from "./ExpenseFilters";
import ExpenseModal from "./ExpenseModal";
import { capitalise } from "../utils/capitaliseFormat";

export default function ExpenseTable() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [initialMode, setInitialMode] = useState<"view" | "edit">("view");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;

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

  useEffect(() => {
    setPage(1);
  }, [search, category]);

  const openView = (id: string) => { setSelectedId(id); setInitialMode("view"); };
  const openEdit = (id: string) => { setSelectedId(id); setInitialMode("edit"); };

  const filtered = expenses.filter((expense) => {
    const matchesSearch = expense.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category.length > 0 ? category.includes(expense.category) : true;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) { return }
    await deleteExpense(id);
    setExpenses(expenses.filter(expense => expense.id !== id));
  }

  if (loading) return <LoadingOverlay visible={true} />;

  return (
    <Box>
    <ExpenseFilters search={search} onSearchChange={setSearch} category={category} onCategoryChange={setCategory} />
    <Paper shadow="sm" radius="md" withBorder style={{overflow: "hidden"}}>
      <Table verticalSpacing="xs" highlightOnHover>
        <Table.Thead bg="gray.1">
          <Table.Tr>
            <Table.Th w={60} ta="center" fw={600}>ID</Table.Th>
            <Table.Th w={130} ta="center" fw={600}>Date</Table.Th>
            <Table.Th w={220} fw={600}>Expense</Table.Th>
            <Table.Th w={150} fw={600}>Amount ($)</Table.Th>
            <Table.Th w={180} fw={600}>Category</Table.Th>
            <Table.Th w={220} fw={600}>Description</Table.Th>
            <Table.Th w={90} fw={600}>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {error ? (
            <Table.Tr>
              <Table.Td colSpan={7} align="center">
                <Text c="dimmed" size="sm" py="xl">Unable to retrieve your expenses currently. Please try again later.</Text>
              </Table.Td>
            </Table.Tr>
          ) : filtered.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={7} align="center">
                <Text c="dimmed" size="sm" py="xl">No expenses found.</Text>
              </Table.Td>
            </Table.Tr>
          ) : (
          paginated.map((expense) =>
            // each row (expense) is clickable to view it in modal
            <Table.Tr key={expense.id} onClick={() => openView(expense.id)} style={{ cursor: "pointer" }}>
              <Table.Td ta="center">{expense.id}</Table.Td>
              <Table.Td ta="center">{new Intl.DateTimeFormat('en-AU').format(new Date(expense.date))}</Table.Td>
              <Table.Td>{expense.name}</Table.Td>
              <Table.Td>${expense.amount.toFixed(2)}</Table.Td>
              <Table.Td>
                <Badge variant="dot" radius="lg" color={CATEGORY_COLOURS[expense.category]}>
                  {capitalise(expense.category)}
                </Badge>
              </Table.Td>
              <Table.Td c="dimmed">{expense.description ?? ""}</Table.Td>
              <Table.Td>
                  <ActionIcon.Group>
                    <ActionIcon variant="subtle" aria-label="Edit Expense"
                      // as row is clickable for view, stop propagation allows icon to be edit instead of view
                      onClick={(e) => { e.stopPropagation(); openEdit(expense.id) }}>
                      <IconEdit stroke={1.25} color="var(--mantine-color-text)" />
                    </ActionIcon>
                    <ActionIcon variant="subtle" aria-label="Delete Expense"
                      onClick={(e) => { e.stopPropagation(); handleDelete(expense.id) }}>
                      <IconTrash stroke={1.25} color="var(--danger)" />
                    </ActionIcon>
                  </ActionIcon.Group>
              </Table.Td>
            </Table.Tr>
          ))
        }
        </Table.Tbody>
      </Table>
      <ExpenseModal expenseId={selectedId ?? ""}
        opened={!!selectedId}
        onClose={() => setSelectedId(null)}
        initialMode={initialMode} />
    </Paper>
    {filtered.length > PAGE_SIZE && (
        <Group justify="center" pt="md">
          <Pagination
            value={page}
            onChange={setPage}
            total={Math.ceil(filtered.length / PAGE_SIZE)}
            size="sm"
            variant="light"
            color="violet.1"
          />
        </Group>
      )}
    </Box>
  );
}