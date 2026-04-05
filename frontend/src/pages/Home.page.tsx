import { Button } from "@mantine/core";
import ExpenseTable from "../components/ExpenseTable";

export function HomePage() {
  return (
    <>
      <h1>Expense Tracker</h1>
      <ExpenseTable />
      <Button mt="sm" c="black">Add new expense</Button>
    </>
  )
}