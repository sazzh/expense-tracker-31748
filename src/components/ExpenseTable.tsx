import { Table } from "@mantine/core";
import type { Expense } from "../types/Expense";

type ExpenseTableProps = {
    data: Expense[],
};

export default function ExpenseTable(props: ExpenseTableProps) {
    return (
        <Table>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>ID</Table.Th>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Expense</Table.Th>
                    <Table.Th>Amount ($)</Table.Th>
                    <Table.Th>Category</Table.Th>
                    <Table.Th>Description</Table.Th>
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
                    </Table.Tr>
                )}
            </Table.Tbody>
        </Table>
    );
}