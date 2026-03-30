import { Button } from "@mantine/core";
import ExpenseTable from "../components/ExpenseTable";
import { mockData } from "../types/Expense";

export function HomePage() {
  return (
    <>
      <h1>Expense Tracker</h1>
      <ExpenseTable data={mockData}/>
      <Button mt="sm" c="black">Add new expense</Button>
    </>
  )
}